import React,{Component} from 'react'
import {observer} from 'mobx-react'
import {inject} from '../../store/index'
import { StyleSheet, View,} from 'react-native';
import {IRefreshScrollView,ICard} from '../../component/index'
import {Steps,Button} from 'antd-mobile'
const Step = Steps.Step
class LoanStatus extends Component{
    componentDidMount(){
        this.props.loan.getLoanStatus()
    }
    render(){
        const {loan,curCard}  = this.props.loan
        const {steps,activeStepIndex} = loan
        let content = []
        if(steps.length>0){
            const stepsArr = steps.slice();
            for(let i = 0;i<stepsArr.length;i++){
                let step = stepsArr.find((s)=>s.index === i)
                content.push(
                    <Step key={step.title} status={i} title={step.title+'   '+step.time} description={step.content}>
                    </Step>
                )
            }
        }
        return <View style={{flex:1,backgroundColor:'#fff'}}>
            <IRefreshScrollView
                style={{flex:1}}
                onRefresh={(end) => this.props.loan.getLoanStatus(end)}
            >
                {curCard&&<ICard cardInfo={curCard}/>}
                {
                    content.length>0?<View style={{padding:10}}>
                        <Steps current={activeStepIndex}>
                            {content}
                        </Steps>
                        </View>
                        :<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    </View>

                }
                {this._renderBtn()}
            </IRefreshScrollView>
        </View>
    }
    _renderBtn(){
        const {status} = this.props.loan.loan;
        const {navigate}  = this.props.navigation
        let btn = null
        switch (status){
            case 'APPROVED': btn = <Button style={styles.btn} type="primary"  onClick={()=>
                this.props.loan.goNextStep().then((res)=>{
                    res&&navigate('BankCards',{form:'LoanStatus'})
                })
            } >下一步</Button>;
            break;
            case 'TO_ADJUST':btn = <Button style={styles.btn} type="primary"  onClick={()=>navigate('UserProfile')}>去修改审核信息</Button>
                break;
            case 'REJECTED':btn = <Button style={styles.btn} type="primary"  onClick={()=>navigate('MoreProducts')}>审核失败</Button>
                break;
            case 'FUNDED':
            case 'EXTENSION':
            case 'PARTIAL_PAY_OFF':btn = <Button  style={styles.btn} type="primary"  onClick={()=>{navigate('LoanRepayment')}}>开始还款</Button>;
            break;
        }
        return btn
    }
}
const  styles = StyleSheet.create({
    bold:{
        fontSize:14,
        fontWeight:'bold'
    },
    btn:{
        marginHorizontal:10
    }
})
export default inject('loan')(observer(LoanStatus))