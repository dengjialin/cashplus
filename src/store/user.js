import {observable, action,reaction,runInAction} from 'mobx'
import {login,getValidateCode,getUserCertStatus,getUserBindBankCard,changeBindCard,addNewBankCard
        ,getPhoneValidateUrl,submitCert
} from '../service/user/user.base.service'
import app from '../common/HttpTools'
class User{
    @observable cert = { //验证信息

    }
    @observable cardInfo = { //卡信息和个人信息
        cardList:[],
        userInfo:{},
        activity:null
    }
    @observable newCard = { //新绑定的银行卡
        bankCode: '',
        bankCard: '',
        reservePhoneNumber: ''
    }
    async userLogin(data,callback){
        const result = await login(data);
        if(result.msg === 'ok'){ //登录成功
            app.setASCache('currentUser',data.phone)
            if(callback){
                callback()
            }
        }
    }
    async phoneValidate(){
        const res = await getPhoneValidateUrl();
        if(res.result){
            return res.result.authUrl
        }
        return ''
    }
    async userGetVCode(params,callback){
        const result = await getValidateCode(params);
        if(result.msg === 'ok'){ //获取短信验证码成功
            if(callback){
                callback()
            }
        }
    }
    async getUserCert(){
        const result = await getUserCertStatus();
        if(result.result){
            runInAction(()=>{
                this.cert = result.result;
            })
            return false
        }else if(result.needLogin){
            return true
        }
    }
    async submitUserCert(){
        const res = await submitCert();
        if(res.msg==='ok'){
            return true;
        }
        return false;
    }
    async getBankCards(){
        const res = await getUserBindBankCard();
        if(res.result){
            runInAction(()=>{
                this.cardInfo = res.result;
            })
        }
    }
    async bindCard(){
        const res = await changeBindCard({type:'loan',cardId:this.cardInfo.activity});
        if(res.msg === 'ok'){
          return true
        }
        return false
    }
    async addCard(){
        const res = await addNewBankCard(this.newCard);
        if(res.msg === 'ok'){
            if(res.result.call==='form'){
                app.test(res.result)
                return res.result
            }
        }
        return false
    }
}
export default new User()