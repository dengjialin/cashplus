import React from 'react';
import { StackNavigator} from 'react-navigation';
import Home from '../screen/Home'
import UserSetting from '../screen/user/UserSetting'
import LoanApply from '../screen/loan/LoanApply'
import {MoreProducts,LoanProtocol,SubmitJsonForm} from '../screen/webView/WebView'
import PhoneValidate from '../screen/webView/PhoneValidate'
import avatar from '../screen/identity/Avatar'
import Relation from '../screen/identity/Relation'
import Personal from '../screen/identity/PersonalInformation'
import UserBankCards from '../screen/user/UserBankCards'
import UserAddCard from '../screen/user/UserAddCard'
import LoanRepayment from '../screen/loan/LoanRepayment'
import LoanAgreement from '../screen/loan/LoanAgreement'
export default  SimpleApp = StackNavigator({
    LoanApply:{
        screen:LoanApply
    },
    Home:{
      screen:Home
    },
    UserSetting:{
        screen:UserSetting
    },
    avatar:{
        screen:avatar
    },
    Relation:{
        screen:Relation
    },
    Personal:{
        screen:Personal
    },
    BankCards:{
        screen:UserBankCards
    },
    UserAddCard:{
        screen:UserAddCard
    },
    PhoneValidate:{
        screen:PhoneValidate
    },
    LoanRepayment:{
        screen:LoanRepayment
    },
    MoreProducts:{
        screen:MoreProducts
    },
    LoanProtocol:{
        screen:LoanProtocol
    },
    LoanAgreement:{
        screen:LoanAgreement
    },
    SubmitJsonForm:{
        screen:SubmitJsonForm
    }
},{
    headerMode:'none'
});
