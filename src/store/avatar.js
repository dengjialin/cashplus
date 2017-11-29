import {observable, action, reaction, runInAction} from 'mobx'
import {getUserAvatar,uploadUserImg,submitUserAvatar} from '../service/user/user.base.service'
import {alertMsg} from '../common/Tools'
class Avatar {
    @observable form = {
        name: {
            hasError: false,
            value: '',
            rules: [
                {pattern: (val) => val.trim().length > 0, errMsg: '请输入您的姓名'}
            ]
        },
        idCard: {
            hasError: false,
            value: '',
            rules: [
                {pattern: (val) => val.trim().length > 0, errMsg: '请输入您的身份证'}
            ]
        }
    }
    @observable data = {}
    @observable idSelf = {
        url:''
    }
    @observable idFront = {
        url:''
    }
    async getAvatarInfo() {
        const res = await getUserAvatar();x
        if(res.result){
            let result = res.result;
            this.data.nameAndIdCardCanEdit = result.nameAndIdCardCanEdit === undefined ? true : result.nameAndIdCardCanEdit;
            this.data.photoCanEdit = result.photoCanEdit === undefined ? true : result.photoCanEdit;
            this.form.name.value = result.name||''
            this.form.idCard.value = result.idno || ''
            if (result.idSeltUrl) {
                this.idSelf = {
                    url: result.idSeltUrl,
                    type: 'idSelf',
                    id: result.selfId
                };
            }
            if (result.idFrontUrl) {
                this.idFront = {
                    url: result.idFrontUrl,
                    type: 'idFront',
                    id: result.frontId
                };

            }
        }
    }
    async submit(){
        if(!this.data.nameAndIdCardCanEdit||!this.data.photoCanEdit){
            return alertMsg('不允许修改')
        }
        if(this.idSelf.url===''||this.idFront.url===''){
            return alertMsg('请上传图片')
        }
        let img1 = {
            file:{
                type:'multipart/form-data',
                uri:this.idSelf.url,
                name:this.idSelf.fileName
            },
            type:'idSelf'
        };
        let img2 = {
            file:{
                type:'multipart/form-data',
                uri:this.idFront.url,
                name:this.idFront.fileName
            },
            type:'idFront'
        };
        return Promise.all([this.uploadImg(img1),this.uploadImg(img2)]).then(async ()=>{
            let data = {
                name: this.form.name.value,
                idNumber: this.form.idCard.value,
                idSelf: this.idSelf.id,
                idFront: this.idFront.id
            };
            let res = await submitUserAvatar(data)
            if(res.success){
                alertMsg('提交个人信息成功')
                return true
            }
        })
    }
    async uploadImg(data){
        const {type} = data
        const res = await uploadUserImg(data);
        if(res.success){
            this[type].id = res.result;
        }
    }
}
export default new Avatar()