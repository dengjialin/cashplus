import React,{Component} from 'react'
import {observer} from 'mobx-react'
import {inject} from '../../store/index'
import {View,Text} from 'react-native'
import { NavBar,} from '../../component/index'
import {List,Radio,Button} from 'antd-mobile'
const RadioItem = Radio.RadioItem;
class UserBankCards extends Component{
    componentDidMount(){
        this.props.user.getBankCards()
    }
    render(){
        const {cardInfo} = this.props.user
        const {cardList,userInfo,activity} = cardInfo
        const {goBack} = this.props.navigation;
        return <View style={{flex:1,backgroundColor:'#f3f3f3'}}>
            <NavBar
                leftIcon="angle-left"
            leftIconSize={18}
            leftPress={() => goBack()}
            title={'我的银行卡'}
            />
            <List renderHeader={() => '选择银行卡'}>
                {cardList.slice().length>0&&cardList.slice().map((card,i)=>{
                    return <RadioItem key={i} checked={card.id===activity} onChange={this._onChange.bind(this,card.id)}>
                            {card.bankName+'尾号'+card.cardNo}
                    </RadioItem>
                })}
                <List.Item onClick={()=>this.props.navigation.navigate('UserAddCard')} arrow="horizontal">
                    <Text style={{color:rnScreen.primaryColor}}>添加新的银行卡</Text>
                </List.Item>
            </List>
            <Button style={{margin:10}} type="primary" onClick={
                ()=>this.props.user.bindCard().then((res)=>{
                    if(res){
                        let {state,navigate} = this.props.navigation
                        if(state.params&&state.params.from==='LoanStatus'){
                            navigate('LoanAgreement')
                        }
                    }
                })
            }>保存</Button>
        </View>
    }
    _onChange(id){
        this.props.user.cardInfo.activity = id;
    }
}
export default inject('user')(observer(UserBankCards))