import {observable, action,reaction,runInAction} from 'mobx'
import {getLoanStatus,getLoanRecords,loanApproveNext,getRepaymentInfo,repayLoan,confirmApply} from '../service/home/home.service'
import app from '../common/HttpTools'
class Loan{
    @observable loan = { //借款状态
        steps:[],
        activeStepIndex:0
    };
    @observable curCard = null; //用户当前的等级
    @observable loanRecords = []; //借款记录
    @observable repayment = { //要提交的还款信息
        fullPay: false, //是否全额
        day: '7' //借款天数
    };
    @observable repaymentInfo = null; //获取的还款信息
    @observable showDelayModal = false; //延期还款弹框
    @observable showNowModal = false; //立即还款弹框
    @observable agreementInfo = null; //确认还款信息
    async getLoanStatus(end){
        const res = await getLoanStatus();
        if(res.result){
            runInAction(()=>{
                this.loan = res.result;
                this.curCard = {
                    quota: res.result.amount,
                    tier: res.result.tier,
                    name:this.chooseCardName(res.result.tier)
                };
            })
            if(end){
                end()
            }
        }
        return {
            loan:this.loan,
            curCard:this.curCard
        }
    }
    async getLoanRecords(end){
        const res = await getLoanRecords();
        if(res.result){
            runInAction(()=>{
                this.loanRecords = res.result;
            })
            if(end){
                end()
            }
        }
    }
    async goNextStep(){
        const res = await loanApproveNext();
        if(res&&res.result){
            this.agreementInfo = {...res.result,readPro:false}
            return true
        }
        return false;
    }
    chooseCardName(tier) {
    let name = ''
    switch (tier){
        case 'GOLD':name = '金卡'
            break;
        case 'DIAMOND':name = '钻石卡'
            break;
        case 'PLATINUM':name = '铂金卡'
            break;
    }
    return name;
    }
    async getRepaymentInfo(){
        const res = await getRepaymentInfo();
        if(res.result){
            app.sendMessage(JSON.stringify(res.result))
            this.repaymentInfo = res.result;
        }
    }
    async repay(fullPay){
        let data = null;
        if(fullPay){
            data = {
                fullPay:true
            }
        }else {
            data = this.repayment
        }
        const res = await repayLoan(data);
        if(res.result&&res.result.call === 'form'){
            return res.result
        }else {
            return false
        }
    }
    async confirmApply(){
        if(!this.agreementInfo.readPro){
            app.sendMessage('请阅读并同意服务协议')
            return false
        }
        const res = await confirmApply();
        if(res&&res.msg==='ok'){
            return true
        }
    }
}
export default new Loan()