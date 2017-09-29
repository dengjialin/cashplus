import React,{Component,} from 'react'
import {observer} from 'mobx-react'
import {inject} from '../../store/'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Item,NavBar} from '../../component/index'
import {Button} from 'antd-mobile'
class LoanAgreement extends Component{
    render(){
        const {goBack,navigate} = this.props.navigation
        const {agreementInfo} = this.props.loan
        const {realName,amount,dueDate,term,serviceFee,dueAmount,readPro} = agreementInfo
        return <View style={{flex:1,backgroundColor:'#fff'}}>
            <NavBar
                leftIcon="angle-left"
                leftIconSize={18}
                leftPress={() => goBack()}
                title={'确认借款'}
            />
            {agreementInfo?
                <View style={styles.container}>
                    <Item name="借款人" subName={realName} disable={true}/>
                    <Item name="借款金额" subName={amount} disable={true}/>
                    <Item name="借款期限" subName={term} disable={true}/>
                    <Item name="服务费用" subName={serviceFee} disable={true}/>
                    <Item name="还款方式" subName={`一次性还款${dueAmount}元`} disable={true}/>
                    <Item name="还款日期" subName={dueDate} disable={true}/>
                    <View style={styles.protocol}>
                        <TouchableOpacity style={styles.proRadio} onPress={()=>this.props.loan.agreementInfo.readPro = !readPro}>
                            <Icon color={this.props.loan.agreementInfo.readPro?'#4da6f0':'#aaa'} name="check-square" size={18}/>
                        </TouchableOpacity><Text style={{color:'#4da6f0',fontSize:12}} onPress={()=>navigate('LoanProtocol')}>借款协议</Text>
                    </View>
                    <Button style={{margin:10}} type="primary" onClick={
                        ()=>{this.props.loan.confirmApply().then((res)=>res&&goBack())}
                    }>确认借款</Button>
                </View>
                :<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:18}}>暂无信息</Text>
                </View>}
        </View>
    }
}
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#f3f3f3',
        width:rnScreen.width,
        paddingHorizontal:15,
        paddingVertical:20,
        marginVertical:10
    },
    protocol:{
        marginVertical:10,
        marginHorizontal:20,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:"center"
    },
    proRadio:{
        marginRight:4
    }

})
export default inject('loan')(observer(LoanAgreement))
