import {Dimensions,PixelRatio,Platform} from 'react-native'
const BaseUrl = 'http://test.cashpp.com/rest'
const CLIENTWIDTH = Dimensions.get('window').width;
const CLIENTHEIGHT = Dimensions.get('window').height;
const Pix = PixelRatio.get();
const WidthRatio = CLIENTWIDTH/375;
const isIOS = Platform.OS==='ios';
const onePix = 1 / PixelRatio.get();
const CommonPageStyle = {
    flex: 1,
    backgroundColor: "#f3f3f3"
}
window.rnScreen = {
    pix:Pix, //像素每单位
    onePix: onePix,
    width:CLIENTWIDTH,
    height:CLIENTHEIGHT,
    primaryColor:'#0398ff',
    isIOS:isIOS,
    widthRatio:WidthRatio
}
export {
    BaseUrl,CLIENTHEIGHT,CLIENTWIDTH,CommonPageStyle,Pix,WidthRatio,isIOS
}