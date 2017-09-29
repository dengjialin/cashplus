import React,{Component,PropTypes} from 'react'
import Item from './Item'
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableHighlight,
    Animated,
    Easing,
    Dimensions,
    Picker,
    TouchableOpacity,
} from 'react-native';
const {width, height} = Dimensions.get('window');
const navigatorH = 64; // navigator height
const [aWidth, aHeight] = [width, 275];
const [left, top] = [0, 0];
class IPicker extends Component {
    static propTypes = {
        initValue:PropTypes.string,
        options:PropTypes.array,
        onSelected:PropTypes.func
    }
    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            choice:this.props.initValue,
            hide: true,
        };
        this.options = this.props.options;
        this.callback = this.props.onSelected;//回调方法
    }
    componentWillUnMount(){
        this.timer && clearTimeout(this.timer);
    }

    render() {
        const {options} = this.props
        let stringOptions = options.map((item)=>{
            return {
                label:typeof item.label === 'string'?item.label:item.label.toString(),
                value:typeof item.value === 'string'?item.value:item.value.toString(),
            }
        })
        if(this.state.hide){
            return (<View />)
        } else {
            return (
                <View style={styles.container} >
                    <Animated.View style={ styles.mask } >
                    </Animated.View>

                    <Animated.View style={[styles.tip , {transform: [{
                        translateY: this.state.offset.interpolate({
                            inputRange: [0, 1],
                            outputRange: [height, (height-aHeight)]
                        }),
                    }]
                    }]}>
                        <View style={styles.tipTitleView} >
                            <Text style={styles.cancelText} onPress={this.cancel.bind(this)}>取消</Text>
                            <Text style={styles.okText} onPress={this.ok.bind(this)} >确定</Text>
                        </View>
                        <Picker
                            style={styles.picker}
                            itemStyle={styles.itemPicker}
                            selectedValue={this.state.choice}
                            onValueChange={choice => this.setState({choice: choice})}>
                            {stringOptions.map((item,i)=>(<Picker.Item label={item.label} value={item.value} key={i}/>))}
                        </Picker>
                    </Animated.View>
                </View>
            );
        }
    }

    componentDidMount() {
    }

    //显示动画
    in() {
        Animated.parallel([
            Animated.timing(
                this.state.opacity,
                {
                    easing: Easing.linear,
                    duration: 500,
                    toValue: 0.8,
                }
            ),
            Animated.timing(
                this.state.offset,
                {
                    easing: Easing.linear,
                    duration: 500,
                    toValue: 1,
                }
            )
        ]).start();
    }

    //隐藏动画
    out(){
        Animated.parallel([
            Animated.timing(
                this.state.opacity,
                {
                    easing: Easing.linear,
                    duration: 500,
                    toValue: 0,
                }
            ),
            Animated.timing(
                this.state.offset,
                {
                    easing: Easing.linear,
                    duration: 500,
                    toValue: 0,
                }
            )
        ]).start();

        this.timer = setTimeout(
            () => this.setState({hide: true}),
            500
        );
    }

    //取消
    cancel(event) {
        if(!this.state.hide){
            this.out();
        }
    }

    //选择
    ok() {
        if(!this.state.hide){
            this.out();
            this.callback(this.state.choice);
        }
    }
    show() {
        if(this.state.hide){
            this.setState({ hide: false}, this.in);
        }
    }
}
const styles = StyleSheet.create({
    container: {
        position:"absolute",
        width:width,
        height:height,
        left:left,
        top:top,
    },
    mask: {
        justifyContent:"center",
        backgroundColor:"#383838",
        opacity:0.8,
        position:"absolute",
        width:width,
        height:height,
        left:left,
        top:top,
    },
    tip: {
        width:aWidth,
        height:aHeight,
        // left:middleLeft,
        backgroundColor:"#fff",
        alignItems:"center",
        justifyContent:"space-between",
    },
    tipTitleView: {
        height:53,
        width:aWidth,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderBottomWidth:0.5,
        borderColor:"#f0f0f0",

    },
    cancelText:{
        color:"#aaa",
        fontSize:16,
        paddingLeft:30,
    },
    okText:{
        color:"#aaa",
        fontSize:16,
        paddingRight:27,
        fontWeight:'bold',
    },
    picker:{
        justifyContent:'center',
        height: 222,//Picker 默认高度
        width:aWidth,
    },
    itemPicker:{
        fontSize:19,
        height:161
    }
});
export default IPicker
export class IPickerItem extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const {onClick,children,extra,icon} = this.props
        return <Item
                {...this.props}
                icon={icon}
                onPress={onClick}
                subName={extra}
                name={children}
        />
    }
}