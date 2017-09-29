import React from 'react'
import {TabNavigator} from 'react-navigation'
import {StyleSheet,Image} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Loan from './loan/Loan'
import UserProfile from './user/UserProfile'
export default TabNavigator({
    UserProfile: {
        screen: UserProfile,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({ tintColor }) => (
                <Icon size={26} name="user-o" color={tintColor}/>
            )
        }
    },
    LoanRecord: {
        screen: Loan ,
        navigationOptions:{
            tabBarLabel: '借款列表',
            tabBarIcon: ({ tintColor }) => (
                <Icon size={26} name="credit-card" color={tintColor}/>
            )
        }
    },

}, {
    tabBarOptions: {
        activeTintColor: '#0398ff',
    },
})
const styles = StyleSheet.create({
    icon: {
        width: 26,
        height: 26,
    },
})
