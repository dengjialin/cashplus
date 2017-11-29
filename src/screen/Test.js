/**
 * Created by yueshengyu on 2017/11/22.
 */
import React,{Component} from 'react'
import {  View,Text,TouchableOpacity} from 'react-native';
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
            h:'',
            t:''
        }
    }
    render(){
        return <View style={{flex:1,backgroundColor:'#fafafa'}}>
            <NavBar title='测试页面'/>
            <Text style={{height:100}}>{window.rnScreen.widthRatio}--{window.rnScreen.width}</Text>
            <IFlatList
                data={this.state.arr}
                contentStyle = {{flex:1,backgroundColor:'rgba(0,0,0,.3)'}}
                renderItem={({item,i})=>(
                <TouchableOpacity onPress={()=>window.alert(item)}>
                    <Text style={{height:120}}>{item}----{'afasdfasfds'}</Text>
                </TouchableOpacity>
                )}
                keyExtractor={(item)=>item}
                onPullRefresh={()=>{
                    window.alert('刷新')
                }}
                onPullStateChangeHeight={(h,t)=>this.setState({h,t})}
                onLoadMore={(end,no)=>{
                    window.setTimeout(()=>{
                        this.setState({arr:[1,2,3,4,5,6,7,8]})
                        no()
                    },2000)
                }}
            />
        </View>
    }
}
export default Test