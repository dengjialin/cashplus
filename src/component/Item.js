import React, { Component, PropTypes } from 'react'
import {
    Text,
    View,
    Image,
    StyleSheet,
    Dimensions,
    Platform,
    TouchableHighlight,
    AlertIOS,
    TouchableNativeFeedback
} from 'react-native'
import Button from './Button'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

let {width, height} = Dimensions.get('window')
const itemHeight = 45

const Font = {
    Ionicons,
    FontAwesome
}
class ItemButton extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return (
            <Button style={{marginTop: this.props.first?10:0}} onPress={this.props.onPress}>
                <View style={styles.button}>
                    <Text style={{color: this.props.color || "#000"}}>{this.props.name}</Text>
                </View>
            </Button>
        )
    }
}

export default class Item extends Component {
    constructor(props){
        super(props)
    }
    static propTypes = {
        icon: PropTypes.string, //头部图标
        name: PropTypes.string.isRequired,//标题
        subName: PropTypes.any, //副标题(尾部)
        subNameColor:PropTypes.string, //副标题颜色
        color: PropTypes.string, //图标颜色
        first: PropTypes.bool, //是否是第一个item
        avatar: PropTypes.number, //头像
        disable: PropTypes.bool, //是否可以点击
        iconSize: PropTypes.number, //图标大小
        font: PropTypes.string, //图标库的名字
        onPress: PropTypes.func //点击事件
    }
    _render(){
        let {icon, iconSize, name, subName, color, first, avatar, disable, font,subNameColor,style} = this.props
        font = font||"FontAwesome"
        const Icon = Font[font]
        return (
            <View style={[styles.listItem,style]}>
                {icon?(<Icon name={icon} size={iconSize||20} style={{width: 22, marginRight:5, textAlign:"center"}} color={color || "#4da6f0"} />):null}
                <View style={[styles.listInfo, {borderTopWidth: !first?1:0}]}>
                    <View style={{flex: 1}}><Text>{name}</Text></View>
                    <View style={styles.listInfoRight}>
                        {subName?(<Text style={{color: subNameColor||"#aaa", fontSize:12}}>{subName}</Text>):null}
                        {avatar?(<Image source={avatar} style={{width: 36, height: 36, resizeMode: "cover", overflow:"hidden", borderRadius: 18}}/>):null}
                        {disable?null:(<Font.FontAwesome style={{marginLeft: 10}} name="angle-right" size={18} color="#bbb" />)}
                    </View>
                </View>
            </View>
        )
    }
    render(){
        let { onPress, first, disable } = this.props
        onPress = onPress || (() => {})
        return disable?
            this._render():
            <Button style={{marginTop: first?10:0}} onPress={onPress}>{this._render()}</Button>
    }
}
Item.Button = ItemButton
const styles = StyleSheet.create({
    listItem: {
        height: itemHeight,
        paddingLeft: 16,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    button:{
        height: itemHeight,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    },
    listInfo: {
        height: itemHeight,
        flex: 1,
        paddingRight: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopColor: "#f5f5f5"
    },
    listInfoRight: {
        flexDirection: "row",
        alignItems: "center"
    }
})
