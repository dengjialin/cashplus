import React from 'react';
import { StackNavigator} from 'react-navigation';
import Main from '../screen/User'
import {RegisterProtocol} from '../screen/webView/WebView'
import {UserRegister} from '../screen/user/UserRegister'
export default  SimpleApp = StackNavigator({
    Main:{
        screen:Main
    },
    UserRegister: {
        screen: UserRegister
    },
    RegisterProtocol:{
        screen:RegisterProtocol
    },
}, {
    headerMode: 'none',
    mode: 'modal'
})
