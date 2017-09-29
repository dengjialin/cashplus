
import React, {
    Component,
    PropTypes
} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Animated,
    TouchableOpacity,
    TouchableNativeFeedback,
    Platform
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class NavBar extends Component{
    static propTypes = {
        title: PropTypes.string,
        leftIcon: PropTypes.string,
        rightIcon: PropTypes.string,
        leftText:PropTypes.string,
        rightText:PropTypes.string,
        leftPress: PropTypes.func,
        rightPress: PropTypes.func,
        style: PropTypes.object
    }
    static topbarHeight = 64
    _renderLeftBtn(){
        const {leftIcon,leftPress,leftText,leftIconSize=26} = this.props
        if(this.props.leftIcon){
            if(Platform.OS === 'android'){
                return (
                    <TouchableNativeFeedback onPress={leftPress} style={styles.btn}>
                        <Icon name={leftIcon} size={leftIconSize} color="#fff" />
                        {leftText&&<Text style={styles.leftText}>{leftText}</Text>}
                    </TouchableNativeFeedback>
                )
            }else {
                return (<TouchableOpacity onPress={leftPress} style={styles.btn}>
                    <Icon name={leftIcon} size={leftIconSize} color="#fff" />
                    {leftText&&<Text style={styles.leftText}>{leftText}</Text>}
                </TouchableOpacity>)
            }
        }else {
            return (
                <View style={styles.btn}>
                    {leftText&&<Text style={styles.leftText}>{leftText}</Text>}
                </View>
            )
        }
    }
    _renderRightBtn(){
        const {rightIcon,rightPress,rightText,rightIconSize=26} = this.props
        if(this.props.rightIcon){
            if(Platform.OS === 'android'){
                return (
                    <TouchableNativeFeedback onPress={rightPress} style={styles.btn}>
                        {rightText&&<Text style={styles.rightText}>{rightText}</Text>}
                        <Icon name={rightIcon} size={rightIconSize} color="#fff" />
                    </TouchableNativeFeedback>
                )
            }else {
                return (<TouchableOpacity onPress={rightPress} style={styles.btn}>
                    {rightText&&<Text style={styles.rightText}>{rightText}</Text>}
                    <Icon name={rightIcon} size={rightIconSize} color="#fff" />
                </TouchableOpacity>)
            }
        }else {
            return (
                <View style={styles.btn}>
                    {rightText&&<Text style={styles.rightText}>{rightText}</Text>}
                </View>
            )
        }
    }

    render(){
        return(
            <View style={[styles.topbar, this.props.style]}>
                {this._renderLeftBtn()}
                <Animated.Text numberOfLines={1} style={[styles.title, this.props.titleStyle]}>{this.props.title}</Animated.Text>
                {this._renderRightBtn()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    topbar: {
        height: NavBar.topbarHeight,
        backgroundColor: "#0398ff",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 10
    },
    btn: {
        width: 40,
        height: 40,
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftText:{
       marginLeft:5,
        color:'#fff'
    },
    rightText:{
        marginRight:5,
        color:'#fff'
    },
    title:{
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    }
});
