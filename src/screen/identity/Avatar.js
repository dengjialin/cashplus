import React from 'react';
import {observer} from 'mobx-react'
import {Image, View,Text,StyleSheet,TouchableOpacity,Modal,ScrollView} from 'react-native';
import {NavBar} from '../../component/index'
import {IFormItem,createForm} from '../../component/IFormItem'
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Button} from 'antd-mobile'
import ImageViewer from "react-native-image-zoom-viewer";
@observer
class Avatar extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            modalVisible:false,
            images:[]
        }
    }
    componentDidMount(){
        this.props.avatar.getAvatarInfo()
    }
    render() {
        const {goBack,navigate} = this.props.navigation
        const {getFormFieldProps,formValidate} = this.props.form
        const {idSelf,idFront} = this.props.avatar
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <NavBar
                    title="身份认证"
                    leftIcon="angle-left"
                    leftPress={()=>goBack()}
                />
                <ScrollView style={{flex:1}}>
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
                                <TouchableOpacity onPress={()=>this._takePhoto('1')} >
                                    <Icon name="camera" size={18} color="black"/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.photoContainer}>
                            <TouchableOpacity  onPress={()=>this._clickPhoto('1')}>
                                {idSelf.url!=='' &&
                                <Image source={{ uri: idSelf.url }} style={styles.photo} />}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.imageBox}>
                        <View style={styles.imageBoxHeader}>
                            <Text>身份证正面(人像)</Text>
                            <View style={styles.takeImgBtn}>
                                <TouchableOpacity onPress={()=>this._takePhoto('2')} >
                                    <Icon name="camera" size={18} color="black"/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.photoContainer}>
                            <TouchableOpacity onPress={()=>this._clickPhoto('2')}>
                                {idFront.url!=='' &&
                                <Image source={{ uri: idFront.url }} style={styles.photo} />}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Modal visible={this.state.modalVisible} transparent={this.state.modalVisible}>
                        <ImageViewer
                            imageUrls={this.state.images}
                            onCancel={()=>this.setState({modalVisible:false})}
                        />
                    </Modal>
                    <Button  style={{margin:10}} type="primary" disabled={!formValidate} onClick={()=>{this.props.avatar.submit().then((res)=>res&&navigate('UserSetting'))}}>提交审核</Button>
                </ScrollView>
            </View>
        );
    }
    _clickPhoto(type){
        if(type==='1'){
            let imgs = [{
                url:this.props.avatar.idSelf.url
            }]
            this.setState({
                modalVisible:true,
                images:imgs
            })
        }else if(type==='2'){
            let imgs = [{
                url:this.props.avatar.idFront.url
            }]
            this.setState({
                modalVisible:true,
                images:imgs
            })
        }
    }
    _takePhoto(type){
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
                let file = {
                    uri:response.uri,
                    type:'multipart/form-data',
                    name:response.name
                }
                if(type==='1'){ //持证自拍
                    this.props.avatar.idSelf.url = response.uri
                    this.props.avatar.uploadImg({
                        file:file,
                        type:'idSelf'
                    })
                }else if(type==='2'){
                    this.props.avatar.idFront.url = response.uri
                    this.props.avatar.uploadImg({
                        file:file,
                        type:'idFront'
                    })
                }
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
        margin:20,
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
        width:250,
        height:250,
        borderRadius:8
    }
})
export default createForm('avatar')(Avatar)