import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {inject} from '../../store/index'
import {StyleSheet,View, Animated, Dimensions, Text,TouchableOpacity,DeviceEventEmitter} from 'react-native';
import { Popup,} from 'antd-mobile';
import {IRefreshScrollView, ICard, NavBar, PopupContent} from '../../component/index'
@inject('home')
@observer
class LoanApply extends Component {
    // static LoanApplyPopup = LoanApplyPopup
    constructor(props) {
        super(props)
        this.state = {
            scrollY: new Animated.Value(0),
        }
        this.canNavigate = true

        this._showApplyPopup = this._showApplyPopup.bind(this)
    }

    componentDidMount() {
        this.props.home.init()
    }
    componentWillMount(){
        this.subscription = DeviceEventEmitter.addListener('login',()=>{
            if(this.canNavigate){ //只会导航一次
                this.props.navigation.navigate('UserRegister')
                this.canNavigate = false;
            }
        })
    }
    componentWillUnmount(){
        this.subscription.remove()
    }
    render() {
        const {home, navigation} = this.props
        const {navigate,state,goBack} = navigation
        let leftNavBarButton = {
            leftIcon:'angle-left',
            leftIconSize:18,
            leftPress:() => goBack()
        }
        if(!state.params||!state.params.from){
            leftNavBarButton = {}
        }
        return (
            <View style={[styles.container]}>
                <NavBar
                    title='快速借款'
                    {...leftNavBarButton}
                    rightIcon='user-o'
                    rightIconSize={18}
                    rightPress={() => navigate('UserProfile')}
                />
                <IRefreshScrollView
                    style={styles.cardList}
                    onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
                    )}
                    onRefresh={(end) => home.init(end)}
                >

                    {
                        home.cardList.slice().length > 0 && home.cardList.slice().map((card, i) => {
                            return <ICard cardInfo={card} key={i} onClick={this._showApplyPopup}/>
                        })
                    }
                </IRefreshScrollView>
                {/*<TouchableOpacity onPress={}>*/}
                    {/*<View style={styles.applyBtn}>*/}
                        {/*<Text style={{fontSize: 12, color: '#fff'}}>立即拿钱</Text>*/}
                    {/*</View>*/}
                {/*</TouchableOpacity>*/}
            </View>
        );
    }

    _renderFixedHeader() {

    }

    _showApplyPopup() {
        Popup.show(<PopupContent {...this.props}/>, {
            animationType: 'slide-up',
            maskClosable:true
        })
    }
}
export default LoanApply
const styles = StyleSheet.create({
    header: {
        backgroundColor: "#0398ff",
        paddingTop: 30,
        height: 40,
        paddingHorizontal: 16
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cardList: {
        flex: 1,
        width: 375,
    },
    applyBtn: {
        position: 'absolute',
        left: Dimensions.get('window').width / 2 - 39,
        bottom: 10,
        width: 78,
        height: 78,
        borderRadius: 39,
        paddingVertical: 20,
        backgroundColor: '#0398ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
