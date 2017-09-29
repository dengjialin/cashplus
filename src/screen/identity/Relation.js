import React from 'react';
import {observer} from 'mobx-react'
import { Image, View ,StyleSheet,Text} from 'react-native';
import {NavBar,IFormItem,createForm} from '../../component/index'
import {Button,Toast} from 'antd-mobile'
import store,{inject}from '../../store/index'
class Relation extends React.Component{
    render(){
        const {goBack} = this.props.navigation
        const {getFormFieldProps,formValidate} = this.props.form
        return <View style={{flex:1,backgroundColor:'#f3f3f3'}}>
            <NavBar
                title='紧急联系人'
                leftIcon='angle-left'
                leftPress={()=>goBack()}
            />
            <Text style={styles.title}>{"亲属关系"}</Text>
            <IFormItem
                type={{name:'picker',pickerProps:{title:'关系',cols:1}}}
                formFiled={getFormFieldProps('family')}
            />
            <IFormItem
                type={{name:'input',inputProps:{placeholder:'请输入姓名',title:'姓名'}}}
                formFiled={getFormFieldProps('familyName')}
            />
            <IFormItem
                type={{name:'input',inputProps:{type:'phone',placeholder:'请输入手机号',title:'手机号'},icon:{name:'phone'}}}
                formFiled={getFormFieldProps('familyPhone')}
            />
            <Text style={styles.title}>{"社会关系"}</Text>
            <IFormItem
                type={{name:'picker',pickerProps:{title:'关系',cols:1}}}
                formFiled={getFormFieldProps('friend')}
            />
            <IFormItem
                type={{name:'input',inputProps:{placeholder:'请输入姓名',title:'姓名'}}}
                formFiled={getFormFieldProps('friendName')}
            />
            <IFormItem
                type={{name:'input',inputProps:{type:'phone',placeholder:'请输入手机号',title:'手机号'},icon:{name:'phone'}}}
                formFiled={getFormFieldProps('friendPhone')}
            />

            <Button onClick={()=>Toast.info('ok')} style={{marginTop:40}} disabled={!formValidate}>提交</Button>
        </View>
    }
}

const styles = StyleSheet.create({
    title: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        color: "#666"
    },
})
export default createForm('relation')(Relation)