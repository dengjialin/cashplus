import React from 'react';
import {observer} from 'mobx-react'
import { Button, Image, View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import {NavBar} from '../../component/index'
import store from '../../store/index'
import {IFormItem,createForm} from '../../component/IFormItem'
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
@observer
class Avatar extends React.Component {
    componentDidMount(){
        this.props.avatar.getAvatarInfo()
    }
    render() {
        const {goBack,navigate} = this.props.navigation
        const {getFormFieldProps,formValidate} = this.props.form
        const {avatar} = this.props.avatar
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <NavBar
                    title="身份认证"
                    leftIcon="angle-left"
                    leftPress={()=>goBack()}
                />
                <Text style={styles.title}>{"居住信息"}</Text>
                <IFormItem
                    type={{formItemStyle:{padding:0},name:'input',inputProps:{title:'姓名',placeholder:'请输入您的姓名'}}}
                    formFiled={getFormFieldProps('name')}
                />
                <IFormItem
                    type={{formItemStyle:{padding:0},name:'input',inputProps:{title:'身份证',placeholder:'请输入您的身份证'}}}
                    formFiled={getFormFieldProps('idCard')}
                />

                <View style={styles.imageBox}>
                    <View style={styles.imageBoxHeader}>
                        <Icon name="question" size={18} color="#4da6f0"/>
                        <Text>持证自拍</Text>
                        <View style={styles.takeImgBtn}>
                            <TouchableOpacity onPress={()=>this._takePhoto()} >
                                <Icon name="camera" size={18} color="black"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.photoContainer}>
                        {avatar &&
                        <Image source={{ uri: avatar.url }} style={styles.photo} />}
                    </View>
                </View>
            </View>
        );
    }
    _takePhoto(){
        ImagePicker.showImagePicker({
            title:'请选择',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'从图库选择',
            cancelButtonTitle:'取消'
        },(response)=>{
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.props.avatar.avatar.url = response.uri
            }
        })
    }
}
const styles = StyleSheet.create({
    title: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        color: "#666"
    },
    imageBox:{
        padding:20,
        height:300,
        marginBottom:10
    },
    imageBoxHeader:{
        height:20,
        flexDirection:'row',
        alignItems:'center'
    },
    takeImgBtn:{
        position:'absolute',
        right:10,
        top:5
    },
    photoContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    photo:{
        width:200,
        height:200,
        borderRadius:8
    }
})
export default createForm('avatar')(Avatar)