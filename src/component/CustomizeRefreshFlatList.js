/**
 * Created by yueshengyu on 2017/11/22.
 */
import React, {PureComponent,PropTypes,} from 'react'
import {View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ListView,PixelRatio,Animated,PanResponder,Easing} from 'react-native'
export const pulling = "下拉刷新..."
export const pullok = "松开刷新..."
export const pullrelease = "玩命刷新中..."

export const defaultDuration = 300;
export const defaultTopIndicatorHeight = 50; //顶部刷新指示器的高度
export const isDownGesture = (x, y) => {return y > 0 && (y > Math.abs(x));};
export const dip2px = (dpValue) => {return dpValue * PixelRatio.get()}

export default class RefreshView extends PureComponent{
    static propTypes = {
        contentStyle:PropTypes.object,//外部容器的大小,实际上就是你要定的list的大小
        refreshable: PropTypes.bool,
        isContentScroll: PropTypes.bool,
        onPullRefresh: PropTypes.func,   //下拉刷新的回调
        topIndicatorRender: PropTypes.func, //下拉刷新的render
        topIndicatorHeight: PropTypes.number, //头部的高度
        onPullStateChangeHeight: PropTypes.func, //状态的回调
        onPushing: PropTypes.func,  //此时正在下拉刷新，通知外界
    }
    static defaultProps = {
        refreshable: true,     //是否需要下拉刷新
        isContentScroll: true //内容是否需要跟着滚动，默认为false
    }
    constructor(props){
        super(props)
        this.pullStatus = 'pulling';
        this.topIndicatorHeight = this.props.topIndicatorHeight||defaultTopIndicatorHeight;
        this.defaultXY = {x: 0, y: this.topIndicatorHeight * -1};
        this.duration = this.props.duration ? this.props.duration : defaultDuration;
        this.state = {
            pullPan: new Animated.ValueXY(this.defaultXY),
            atTop: true,
            height: 0,
            width: 0
        }
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this.onShouldSetPanResponder,
            onStartShouldSetPanResponderCapture: this.onShouldSetPanResponder,
            onMoveShouldSetPanResponder: this.onShouldSetPanResponder,
            onMoveShouldSetPanResponderCapture: this.onShouldSetPanResponder,
            onPanResponderTerminationRequest: (evt, gestureState) => false, //这个很重要，这边不放权
            onPanResponderMove: this.onPanResponderMove,
            onPanResponderRelease: this.onPanResponderRelease,
            onPanResponderTerminate: this.onPanResponderRelease,
        });
    }
    onShouldSetPanResponder = (e, gesture) => {
        let y = 0
        if (this.scroll instanceof ListView) { //ListView下的判断
            y = this.scroll.scrollProperties.offset;
        } else if (this.scroll instanceof FlatList) {//FlatList下的判断
            y = this.scroll.getScrollMetrics().offset  //这个方法需要自己去源码里面添加
        }
        //根据y的值来判断是否到达顶部
        this.state.atTop = (y <= 0)
        if (this.state.atTop && isDownGesture(gesture.dx, gesture.dy) && this.props.refreshable) {
            this.lastY = this.state.pullPan.y._value;
            return true;
        }
        return false;
    }
    onPanResponderMove = (e, gesture) => {
        if (isDownGesture(gesture.dx, gesture.dy) && this.props.refreshable) { //下拉
            this.state.pullPan.setValue({x: this.defaultXY.x, y: this.lastY + gesture.dy / PixelRatio.get()});
            this.onPullStateChange(gesture.dy)
        }
    }

    onPanResponderRelease = (e, gesture) => {
        if (this.pullStatus == 'pulling') { //没有下拉到位
            this.resetDefaultXYHandler(); //重置状态
        } else if (this.pullStatus == 'pullok') { //已经下拉到位了
            //传入-1，表示此时进行的是释放刷新的操作
            this.onPullStateChange(-1)
            //进行下拉刷新的回调
            this.props.onPullRefresh && this.props.onPullRefresh();
            //重置刷新的头部到初始位置
            Animated.timing(this.state.pullPan, {
                toValue: {x: 0, y: 0},
                easing: Easing.linear,
                duration: this.duration
            }).start();
            window.setTimeout(this.endRefresh.bind(this),1000)
        }
    }

    //重置刷新的操作
    resetDefaultXYHandler = () => {
        Animated.timing(this.state.pullPan, {
            toValue: this.defaultXY,
            easing: Easing.linear,
            duration: this.duration
        }).start(() => {
            //ui要进行刷新
            this.onPullStateChange(-1)
        });
    }
    /** 数据加载完成后调用此方法进行重置归位
     */
    resolveHandler = () => {
        if (this.pullSatte == 'pullrelease') { //仅触摸松开时才触发
            this.resetDefaultXYHandler();
        }
    }

    beginRefresh = () => {
        if (!this.props.refreshable) { //不支持下拉刷新的时候就不进行了
            return;
        }
        //进行数据的回调
        this.props.onPullRefresh && this.props.onPullRefresh();
        //此时进行状态的改变
        this.onPullStateChange(-1)
        //动画的展示
        Animated.timing(this.state.pullPan, {
            toValue: {x: 0, y: 0},
            easing: Easing.linear,
            duration: this.duration
        }).start();
    }
    endRefresh = ()=>{
        Animated.timing(this.state.pullPan, {
            toValue: this.defaultXY,
            easing: Easing.linear,
            duration: this.duration
        }).start();

    }
    //下拉的时候根据高度进行对应的操作
    onPullStateChange = (moveHeight) => {
        //因为返回的moveHeight单位是px，所以要将this.topIndicatorHeight转化为px进行计算
        let topHeight = dip2px(this.topIndicatorHeight)
        if (moveHeight > 0 && moveHeight < topHeight) { //此时是下拉没有到位的状态
            this.pullStatus = "pulling"
        } else if (moveHeight >= topHeight) { //下拉刷新到位
            this.pullStatus = "pullok"
        } else { //下拉刷新释放,此时返回的值为-1
            this.pullStatus = "pullrelease"
        }

        if (this.props.topIndicatorRender == null) { //没有就自己来
            if (this.pullStatus == "pulling") {
                this.txtPulling && this.txtPulling.setNativeProps({style: styles.show});
                this.txtPullok && this.txtPullok.setNativeProps({style: styles.hide});
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: styles.hide});
            } else if (this.pullStatus == "pullok") {
                this.txtPulling && this.txtPulling.setNativeProps({style: styles.hide});
                this.txtPullok && this.txtPullok.setNativeProps({style: styles.show});
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: styles.hide});
            } else if (this.pullStatus == "pullrelease") {
                this.txtPulling && this.txtPulling.setNativeProps({style: styles.hide});
                this.txtPullok && this.txtPullok.setNativeProps({style: styles.hide});
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: styles.show});
            }
        }
        //告诉外界是否要锁住
        this.props.onPushing && this.props.onPushing(this.pullStatus != "pullrelease")
        //进行状态和下拉距离的回调
        this.props.onPullStateChangeHeight && this.props.onPullStateChangeHeight(moveHeight,topHeight)
    }
    onLayout = (e) => {
        if (this.state.width != e.nativeEvent.layout.width || this.state.height != e.nativeEvent.layout.height) {
            this.scrollContainer && this.scrollContainer.setNativeProps({
                style: {
                    width: e.nativeEvent.layout.width,
                    height: e.nativeEvent.layout.height
                }
            });
            window.alert(e.nativeEvent.layout.height)
            this.state.width = e.nativeEvent.layout.width;
            this.state.height = e.nativeEvent.layout.height;
        }
    }

    render(){
        return             <View style={ this.props.contentStyle || styles.wrap} {...this.panResponder.panHandlers} onLayout={this.onLayout}>

            {this.props.isContentScroll ?
                <View pointerEvents='box-none'>
                    <Animated.View style={[this.state.pullPan.getLayout()]}>
                        {this.renderTopIndicator()}
                        <View ref={(c) => {this.scrollContainer = c;}}
                              style={{width: this.state.width, height: this.state.height}}>
                            {this.getScrollable()}
                        </View>
                    </Animated.View>
                </View> :

                <View>
                    <View ref={(c) => {
                        this.scrollContainer = c;
                    }}
                          style={{width: this.state.width, height: this.state.height}}>
                        {this.getScrollable()}
                    </View>
                    <View pointerEvents='box-none'
                          style={{position: 'absolute', left: 0, right: 0, top: 0}}>
                        <Animated.View style={[this.state.pullPan.getLayout()]}>
                            {this.renderTopIndicator()}
                        </Animated.View>
                    </View>
                </View>}
        </View>

    }

    renderTopIndicator = () => {
        if (this.props.topIndicatorRender == null) {
            return this.defaultTopIndicatorRender();
        } else {
            return this.props.topIndicatorRender();
        }
    }

    defaultTopIndicatorRender = () => {
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                height: defaultTopIndicatorHeight
            }}>
                <ActivityIndicator size="small" color="gray" style={{marginRight: 5}}/>
                <Text ref={(c) => {
                    this.txtPulling = c;
                }} style={styles.hide}>{pulling}</Text>
                <Text ref={(c) => {
                    this.txtPullok = c;
                }} style={styles.hide}>{pullok}</Text>
                <Text ref={(c) => {
                    this.txtPullrelease = c;
                }} style={styles.hide}>{pullrelease}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        flexGrow: 1,
        zIndex: -999,
    },
    hide: {
        position: 'absolute',
        left: 10000,
        backgroundColor: 'transparent'
    },
    show: {
        position: 'relative',
        left: 0,
        backgroundColor: 'transparent'
    }
});