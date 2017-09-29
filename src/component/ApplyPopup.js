import React,{Component} from 'react'
import { StyleSheet, View,Dimensions,Text} from 'react-native';
import { Button,Popup,Picker} from 'antd-mobile';
import {IPickerItem,Item} from '../component/index'
class PopupContent extends Component{
    constructor(props){
        super(props)
        this.state = {
            day:[],
            amount:[]
        }
    }
    render(){
        const {options,fees} = this.props.home.pageInfo
        const {amount,day} = this.props.home.applyData
        let fee = fees[amount+'-'+day].fee
        let dueDate = fees[amount+'-'+day].dueDate
        let dueAmount = fees[amount+'-'+day].dueAmount
        return         <View style={[styles.popup]}>
            <Picker
                data={options.amounts.slice()}
                title="选择借款金额"
                value={[amount]}
                onChange={(v)=>{this.setState({amount:v});this.props.home.applyData.amount = v[0]}}
                cols={1}
            >
                <IPickerItem>借款金额</IPickerItem>
            </Picker>
            <Picker
                data={options.days.slice()}
                title="选择借款天数"
                value={[day]}
                onChange={(v)=>{this.setState({day:v});this.props.home.applyData.day = v[0]}}
                cols={1}
            >
                <IPickerItem>借款天数</IPickerItem>
            </Picker>
            <Item name="服务费用"  subName={fee} disable={true}/>
            <Item name="应还金额"  subName={dueAmount}  disable={true}/>
            <Item name="还款日期"  subName={dueDate}  disable={true}/>
            <Button type="primary" style={{marginHorizontal:10}} onClick={this._apply.bind(this)}>开始申请</Button>
            <Button style={styles.popupBtn} onClick={()=>Popup.hide()}><Text style={{fontSize:12,color:'#fff'}}>提额</Text></Button>
        </View>
    }
    _apply(){
        this.props.home.applyStart().then((res)=>{
            if(res){
                Popup.hide()
                this.props.navigation.navigate('UserSetting')
            }
        })
    }
}
const styles = StyleSheet.create({
    popup:{
        width:Dimensions.get('window').width,
        height:275,
    },
    popupBtn:{
        position:'absolute',
        left:Dimensions.get('window').width/2-23,
        top:-23,
        width:58,
        height:58,
        borderRadius:29,
        backgroundColor:'#0398ff',
        alignItems:'center',
        justifyContent:'center',
    },
    popupInfo:{
        paddingVertical:30,
        paddingHorizontal:8,
        borderTopColor: "#f5f5f5"
    }
})
export {
    PopupContent
}
