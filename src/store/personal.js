import {observable, action,reaction,runInAction} from 'mobx'
import validator from 'validator'
import {getUserDetail} from '../service/user/user.base.service'
import { district,findCityByIndex,findIndexArrByCityName} from '../common/ChinaCity'
class Personal{
    @observable form = {
        city:{
            hasError:false,
            data:district,
            value:[],
            rules:[]
        },
        liveAddress:{
            hasError:false,
            value:'',
            rules:[
                {pattern:(val)=>val.trim().length>0,errMsg:'请输入居住地址'}
            ]
        },
        marriage:{
            data:[{label:'已婚',value:'0'},{label:'未婚',value:'1'}],
            hasError:false,
            value:[],
            rules:[
                {pattern:(val)=>val.length>0,errMsg:'请选择婚姻状况'}
            ]
        },
        liveTime:{
            data:[{label:'3-6个月',value:'0'},{label:'1年',value:'1'}],
            hasError:false,
            value:[],
            rules:[
                {pattern:(val)=>val.length>0,errMsg:'请选择居住时间'}
            ]
        },
        education:{
            data:[{label:'本科',value:'0'},{label:'大专',value:'1'}],
            hasError:false,
            value:[],
            rules:[
                {pattern:(val)=>val.length>0,errMsg:'请选择教育背景'}
            ]
        },
        career:{
            data:[{label:'白领',value:'0'},{label:'学生',value:'1'}],
            hasError:false,
            value:[],
            rules:[
                {pattern:(val)=>val.length>0,errMsg:'请选择职业'}
            ]
        },
        incomeMonth:{
            data:[{label:'1000以下',value:'0'},{label:'2000-3000',value:'1'}],
            hasError:false,
            value:[],
            rules:[
                {pattern:(val)=>val.length>0,errMsg:'请选择月收入'}
            ]
        },
        QQ:{
            hasError:false,
            value:'',
            rules:[
                {pattern:(val)=>val.trim().length>0,errMsg:'请输入您的QQ'}
            ]
        }
    }
    @observable formValidate = false
    @observable showSubmitBtn = true
    async getUserDetail(){
        const res = await getUserDetail()
        if(res.result){
            const options = res.result.option //选项
            for(let name in options){
                if({}.hasOwnProperty.call(this.form,name)){
                    this.form[name].data = options[name].map((item)=>{
                        return {
                            label:item.text,
                            value:item.code
                        }
                    })
                }
            }
            const user = res.result.data //信息
            for(let name in user){
                if({}.hasOwnProperty.call(this.form,name)){
                    if(name==='city'){ //city做特殊处理
                        this.form[name].value = findIndexArrByCityName(user[name])
                    }else if(typeof(this.form[name].value)==='object'){
                        this.form[name].value = [user[name]]
                    }else {
                        this.form[name].value = user[name]
                    }
                }
            }
            if(res.result.isEdit){
                this.showSubmitBtn = false
            }
        }
        return this
    }
}
export default new Personal()