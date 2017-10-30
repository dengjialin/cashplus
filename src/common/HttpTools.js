import React, {Component} from 'react'
import {Modal,Toast} from 'antd-mobile'
import {NetInfo,AsyncStorage,Alert} from 'react-native'
import DeviceInfo from 'react-native-device-info'
import {BaseUrl} from './GlobalConfig'
import {navigate} from './Navigation'
const alert = Modal.alert;
const NetInfoDecorator = WrappedComponent => class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isConnected: true,
        }
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('change', this._handleNetworkConnectivityChange);
    }

    _handleNetworkConnectivityChange = isConnected => this.setState({isConnected})

    render() {
        return <WrappedComponent {...this.props} {...this.state}/>
    }
}
const delay = timeout => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            Toast.hide();
            resolve({code:-2,msg:'请求超时'})
        }, timeout * 1000)
    })
}
let currentRequest = {};
const APPID = DeviceInfo.getUniqueID();
const App = {

    config: {
        api: BaseUrl,
        appId:APPID,
        version: 1.1, // app 版本号
        debug: 1,
        expiredTime:2*60*60*1000, //缓存过期时间(毫秒) 目前设定为2小时,
        refreshApi:['/loan/apply/status','/user/info/bindBankCard','user/info/cert'] //存储的是那些不读缓存的借款,比如还款状态接口
    },

    serialize: function (obj) {
        let str = [];
        for (let p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    },

    // build random number
    random: function () {
        return ((new Date()).getTime() + Math.floor(Math.random() * 9999));
    },


    getGUID: function () {
        let S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },


    async isLogin() {
        let res = await this.getAccessToken()
        if(res){
            return true
        }
        return false
    },

    async getAccessToken() {
        let key = 'app_token';

        // {token: '',expire_time: '',user: {userid:1,username:'',head_url}}
        let token = await AsyncStorage.getItem(key);
        if (token === false) {
            return '';
        }
        return typeof (token) === 'string' ? token : '';
    },
    // 获取授权的web url地址  
    async getAuthWebUrl(targetUrl,cb) {
        let token = await App.isLogin();
        let url = 'http://test.cashpp.com/redirect?access_token=' + token + '&url=' + encodeURIComponent(targetUrl + '?HIDE_HEADER=1&ios_ref=1');
        typeof cb === 'function' && cb(url);
        this.config.debug && console.info(url);
    },

    // 清除用户的缓存数据            
    clearUserCache() {
        return this.setASCache('app_token', '');
    },


    async checkLogin(func) {
        let key = 'app_token';
        let value = await AsyncStorage.getItem(key);
        if (value !== null||value!=='') {
            func(value);
        } else {
            func(false);
        }

    },
    setLoginToken(token){
        this.setASCache('app_token',token)
    },
    async getUser(func) {
        let user = await AsyncStorage.getItem('user');
        if (user != null) {
            user = JSON.parse(user);
            func(user);
        }
    },

    async queryASVal(key) {
        let value = await AsyncStorage.getItem(key);
        if (value === null) {

            return false;
        }
        return value;
    },

    setASCache(key, value) { //AsyncStorage的value必须是字符串,要先序列化
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        AsyncStorage.setItem(key, value)
    },

    setCurrentRequest: function (url, errcode) {
        // to do remote alarm platform

        return currentRequest = {
            url: url,
            errcode: errcode
        };
    },

    // core ajax handler
    async send(url, options,config={}) {
        const {timeout,showHud=true} = config;
        if(showHud){
            Toast.loading('加载中',0)
        }
        let self = this;
        let token = null;
        let tokenStr = await this.getAccessToken(); //这里token是字符串
        if(tokenStr){
            token = JSON.parse(tokenStr)
        }else {
            token = ''
        }
        let defaultOptions = {
            method: 'GET',
            headers: { //请求头里要带token
                // 'appId':'ysy',
                // 'token':token,
                'Cookie':token,
                'Content-Type': 'application/json;charset=UTF-8',
            },
        };

        let request = Object.assign({}, defaultOptions, {method:options.method});
        let httpMethod = options['method'].toLocaleUpperCase(); //
        let full_url = '';
        if (httpMethod === 'GET') {
            full_url = this.config.api + url + '?' + this.serialize(options.data);
        } else {
            // handle some to 'POST'
            full_url = this.config.api + url;
        }

        if (this.config.debug) {
            console.log('HTTP has finished %c' + httpMethod + ':  %chttp://' + full_url, 'color:red;', 'color:blue;');
        }
        request.url = full_url;
        // build body data
        if (httpMethod === 'UPLOAD') { //上传图片
            let formData = new FormData();
            for (let k in options.data) {
                formData.append(k, options.data[k]);
            }
            request.method = 'POST'
            request.body = formData;
            request.headers['Content-Type'] = 'multipart/form-data;charset=utf-8';
        }else if(httpMethod==='POST'){
            request.body = JSON.stringify(options['data'])
        }
        // todo support for https
        //self.test(request,'请求') 添加get缓存,过期时间
        let fetchPromise = null;
        let cacheValue = null;
        let readCache = false;
        if(httpMethod==='GET'){
            if(!self.config.refreshApi.includes(url)){ //不刷新的api才走缓存
                cacheValue = await AsyncStorage.getItem(url);
                if(cacheValue&&cacheValue!==''){
                    const now = Date.now();
                    const recent = JSON.parse(cacheValue).expiredTime
                    if(now-recent<this.config.expiredTime){
                        readCache = true;
                    }else {
                        AsyncStorage.setItem(url,'')
                    }
                }
            }
        }
        if(readCache){
            fetchPromise = Promise.resolve(JSON.parse(cacheValue))
        }else {
            fetchPromise =  new Promise((resolve,reject)=>{
                fetch(request.url, request)
                    .then((response) => {
                        if(response.ok){
                            let t = response.headers.map['set-cookie']//如果响应头里有token就保存 ,这里是一个对象
                            if(t){ //保存token
                                //self.test(t,'返回的cookie')
                                self.setLoginToken(t)
                            }
                            return response.json()
                        }else if(response.status===401||response.status===403){ //登录过期
                            self.setLoginToken('')
                            navigate('UserRegister')
                            return {code:-1,msg:'需要登录',needLogin:true}
                        }else {
                            return response.json() //其他错误,带有code和msg,错误提示
                        }
                    })
                    .then((res) => {
                        self.config.debug && console.log(res);
                        Toast.hide();
                        if (res&&res.code) {
                            if(res.code != 0){
                                self.handelErrcode(res);
                                resolve({
                                    ...res,
                                    success:false
                                })
                                return
                            }else { //成功
                                if(httpMethod==='GET'&&(!self.config.refreshApi.includes(url))){ //缓存
                                    res['expiredTime'] = Date.now();
                                    AsyncStorage.setItem(url,JSON.stringify(res))
                                }
                                resolve({
                                    ...res,
                                    success:true,
                                })
                                return
                            }
                        }
                        resolve({
                            ...res,
                            success: true,
                        })
                    })
                    .catch((error) => {
                        Toast.hide();
                        self.sendMessage('网络错误501')
                        reject()
                        console.warn(error);
                    });
            })
        }

        if (timeout === undefined) {
            return fetchPromise
        } else {
            return Promise.race([fetchPromise, delay(timeout)])
        }
    },


    handelErrcode: function (result) {
        this.config.debug&&console.log(result);
        return this.sendMessage(result.msg);
    },

    // 提示类

    sendMessage(msg, title='提示') {
        if (!msg) {
            return false;
        }
        Alert.alert(title, msg);
    },
    //全局显示提示框
    //title:标题,string
    //desc:描述信息,string或reactdom
    //buttons:按钮数组 {text:"",onPress:,style:}
    alert(title,desc,buttons){
        alert(title,desc,buttons)
    },
    showTip(content,type='info',duration=0.5,onClose=()=>{},mask=true){
        switch (type){
            case 'success':Toast.success(content,duration,onClose,mask)
                break;
            case 'fail':Toast.fail(content,duration,onClose,mask)
                break;
            case 'loading':Toast.loading(content,duration,onClose,mask)
                break;
            default:Toast.info(content,duration,onClose,mask)
                break;
        }
    },
    test(data,title='测试数据'){
        if(data){
            const type = typeof data
            let console = ''
            switch (type){
                case 'object':console = JSON.stringify(data)
                    break;
                case 'string':console = data
                    break;
                case 'number':console = data+''
                    break;
                case 'boolean':console = data+''
                    break;
            }
            this.sendMessage(console,title)

        }
    }
};
const get = ({url, params = {}, timeout,showHud}) => {
    return App.send(url,{
        method:'GET',
        data:params
    },{
        showHud,timeout
    })
}
const post = ({url,data={},timeout,showHud}) => {
    return App.send(url,{
        method:'POST',
        data:data
    },{
        timeout,showHud
    })
}
const upload = ({url,data={}}) =>{
    return App.send(url,{
        method:'UPLOAD',
        data:data
    })
}
export { get,post,NetInfoDecorator,upload}
export default  App;