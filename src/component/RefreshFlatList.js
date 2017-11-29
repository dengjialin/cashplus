/**
 * Created by yueshengyu on 2017/11/28.
 */
import React, {PureComponent} from 'react'
import {View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Dimensions} from 'react-native'

export const RefreshState = {
    Init: 0,
    HeaderRefreshing: 1,
    FooterRefreshing: 2,
    NoMoreData: 3,
    Failure: 4,
}

const DEBUG = false
const log = (text: string) => {DEBUG && console.log(text)}

const footerRefreshingText = '数据加载中…'
const footerFailureText = '点击重新加载'
const footerNoMoreDataText = '已加载全部数据'

type Props = {
    refreshState: number,
    onHeaderRefresh: (refreshState: number) => void,
    onFooterRefresh?: (refreshState: number) => void,
    data: Array<any>,

    footerContainerStyle?: any,
    footerTextStyle?: any,
}

type State = {}

export class RefreshFlatList extends PureComponent {
    props: Props
    static refreshState = {
        Init: 0,
        HeaderRefreshing: 1,
        FooterRefreshing: 2,
        NoMoreData: 3,
        Failure: 4,
    }
    constructor(props){
        super(props)
        this.state = {
            refreshState:RefreshState.Init
        }
    }
    componentWillReceiveProps(nextProps: Props) {
        log('[RefreshListView]  RefreshListView componentWillReceiveProps ' + nextProps.refreshState)
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        log('[RefreshListView]  RefreshListView componentDidUpdate ' + prevProps.refreshState)
    }

    onHeaderRefresh = () => {
        log('[RefreshListView]  onHeaderRefresh')
        if (this.shouldStartHeaderRefreshing()) {
            log('[RefreshListView]  onHeaderRefresh')
            this.setState({
                refreshState:RefreshState.HeaderRefreshing
            },()=>{
                this.props.onHeaderRefresh()
            })
            window.setTimeout(()=>{
                this.setState({refreshState:RefreshState.Init})
            },1000)
        }
    }

    onEndReached = (info: any) => {
        log('[RefreshListView]  onEndReached   ' + info.distanceFromEnd)

        if (this.shouldStartFooterRefreshing()) {
            log('[RefreshListView]  onFooterRefresh')
            this.setState({
                refreshState:2
            },()=>{
                this.props.onFooterRefresh && this.props.onFooterRefresh((hasNext)=>{
                    if(hasNext){
                        this.setState({refreshState:RefreshState.Init})
                    }else {
                        this.setState({refreshState:RefreshState.NoMoreData})
                    }
                })
            })
        }
    }

    shouldStartHeaderRefreshing = () => {
        log('[RefreshListView]  shouldStartHeaderRefreshing')

        if (this.state.refreshState === RefreshState.HeaderRefreshing ||
            this.state.refreshState === RefreshState.FooterRefreshing) {
            return false
        }

        return true
    }

    shouldStartFooterRefreshing = () => {
        log('[RefreshListView]  shouldStartFooterRefreshing')

        let {data} = this.props
        if (data.length === 0) {
            return false
        }else if([RefreshState.FooterRefreshing,RefreshState.NoMoreData].includes(this.state.refreshState)){
            return false;
        }

        return true;
    }

    render() {
        log('[RefreshListView]  render')

        return (
            <FlatList
                {...this.props}
                onEndReached={this.onEndReached}
                onRefresh={this.onHeaderRefresh}
                refreshing={this.state.refreshState === RefreshState.HeaderRefreshing}
                ListFooterComponent={this.renderFooter}
            />
        )
    }

    renderFooter = () => {
        let footer = null

        let footerContainerStyle = [styles.footerContainer, this.props.footerContainerStyle]
        let footerTextStyle = [styles.footerText, this.props.footerTextStyle]

        switch (this.state.refreshState) {
            case RefreshState.Init:
                footer = (<View style={footerContainerStyle} />)
                break
            case RefreshState.Failure: {
                footer = (
                    <TouchableOpacity
                        style={footerContainerStyle}
                        onPress={this.onEndReached.bind(this)}
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

        return <View style={{flex:1}}>
            {this.props.renderFooter&&this.props.renderFooter()}
            {footer}
        </View>
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
