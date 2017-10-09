import {get,post,upload} from '../../common/HttpTools'
const login = function (data) { //登录注册(一步)
    return post({
        url:'/user/public/login',
        data:data
    })
}
const getValidateCode = function (params) { //获取短信验证码
    return get({
        url:'/user/public/sms',
        params:params
    })
}
const getPhoneValidateUrl = function () { //获取手机验证地址
    return get({
        url:'/moxie/carrier/mobile/authUrl'
    })
}
const getUserDetail = function () { //获取个人信息
    return get({
        url:'/user/info/cert'
    })
}
const getUserAvatar = function () { //获取个人信息(证件照)
    return post({
        url:'/user/info/basic'
    })
}
const submitUserAvatar = function (data) {
    return post({
        url:'/user/info/basic',
        data
    })
}
const getUserCertStatus = function () { //获取个人验证信息
    return get({
        url:'/user/info/certStatus'
    })
}
const getUserBindBankCard = function () { //获取个人绑定银行卡信息
    return get({
        url:'/user/info/bindBankCard'
    })
}
const submitUserDetail = function (data) { //提交个人信息
    return post({
        url:'/user/info/detail/basic',
        data:data
    })
}
const submitUserContact = function (data) { //提交紧急联系人
    return post({
        url:'/user/into/detail/relationship',
        data:data
    })
}
const submitCert = function (data) { //提交审核
    return post({
        url:'/user/info/certSumbit'
    })
}
const changeBindCard = function (data) { //修改绑定银行卡
    return post({
        url:'/user/info/bindBankCard',
        data:data
    })
}
const addNewBankCard = function (data) { //添加新的银行卡
    return post({
        url:'/user/addBankCard',
        data:data
    })
}
const uploadUserImg = function (data) { //上传图片
    return upload({
        url:'/user/info/photo',
        data:data
    })
}
export {
    login,getValidateCode,getUserCertStatus,getUserDetail,submitUserContact,submitUserDetail,getUserBindBankCard,submitCert,
    changeBindCard,addNewBankCard,getPhoneValidateUrl,getUserAvatar,uploadUserImg,submitUserAvatar
}