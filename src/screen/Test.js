/**
 * Created by yueshengyu on 2017/11/22.
 */
import React,{Component} from 'react'
import {  View,FlatList,Text,PixelRatio} from 'react-native';
import lodash from 'lodash'
import {IFlatList} from '../component/PullFlatList'
import {NavBar} from '../component/'
class Test extends Component{
    componentDidMount(){

    }
    constructor(props){
        super(props)
        this.state = {
            arr:[1,2,3,4,5],
        }
    }
    render(){
        return <View style={{flex:1,backgroundColor:'#fafafa'}}>
            <NavBar title='测试页面'/>
            <IFlatList
                data={this.state.arr}
                contentStyle = {{flex:1,backgroundColor:'rgba(0,0,0,.3)'}}
                renderItem={({item,i})=>(
                    <Text style={{height:120}}>{item}----{'afasdfasfds'}</Text>
                )}
                keyExtractor={(item)=>item}
                onPullRefresh={()=>{
                    window.alert(2)
                }}
                onPullStateChangeHeight={(h,t)=>this.setState({h,t})}
                onLoadMore={(end,no)=>{
                    window.setTimeout(()=>{
                        this.setState({arr:[1,2,3,4,5,6,7,8]})
                        no()
                    },5000)
                }}
            />
        </View>
    }
}
export default Test