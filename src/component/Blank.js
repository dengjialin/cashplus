import React,{Component} from 'react'
import { View,StyleSheet} from 'react-native';
class BlankEdge extends Component{
    static propTypes = {
        style:View.propTypes.style
    }
    render(){
        const {style} = this.props
        return <View style={[styles.edge,style]}
        ></View>
    }
}
const styles = StyleSheet.create({
    edge:{
        width:rnScreen.width,
        height:10,
        backgroundColor:'#fafafa'
    }
})
export {
    BlankEdge
}