import React,{Component} from 'react'
import { StyleSheet, View,WebView} from 'react-native';
import {NavBar} from '../../component/index'
import app from '../../common/HttpTools'
class RegisterProtocol extends Component {
    render() {
        const {goBack,} = this.props.navigation
        return (
            <View style={[styles.container]}>
                <NavBar
                    title='注册协议'
                    leftIcon='angle-left'
                    leftPress={()=>goBack()}
                />
                <WebView
                 style={styles.webView}
                 source={{url:'http://test.cashpp.com/index.html#/protocol/register'}}
                />
            </View>
        );
    }
}
class MoreProducts extends Component {
    render() {
        const {goBack,} = this.props.navigation
        return (
            <View style={[styles.container]}>
                <NavBar
                    title='更多相关产品'
                    leftIcon='angle-left'
                    leftPress={()=>goBack()}
                />
                <WebView
                    style={styles.webView}
                    source={{url:'http://test.cashpp.com/index.html#/user/lead'}}
                />
            </View>
        );
    }
}
class LoanProtocol extends Component {
    constructor(props){
        super(props)
        this.state = {
            token:''
        }
    }
    componentWillMount(){
        app.getAccessToken().then((token)=>{
            if(token){
                this.setState({
                    token
                })
            }
        })
    }

    render() {
        const {goBack,state} = this.props.navigation
        let id = '';
        if(state.params&&state.params.loanId){
            id = state.params.loanId;
        }
        const {token} = this.state;
        let cookie = '';
        if(token){
            cookie = JSON.parse(token)[0].split(';')[0];
        }

        return (
            <View style={[styles.container]}>
                <NavBar
                    title='借款协议'
                    leftIcon='angle-left'
                    leftPress={()=>goBack()}
                />
                <WebView
                    style={styles.webView}
                    source={
                        {
                            url:`http://test.cashpp.com/index.html#/protocol/loan/${id}`,
                            headers: {
                                'Cookie':cookie,
                                'Content-Type': 'application/json;charset=UTF-8',
                            }
                        }
                    }
                />
            </View>
        );
    }
}
class SubmitJsonForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            token:''
        }
    }
    componentWillMount(){
        app.getAccessToken().then((token)=>{
            if(token){
                this.setState({
                    token
                })
            }
        })
    }
    render() {
        const {goBack,state} = this.props.navigation;
        const {token} = this.state;
        let form = '';
        let title = '';
        let cookie = '';
        if(state.params&&state.params.form){
            form = JSON.stringify(state.params.form);
            title = state.params.title;
        }
        if(token){
            cookie = JSON.parse(token)[0].split(';')[0];
        }
        return (
            <View style={[styles.container]}>
                <NavBar
                    title={title}
                    leftIcon='angle-left'
                    leftPress={()=>goBack()}
                    rightIcon='refresh'
                    rightPress={()=>this._reload()}
                />
                {this.state.token&&
                <WebView
                    ref={(w)=>this.web = w}
                    style={styles.webView}
                    source={{
                        url:`http://test.cashpp.com/index.html?form=${form}#/hybird/submit`,
                    }}
                />}
            </View>
        );
    }
    _reload(){
        if(this.web){
            this.web.reload();
        }
    }
}
export  {
    RegisterProtocol,MoreProducts,LoanProtocol,SubmitJsonForm
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    webView:{
        flex:1
    }
});
