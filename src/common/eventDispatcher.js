import {NativeEventEmitter,DeviceEventEmitter,NativeAppEventEmitter,Platform} from 'react-native'
var Event = {}
var NativeEvent = {}

//监听rn事件
function listen(eventName,handler){
    var event = DeviceEventEmitter.addListener(eventName,handler);
    Event[eventName] = event;
}

//发送rn事件
function emit(eventName,param){
    DeviceEventEmitter.emit(eventName,param);
}

//移除rn事件
function remove(eventName){
    Event[eventName] && Event[eventName].remove();
    delete Event[eventName];
}

//原生事件
function nativeEventListen(eventName,handler,nativeModule){
    if(Platform.OS === 'ios'){
        const Emitter = new NativeEventEmitter(nativeModule);
        var event = Emitter.addListener(eventName,handler);
        NativeEvent[eventName] = event;
    }
    else{
        var event = NativeAppEventEmitter.addListener(eventName,handler);
        NativeEvent[eventName] = event;
    }
}

//移除原生事件
function removeNativeEvent(eventName){
    nativeEvent[eventName] && nativeEvent[eventName].remove();
    delete NativeEvent[eventName];
}
export {
    listen,emit,remove,nativeEventListen,removeNativeEvent
}