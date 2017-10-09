import React,{Component} from 'react'
import {observer} from 'mobx-react'
import {inject} from '../../store/index'
import { StyleSheet, Text, View,ScrollView} from 'react-native';
import {NavBar,Item} from '../../component/'
import {Button} from 'antd-mobile'
import app from '../../common/HttpTools'
class UserSetting extends Component{
    componentDidMount(){

        this.props.user.getUserCert();
    }
    render(){
        const {navigate,goBack} = this.props.navigation
        const {cert} = this.props.user
        let certArr = []
        for(let item in cert){
            certArr.push(cert[item].text)
        }
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <NavBar
                    title="认证中心"
                    leftIcon="angle-left"
                    leftIconSize={18}
                    leftPress={() => goBack()}
                />
                    <ScrollView>
                        <Text style={styles.title}>{"认证信息"}</Text>
                        <Item name="身份信息" subName={certArr[0]} onPress={() => navigate('Avatar')}/>
                        <Item name="个人信息" subName={certArr[1]} onPress={() => navigate('Personal')}/>
                        <Item name="手机认证" subName={certArr[2]} onPress={() => navigate('PhoneValidate')}/>
                        <Button  style={{margin:10}} type="primary"  onClick={()=>{this.props.user.submitUserCert().then((res)=>res&&navigate('Loan'))}}>提交审核</Button>
                    </ScrollView>
            </View>
        )
    }

}
export default inject('user')(observer(UserSetting))
const styles = StyleSheet.create({
    title: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        color: "#666"
    },
})