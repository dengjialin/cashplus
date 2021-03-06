import {Alert} from 'react-native'
/**
 * 时间转换
 * @param dateTime
 * @param fmt
 * @returns {*|string}
 */
const dateFormat = function(dateTime, fmt) {
    var date = new Date(dateTime);
    fmt = fmt || 'yyyy-MM-dd';
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
const cleanString = function (str) {
    if(str&&(typeof str==='string')&&str.length>0){
        return str.replace(/\s/g,'').trim()
    }
}
const alertMsg = function (msg,buttons=[],title='提示',) {
    if (!msg) {
        return false;
    }
    Alert.alert(title,msg,buttons);
}
export {
    dateFormat,cleanString,alertMsg
}