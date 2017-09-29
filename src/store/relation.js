import {observable, action,reaction,runInAction} from 'mobx'
import validator from 'validator'
class Relation{
    form = {
        family:{
            data:[{label:'父亲',value:'父亲'},{label:'母亲',value:'母亲'}],
            hasError:false,
            value:[],
            rules:[{pattern:(val)=>!validator.isEmpty(val[0]),errMsg:'请选择家庭联系人'}]
        },
        familyPhone:{
            hasError:false,
            value:'',
            rules:[
                {pattern:(val)=>val.replace(/\s/g,'').trim().length===11,errMsg:'请输入正确的电话号码'}
                ]
        },
        familyName:{
            hasError:false,
            value:'',
            rules:[
                {pattern:(val)=>val.replace(/\s/g,'').trim().length>0,errMsg:'请输入姓名'}
            ]
        },
        friend:{
            data:[{label:'同事',value:'同事'},{label:'室友',value:'室友'}],
            hasError:false,
            value:[],
            rules:[{pattern:(val)=>!validator.isEmpty(val[0]),errMsg:'请选择家庭联系人'}]
        },
        friendPhone:{
            hasError:false,
            value:'',
            rules:[
                {pattern:(val)=>val.replace(/\s/g,'').trim().length===11,errMsg:'请输入正确的电话号码'}
            ]
        },
        friendName:{
            hasError:false,
            value:'',
            rules:[
                {pattern:(val)=>val.replace(/\s/g,'').trim().length>0,errMsg:'请输入姓名'}
            ]
        },
    }
    init(){
        return this
    }
}
export default new Relation()