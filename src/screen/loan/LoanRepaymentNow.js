import React,{Component} from 'react'
import {observer} from 'mobx-react'
import {inject} from '../../store/index'
import { View,StyleSheet,Text,ScrollView} from 'react-native';
import App from '../../common/HttpTools'
import {List,Button,Modal} from 'antd-mobile'
import {Item} from '../../component/index'
const LItem = List.Item
class LoanRepaymentNow extends Component{
    componentDidMount(){
        this.props.loan.getRepaymentInfo()
    }
    render(){
        const {repaymentInfo} = this.props.loan;
        const {navigate} = this.props.navigation;
        if(!repaymentInfo){
            return <View style={{flex:1,backgroundColor:'#fafafa'}}>
                
            </View>
        }else {
            const {dueAmount,dueDate,overdueFee,defaultCardNo,leftDays} = repaymentInfo
            let grace = {
                dayMoney:leftDays>=-7&&leftDays<=-1?overdueFee/(Math.abs(leftDays)):overdueFee/(Math.abs(leftDays)-7+3.5)*3.5, //宽限费用
                amount:leftDays>=-7&&leftDays<=-1?overdueFee:(overdueFee/(Math.abs(leftDays)-7+3.5)*3.5).toFixed(0)
            }
            let overdue = {
                dayMoney:Math.abs(overdueFee/(3.5+Math.abs(leftDays)-7)).toFixed(0), //逾期费用
                amount:((Math.abs(overdueFee/(3.5+Math.abs(leftDays)-7)))*(Math.abs(leftDays)-7)).toFixed(0)
            }
            const infoMessage = {
                grace:(leftDays>=-7&&leftDays<=-1?`您处于宽限期第${Math.abs(leftDays)}天，宽限期每天费用是${grace.dayMoney}元，您有7天的宽限期，宽限期结束后进入逾期状态。`:`您需要结清的宽限期费用，您的借款已处于逾期状态。`),
                overdue:`您处于逾期第${Math.abs(leftDays)-7}天，逾期每天费用是${overdue.dayMoney}元`
            }
            return <View style={{flex:1,backgroundColor:'#fafafa'}}>
                <ScrollView
                    style={{flex:1}}
                >
                    <View style={styles.dueDate}>
                        <View style={[styles.dueDateLabel,{backgroundColor:leftDays<0?'#f76260':'#1aad19'}]}>
                            <Text style={{fontSize:20,color:'#fff',fontWeight:'bold'}}>到期时间</Text>
                            <Text style={{fontSize:20,color:'#fff',fontWeight:'bold'}}>{dueDate}</Text>
                        </View>
                    </View>
                    <List>
                        <LItem extra={(dueAmount+parseFloat(overdueFee)+'元')}>应还金额</LItem>
                        <LItem extra={dueAmount+'元'} onClick={()=>this._showModal('到期金额',<Text style={styles.modalText}>          您在到期日应还的金额</Text>)} arrow="horizontal">到期金额</LItem>
                        {leftDays<0&&<LItem arrow="horizontal" extra={grace.amount+'元'} onClick={()=>this._showModal('宽限费用',
                            <Text style={styles.modalText}>{infoMessage.grace}</Text>
                        )}>宽限费用</LItem>}
                        {leftDays<-7&&<LItem arrow="horizontal" extra={overdue.amount+'元'} onClick={()=>this._showModal('逾期费用',
                            <Text style={styles.modalText}>{infoMessage.overdue}</Text>
                        )}>逾期费用</LItem>}
                    </List>
                    <View style={styles.edge}></View>
                    <List>
                        <LItem extra={defaultCardNo+'(换卡还款)'} wrap={true} arrow="horizontal" onClick={()=>this.props.navigation.navigate('BankCards')}>还款银行卡</LItem>
                    </List>
                    <View style={styles.edge}></View>
                    <List>
                        <LItem arrow="horizontal" onClick={()=>this._showModal('支付宝还款',<Text style={[styles.modalText,{flexDirection:'row'}]}>
                            极速花支付宝账号：<Text style={{color:'#0398ff'}} selectable={true}>service@cashpp.cn</Text>
                            ☆☆注意：请备注好您的姓名和电话，并截图发给小花~
                            花花收到款后24小时之内会更改您的状态，您可再次申请借款。
                        </Text>)}>其他还款方式</LItem>
                    </List>
                    <Button  style={{margin:10}} type="primary"  onClick={()=>this.props.loan.showNowModal = true}>确认还款</Button>
                </ScrollView>
                {this.props.loan.showNowModal&&<Modal title="确认还款"
                                                        transparent={true}
                                                        maskClosable={false}
                                                        visible={true}
                                                        footer={[{
                                                            text: '取消', onPress: () => {
                                                                this.props.loan.showNowModal = false;
                                                            }
                                                        },{text:'确定',onPress:()=>{
                                                            this.props.loan.showNowModal = false;
                                                            this.props.loan.repay(true).then((form)=>form&&navigate('SubmitJsonForm',{form,title:'立即还款'}))
                                                        },style:{color:'#1AAD19'}}]}
                >
                    <Item name="支付金额" subName={(dueAmount+parseFloat(overdueFee))+'元'}  disable={true} first={true}/>
                    <Item name="还款银行卡" subName={defaultCardNo} disable={true}/>
                </Modal>}
            </View>
        }
    }
    _showModal(title,desc){
        App.alert(title,desc)
    }
}
const styles = StyleSheet.create({
    dueDate:{
        width:rnScreen.width,
        paddingVertical:20,
        alignItems:'center',
        justifyContent:'center'
    },
    dueDateLabel:{
        width:rnScreen.width/2,
        height:rnScreen.width/2,
        borderRadius:rnScreen.width/4,
        alignItems:'center',
        justifyContent:'center'
    },
    dueDateText:{
        textAlign:'center',
        color:'#fff',
        fontSize:18
    },
    edge:{
        width:rnScreen.width,
        height:10,
        backgroundColor:'#fafafa'
    },
    modalText:{
        padding:10,
        width:300,
        height:75,
        justifyContent:'center',
        alignItems:'center',
        fontSize:16
    }
})
export default inject('loan')(observer(LoanRepaymentNow))