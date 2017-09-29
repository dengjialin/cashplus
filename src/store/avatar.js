import {observable, action, reaction, runInAction} from 'mobx'
import validator from 'validator'
import {getUserAvatar} from '../service/user/user.base.service'
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
    @observable data = null
    @observable avatar = {
        url:''
    }
    @observable selfie = null
    async getAvatarInfo() {
        const res = await getUserAvatar();
        if(res.result){
            let result = res.result;
            this.data.name = result.name || '';
            this.data.idCard = result.idno || '';
            this.data.nameAndIdCardCanEdit = result.nameAndIdCardCanEdit === undefined ? true : result.nameAndIdCardCanEdit;
            this.data.photoCanEdit = result.photoCanEdit === undefined ? true : result.photoCanEdit;
            this.form.name.value = result.name||''
            this.form.idCard.value = result.idno || ''
            if (result.idSeltUrl) {
                this.avatar = {
                    url: result.idSeltUrl,
                    type: 'idSelf',
                    id: result.selfId
                };
            }
            if (result.idFrontUrl) {
                this.selfie = {
                    url: result.idFrontUrl,
                    type: 'idFront',
                    id: result.frontId
                };

            }
        }
    }
}
export default new Avatar()