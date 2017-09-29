import React,{Component} from 'react'
import {observer} from 'mobx-react'
import {inject} from '../../store/index'
import {  View} from 'react-native';
import {LoanRecordItem,RefreshFlatList} from '../../component/index'
class LoanRecords extends Component{
    componentDidMount(){
        this.props.loan.getLoanRecords()
    }
    render(){
        const {loanRecords} = this.props.loan
        const arr = loanRecords.slice()
        return <View style={{flex:1,backgroundColor:'#fafafa'}}>
                <RefreshFlatList
                    style={{flex:1}}
                    data={arr}
                    renderItem={({item,i})=>(
                        <LoanRecordItem key={i} record={item} onClick={this._gotoLoanProtocol.bind(this)}/>
                    )}
                    keyExtractor={(item)=>item.refId}
                    onHeaderRefresh={(end)=>{
                        this.props.loan.getLoanRecords()
                        end()
                    }}
                    onEndReachedThreshold={0.1}
                    onFooterRefresh={(end,no)=>{
                        no()
                    }}
                />
        </View>
    }
    _gotoLoanProtocol(loanId){
        this.props.navigation.navigate('LoanProtocol',{loanId})
    }
}
export default inject('loan')(observer(LoanRecords))