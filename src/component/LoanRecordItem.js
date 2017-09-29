import React,{Component,PropTypes} from 'react'
import {observer} from 'mobx-react'
import {View,Text,StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Item} from './index'
@observer
class LoanRecordItem extends Component{
    static propTypes = {
        record:PropTypes.object.isRequired,
        onClick:PropTypes.func
    }
    render(){
        const {record,onClick} = this.props
        let content = [];
        for (let name in record){
            if({}.hasOwnProperty.call(recordFormMap,name)){
                if(record[name]){
                    content.push(
                        <Item key={name} name={recordFormMap[name].text} disable={true} subName={record[name].toString()+(recordFormMap[name].suffix?recordFormMap[name].suffix:'')}/>
                      )
                }
            }
        }
        let statusClassName = '';
        for(let val of recordStatusMap){
            if(val.status.includes(record.status)){
                statusClassName = val.className;
                break;
            }
        }

        return <View style={styles.container}>
            <View style={{flexDirection:'row',marginBottom:10}}>
                <Icon size={14} name="file-text-o"/>
                <Text style={{fontSize:18,color:'black',fontWeight:'bold',marginLeft:5}}>借款状态<Text style={styles.loanStatusLabel}>{record.statusText}</Text></Text>
            </View>
            <Text style={styles.loanIdLabel}>
                借款编号:{record.refId}
            </Text>
            <View style={styles.loanDetail}>
                {content}
                {record.showProtocol&&<Item name='借款合同' subName='点击查看' subNameColor={'#617e8c'} onPress={()=>onClick(record.refId)}/>}
            </View>
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
    loanStatusLabel:{
        fontSize:18,
        color:rnScreen.primaryColor,
        fontWeight:'bold',
    },
    loanIdLabel:{
        fontSize:16,
        color:'#617e8c',
        fontWeight:'bold',
        marginBottom:5
    },
    loanDetail:{
        padding:5
    }
})
const recordFormMap = {
    applyDate:{
        text:'申请日期'
    },
    fundedDate:{
        text:'放款日期'
    },
    amount:{
        text:'借款金额',
        suffix:'元'
    },
    term:{
        text:'借款期限'
    },
    interest:{
        text:'利息',
        suffix:'元'
    },
    operateFee:{
        text:'手续费',
        suffix:'元'
    },
    extensionFee:{
        text:'延期费',
        suffix:'元'
    },
    fineFee:{
        text:'预期罚金',
        suffix:'元'
    },
    dueAmount:{
        text:'到期应还金钱',
        suffix:'元'
    },
    payoffDate:{
        text:'借款还清日期'
    },
    repaymentAmount:{
        text:'实际还款金额',
        suffix:'元'
    }
}
const recordStatusMap = [{
    status:['FULLY_PAY_OFF'],
    className:'access'
},{
    status:[],
    className:'fail'
},{
    status:['SUBMITTED','TO_ADJUST','APPROVED','SIGNED','APPLIED','PARTIAL_PAY_OFF','REJECTED','CANCELED','OVERDUE','FUNDED','EXTENSION'],
    className:'wait'
},]

export default LoanRecordItem
