import React, { Component } from 'react'
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native'
import NavBar from '../../component/NavBar'
import Item from '../../component/Item'
import {inject} from '../../store/index'
import {observer} from 'mobx-react'
import App from '../../common/HttpTools'
import {CLIENTWIDTH} from '../../common/GlobalConfig'
//FontAwesome
class UserProfile extends Component {
    constructor(props){
        super(props)
        this.state={
            isLogin:false,
            curUser:''
        }
    }
    componentWillMount(){
        App.isLogin().then((res)=>{
            this.setState({
                isLogin:res
            })
        })
        App.queryASVal('currentUser').then((res)=>res&&this.setState({curUser:res}))
    }
    render(){
        const {navigate} = this.props.navigation
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <NavBar
                    title="账户信息"
                />
                {!this.state.isLogin? <Image
                    style={{width: CLIENTWIDTH, height: 230, alignItems: 'center', backgroundColor: 'transparent'}}
                    source={require('../../resource/img_my_head.png')}
                >
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <View style={styles.avatarContainer}>
                            <Image
                                style={{width: 80, height: 80}}
                                source={require('../../resource/img_default_avatar.png')}
                            />
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.75}
                            style={styles.loginContainer}
                            onPress={()=>navigate('UserRegister')}
                        >
                            <Text style={{color: 'white'}}>点击登录</Text>
                        </TouchableOpacity>
                    </View>
                </Image>:
                    <ScrollView>
                        <Item name="头像" avatar={2} first={true}/>
                        <Item name="用户名" disable={true} subName={this.state.curUser}/>
                        <Item name="我的银行卡" onPress={() => navigate('BankCards')}/>
                        <Item name="我的信息" onPress={() => navigate('UserSetting')}/>
                        <Item name="立即拿钱" onPress={() => this._gotoApply()}/>
                        <Text style={styles.title}>{"精彩内容"}</Text>
                        <Item name="关于我们" icon="mobile" color={'red'} subName="极速花"/>
                        <Item name="更多产品" icon="apple" onPress={() => {
                            navigate('MoreProducts')
                        }}/>
                    </ScrollView>
                }
            </View>
        )
    }
    _gotoApply(){
        this.props.loan.getLoanStatus().then((res)=>{
            let status = res.loan.status;
            if(status&&!['REJECTED',''].includes(status)){
                App.sendMessage('您已有借款,请完成还款后再次申请')
            }else {
                this.props.navigation.navigate('LoanApply',{from:'UserProfile'})
            }
        })
    }
}
export default inject('user','loan')(observer(UserProfile))
const styles = StyleSheet.create({
    title: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        color: "#666"
    },
    avatarContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    loginContainer: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 2
    },

})
