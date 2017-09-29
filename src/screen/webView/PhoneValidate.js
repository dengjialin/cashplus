import React,{Component} from 'react'
import {observer} from 'mobx-react'
import {inject} from '../../store/index'
import { StyleSheet, View,WebView} from 'react-native';
import {NavBar} from '../../component/index'
class PhoneValidate extends Component {
    constructor(props){
        super(props)
        this.state = {
            url:null
        }
    }
    componentWillMount(){
        this.props.user.phoneValidate().then((ulr)=>{
            if(ulr){
               this.setState({
                   url:ulr
               })
            }
        })
    }
    render() {
        const {goBack} = this.props.navigation
        return (
            <View style={[styles.container]}>
                <NavBar
                    title='手机认证'
                    leftIcon='angle-left'
                    leftPress={()=>goBack()}
                />
                {this.state.url&&
                <WebView
                    style={styles.webView}
                    source={{url:this.state.url}}
                />
                }
            </View>
        );
    }
}

export default inject('user')(observer(PhoneValidate))
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    webView:{
        flex:1
    }
});
