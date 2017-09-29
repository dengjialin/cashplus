import {get,post} from '../../common/HttpTools'
const getCardList =  function(timeout){
    return get({
        url:'/loan/apply/start',
        timeout
    })
}
const applyLoan = function (data) {
    return post({
        url:'/loan/apply/applied',
        data:data
    })
}
const getLoanStatus = function () {
    return get({
        url:'/loan/apply/status'
    })
}
const getLoanRecords = function () {
    return get({
        url:'/loan/transaction/record'
    })
}
const loanApproveNext = function () {
    return get({
        url:'/loan/apply/approved'
    })
}
const getRepaymentInfo = function () { //获取个人还款信息
    return get({
        url:'/loan/apply/repay'
    })
}
const repayLoan = function (data) { //还款
    return post({
        url:'/loan/apply/repay',
        data:data
    })
}
const confirmApply = function () { //确认借款
    return post({
        url:'/loan/apply/sign'
    })
}
export {
    getCardList,applyLoan,getLoanStatus,getLoanRecords,loanApproveNext,getRepaymentInfo,repayLoan,confirmApply
}