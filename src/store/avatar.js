import {observable, action, reaction, runInAction} from 'mobx'
import validator from 'validator'
import {getUserAvatar,uploadUserImg,submitUserAvatar} from '../service/user/user.base.service'
import app from '../common/HttpTools'
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
        const res = await getUserAvatar();
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
            return app.sendMessage('不允许修改')
        }
        if(this.idSelf.id===undefined||this.idFront.id===undefined){
            return app.sendMessage('请上传图片')
        }
        let data = {
            name: this.form.name.value,
            idNumber: this.form.idCard.value,
            idSelf: this.idSelf.id,
            idFront: this.idFront.id
        }
        let res = await submitUserAvatar(data)
        if(res.success){
            return true
        }
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