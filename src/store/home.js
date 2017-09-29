import {observable, action,reaction,runInAction} from 'mobx'
import {getCardList,applyLoan} from '../service/home/home.service'
import app from '../common/HttpTools'
class Home{
    @observable cardList = []
    @observable pageInfo = {}
    @observable applyData = {}
    @action
    async init(end){ //scrollview刷新的回调
        try{
            let data = await getCardList();
            const result = data.result
            result.cards.forEach((card)=>{
                card.curTier = result.tier
            })
            runInAction(
                ()=>{
                    let pageInfo = {
                        options: {},
                        fees: result.fees
                    };
                    pageInfo.options.amounts = result.amounts.map(function(item) {
                        return {
                            label: item + '元',
                            value: item + ""
                        }
                    });
                    this.applyData.amount = (result.loan&&result.loan.amount) ? result.loan.amount+'' : pageInfo.options.amounts[0].value;
                    pageInfo.options.days = result.days.map(function(item) {
                        return {
                            label: item + '天',
                            value: item + ''
                        }
                    });
                    this.applyData.day = (result.loan&&result.loan.term) ? result.loan.term+'' : pageInfo.options.days[0].value;
                    this.pageInfo = pageInfo;
                    this.cardList = result.cards;
                    if(end){
                       end()
                    }
                }
            )
        }catch (err){
            if(end){
                end()
            }
        }
    }
    async applyStart(){
        if(!this.validate()) {
            return false
        }
        let res =  await applyLoan(this.applyData)
        if(res.code==='0'){
             return true;
        }
        return false;
    }
    validate() {
        if(this.applyData.amount && this.applyData.day) {
            return true;
        }
        return false;
    }
}
export default new Home()