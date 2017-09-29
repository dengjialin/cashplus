import React,{Component} from 'react'
import {observer} from 'mobx-react'
import {inject} from '../../store/index'
import validator from 'validator';
import { StyleSheet, Text, View,Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import {NavBar,VCode,VCodeImg} from '../../component/index'
import {InputItem,Button,Toast} from 'antd-mobile'
import {TouchableOpacity} from 'react-native'
import {cleanString} from '../../common/Tools'
class RegisterForm extends Component{
    state = {
        form:{
            phone:{
                hasError:false,
                value:'',
                rules:[
                    {pattern:(val)=>val.replace(/\s/g,'').trim().length===11,errMsg:'请输入正确的电话号码'}
                ]
            },
            vcode:{
                hasError:false,
                value:'',
                rules:[
                    {pattern:(val)=>!validator.isEmpty(val),errMsg:'请输入短信验证码'}
                ]
            },
            password:{
                hasError:false,
                value:'',
                rules:[
                    {pattern:(val)=>!validator.isEmpty(val),errMsg:'请输入图片验证码'}
                ]
            },
            protocol:{
                hasError:false,
                value:true,
                rules:[]
            }
        },
        formValidate:false
    }
    _getFormFieldHasError(fieldName){
        return this.state.form[fieldName].hasError
    }
    _getFormFieldValue(fieldName){
        return this.state.form[fieldName].value
    }
    _onFormFieldChange(fieldName,val){
        const form = this.state.form
        let newField = {...form[fieldName],hasError:false,value:val,err:''}
        let formValidate = true
        for (let rule of form[fieldName].rules){
            if(!rule.pattern(val)){
                newField.hasError = true
                newField.err = rule.errMsg
                break;
            }
        }
        let newForm = {
            ...form,
            [fieldName]:newField
        }
        for(let name in newForm){
            if(newForm[name].hasError){
                formValidate = false
                break;
            }else if(!newForm[name].value){
                formValidate = false
                break;
            }
        }
        this.setState({
            form:newForm,
            formValidate
        })
    }
    _onErrorClick(fieldName){
        const field = this.state.form[fieldName]
        if(field.hasError){
            Toast.info(field.err,1)
        }
    }
    _submit(){
        if(this.state.formValidate){
            let phone = this.state.form.phone
            let code = this.state.form.vcode
            //提交注册
            this.props.user.userLogin({
                phone:cleanString(phone.value),
                code:code.value
            },()=>{
                this.props.navigation.navigate('UserProfile')
            })
        }
    }
    _sendValidate(starter){
        let phone = this.state.form.phone
        let imgCode = this.state.form.password
        if(phone.value===''||phone.hasError){
            Toast.info('请输入正确的手机号码',1)
        }else if(imgCode.value===''||imgCode.hasError){
            Toast.info('请输入图片验证码',1)
        }else {
            //获取验证码
            this.props.user.userGetVCode({
                type:0,
                phone:cleanString(phone.value),
                code:imgCode.value
            },()=>{
                starter()
            })

        }
    }
    _getValidateImg(imgByPhone){
        let phone = this.state.form.phone
        if(phone.value===''||phone.hasError){
            Toast.info('请输入正确的手机号码',1)
        }else {
            //获取验证码
            imgByPhone(cleanString(phone.value))
        }
    }
    render(){
        const {goBack,navigate} = this.props.navigation
        return <View style={{flex:1,backgroundColor:'#f3f3f3'}}>
            <NavBar
                title="注册"
                rightIcon='times'
                rightPress={()=>goBack()}
                rightIconSize={18}
            />
            <View>
                <View style={styles.logo}>
                    <Image style={styles.logoImg} source={require('../../resource/brand/logo1.png')}/>
                </View>
                <View style={styles.formItem}>
                    <Icon name="phone" size={25} color="#4da6f0"/>
                    <View style={{marginLeft:5,flex:1}}>
                        <InputItem
                            type="phone"
                            style={{borderBottomColor:'#fff'}}
                            placeholder="请输入你的手机号"
                            error={this._getFormFieldHasError('phone')}
                            onErrorClick={()=>this._onErrorClick('phone')}
                            onChange={(val)=>this._onFormFieldChange('phone',val)}
                            value={this._getFormFieldValue('phone')}
                        />
                    </View>
                </View>
                <View style={styles.formItem}>
                    <Icon name="id-card" size={25} color="#4da6f0"/>
                    <View style={{marginLeft:5,flex:1}}>
                        <InputItem
                            style={{borderBottomColor:'#fff'}}
                            placeholder="请输入图片验证码"
                            error={this._getFormFieldHasError('password')}
                            onErrorClick={()=>this._onErrorClick('password')}
                            onChange={(val)=>this._onFormFieldChange('password',val)}
                            value={this._getFormFieldValue('password')}
                        />
                    </View>
                    <VCodeImg style={styles.vcode} textStyle={{fontSize:12,color:'#fff'}} onSend={this._getValidateImg.bind(this)}/>
                </View>
                <View style={[styles.formItem]}>
                    <Icon name="send" size={25} color="#4da6f0"/>
                    <View style={{marginLeft:5,flex:1}}>
                        <InputItem
                            style={{borderBottomColor:'#fff'}}
                            placeholder="请输入短信验证码"
                            error={this._getFormFieldHasError('vcode')}
                            onErrorClick={()=>this._onErrorClick('vcode')}
                            onChange={(val)=>this._onFormFieldChange('vcode',val)}
                            value={this._getFormFieldValue('vcode')}
                        />
                    </View>
                    <VCode style={styles.vcode} textStyle={{fontSize:12,color:'#fff'}} onSend={this._sendValidate.bind(this)} countDown={60}/>
                </View>
                <View style={styles.protocol}>
                    <TouchableOpacity style={styles.proRadio} onPress={()=>this._onFormFieldChange('protocol',!this.state.form.protocol.value)}>
                        <Icon color={this.state.form.protocol.value?'#4da6f0':'#aaa'} name="check-square" size={18}/>
                    </TouchableOpacity><Text style={{color:'#4da6f0',fontSize:12}} onPress={()=>navigate('RegisterProtocol')}>用户注册协议</Text>
                </View>
                <Button style={styles.resBtn} onClick={this._submit.bind(this)} disabled={!this.state.formValidate}><Text>注册</Text></Button>
            </View>
        </View>
    }
}
const UserRegister = inject('user')(observer(RegisterForm))
export {
    UserRegister
}
const styles = StyleSheet.create({
    logo:{
        height:200,
        justifyContent:'center',
        alignItems:'center'
    },
    logoImg:{
        width:80,
        height:80
    },
    resBtn:{
        marginHorizontal:20,
        marginVertical:10
    },
    form:{
        paddingHorizontal:50
    },
    formItem:{
        marginHorizontal:10,
        marginTop:10,
        padding:10,
        height:45,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
    },
    vcode:{
        position:'absolute',
        right:10,
        top:2,
    },
    protocol:{
        marginVertical:10,
        marginHorizontal:20,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:"center"
    },
    proRadio:{
        marginRight:4
    }
})