/**
 * Created by yueshengyu on 2017/11/22.
 */
'use strict';
import React, {Component,PropTypes} from 'react';
import {FlatList,View,Text,ActivityIndicator,TouchableOpacity,StyleSheet} from 'react-native';
import Pullable from './CustomizeRefreshFlatList';
export default class PullFlatList extends Pullable {
    // constructor(props) {
    //     super(props)
    //     this.state = {
    //         ...this.state,
    //         refreshState:0
    //     }
    //     window.alert(JSON.stringify(this.state))
    // }
    getScrollable = () => {
        return (
            <FlatList
                ref={(c) => this.scroll = c}
                {...this.props}
            />
        );
    }
}
export const RefreshState = {
    Init: 0,
    FooterRefreshing: 2,
    NoMoreData: 3,
    Failure: 4,
}
const DEBUG = false
const log = (text: string) => {DEBUG && console.log(text)}
const footerRefreshingText = '数据加载中…'
const footerFailureText = '点击重新加载'
const footerNoMoreDataText = '已加载全部数据'

export class IFlatList extends Component{
    static propTypes = {
        contentStyle:PropTypes.object,//外部容器的大小,实际上就是你要定的list的大小
        refreshable: PropTypes.bool,
        isContentScroll: PropTypes.bool,
        onPullRefresh: PropTypes.func,   //下拉刷新的回调
        topIndicatorRender: PropTypes.func, //下拉刷新的render
        topIndicatorHeight: PropTypes.number, //头部的高度
        onPullStateChangeHeight: PropTypes.func, //状态的回调
        onPushing: PropTypes.func,  //此时正在下拉刷新，通知外界
        refreshState: PropTypes.number, //下拉刷新的状态
        onLoadMore:PropTypes.func, //回调1 还可加载,回调2 没有数据可以加载
        footerContainerStyle:PropTypes.object,
        footerTextStyle:PropTypes.object
    }

    constructor(props){
        super(props)
        this.state = {
            refreshState:RefreshState.Init
        }
    }
    onEndReached = (info:any) => {
        log('[RefreshListView]  onEndReached   ' + info.distanceFromEnd)

        if (this.shouldLoadMore()) {
            log('[RefreshListView]  onLoadMore')
            this.setState({
                refreshState:RefreshState.FooterRefreshing
            },()=>{
                this.props.onLoadMore && this.props.onLoadMore(()=>this.setState({refreshState:RefreshState.Init}),()=>this.setState({refreshState:RefreshState.NoMoreData}))
            })
        }
    }

    shouldLoadMore = () => {
        log('[RefreshListView]  shouldStartHeaderRefreshing')

        if ([RefreshState.FooterRefreshing,RefreshState.NoMoreData].includes(this.state.refreshState)) {
            return false
        }

        return true
    }

    render(){
        return <PullFlatList
            {...this.props}
            onEndReachedThreshold={this.props.onEndReachedThreshold || 0.1}
            onEndReached={this.onEndReached.bind(this)}
            ListFooterComponent={this.renderFooter}
        />
    }
    renderFooter = () => {
        let footer = null

        let footerContainerStyle = [styles.footerContainer, this.props.footerContainerStyle]
        let footerTextStyle = [styles.footerText, this.props.footerTextStyle]
        switch (this.state.refreshState) {
            case RefreshState.Init:
                footer = (<View style={footerContainerStyle} ><Text></Text></View>)
                break
            case RefreshState.Failure: {
                footer = (
                    <TouchableOpacity
                        style={footerContainerStyle}
                        onPress={() => {
                            this.onEndReached()
                        }}
                    >
                        <Text style={footerTextStyle}>{footerFailureText}</Text>
                    </TouchableOpacity>
                )
                break
            }
            case RefreshState.FooterRefreshing: {
                footer = (
                    <View style={footerContainerStyle} >
                        <ActivityIndicator size="small" color="#888888" />
                        <Text style={[footerTextStyle, {marginLeft: 7}]}>{footerRefreshingText}</Text>
                    </View>
                )
                break
            }
            case RefreshState.NoMoreData: {
                footer = (
                    <View style={footerContainerStyle} >
                        <Text style={footerTextStyle}>{footerNoMoreDataText}</Text>
                    </View>
                )
                break
            }
        }

        return footer
    }

}
const styles = StyleSheet.create({
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        height: 44,
    },
    footerText: {
        fontSize: 14,
        color: '#555555'
    }
})

