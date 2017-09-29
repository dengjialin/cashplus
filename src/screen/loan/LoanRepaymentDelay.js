import React,{Component} from 'react'
import {observer} from 'mobx-react'
import {inject} from '../../store/index'
import { View,StyleSheet,ScrollView,} from 'react-native';
import {IPickerItem,Item} from '../../component/index'
import {Picker,List,Button,Modal} from 'antd-mobile'
import App from '../../common/HttpTools'
const LItem = List.Item
class LoanRepaymentDelay extends Component{
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
            const {extensionDays=[],extensionFees,defaultCardNo} = repaymentInfo
            const dataArr = extensionDays.slice().map((i)=>{
                return {
                    label:i+'',
                    value:i+''
                }
            })
            const extensionInfo = extensionFees[this.props.loan.repayment.day]
            const extensionMoney = extensionInfo.extensionFee+extensionInfo.currentFee
            return <View style={{flex:1,backgroundColor:'#fff'}}>
                <ScrollView
                    style={{flex:1}}
                >
                    <View style={styles.edge}></View>
                    <Picker
                        data={dataArr}
                        title="选择延期天数"
                        value={[this.props.loan.repayment.day]}
                        onChange={(v)=>{this.props.loan.repayment.day = v[0]}}
                        cols={1}
                    >
                        <IPickerItem>请选择延期天数</IPickerItem>
                    </Picker>
                    <View style={styles.edge}></View>
                    <List>
                        <LItem extra={extensionMoney+'元'}>
                            延期需扣
                        </LItem>
                        <LItem extra={extensionInfo.extensionFee+'元'} onClick={()=>App.sendMessage('延期所需的手续费','延期手续费')} arrow="horizontal">
                            延期手续费
                        </LItem>
                        <LItem extra={extensionInfo.currentFee+'元'} onClick={()=>App.sendMessage('您当前应还的利息','本息期费')} arrow="horizontal">
                            本息期费
                        </LItem>
                    </List>
                    <View style={styles.edge}></View>
                    <List>
                        <LItem extra={extensionInfo.extensionDueDate}>
                            到期日期
                        </LItem>
                        <LItem extra={extensionInfo.extensionDueAmount+'元'}>
                            到期金额
                        </LItem>
                    </List>
                    <View style={styles.edge}></View>
                    <List>
                        <LItem extra={defaultCardNo+'(换卡还款)'} wrap={true} arrow="horizontal" onClick={()=>this.props.navigation.navigate('BankCards')}>还款银行卡</LItem>
                    </List>
                    <Button  style={{margin:10}} type="primary"  onClick={()=>{this.props.loan.showDelayModal = true}}>{`支付${extensionMoney}元,马上延期`}</Button>
                </ScrollView>
                {this.props.loan.showDelayModal&&<Modal title="延期还款"
                                                        transparent={true}
                                                        maskClosable={false}
                                                        visible={true}
                                                        footer={[{
                                                            text: '取消', onPress: () => {
                                                                this.props.loan.showDelayModal = false;
                                                            }
                                                        },{text:'确定',onPress:()=>{
                                                            this.props.loan.showDelayModal = false;
                                                            this.props.loan.repay(false).then((form)=>form&&navigate('SubmitJsonForm',{form,title:'延期还款'}))
                                                        },style:{color:'#1AAD19'}}]}
                >
                    <Item name="支付金额" subName={extensionMoney+'元'} disable={true} first={true}/>
                    <Item name="还款银行卡" subName={defaultCardNo} disable={true}/>
                </Modal>}
            </View>
        }
    }
}
const styles = StyleSheet.create({
    edge:{
        width:rnScreen.width,
        height:10,
        backgroundColor:'#fafafa'
    }
})
export default inject('loan')(observer(LoanRepaymentDelay))