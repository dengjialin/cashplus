import {Dimensions,PixelRatio,Platform} from 'react-native'
const BaseUrl = 'http://test.cashpp.com/rest'
const CLIENTWIDTH = Dimensions.get('window').width
const CLIENTHEIGHT = Dimensions.get('window').height
const CommonPageStyle = {
    flex: 1,
    backgroundColor: "#f3f3f3"
}
window.rnScreen = {
    onePix: 1 / PixelRatio.get(),
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
    primaryColor:'#0398ff',
    isIOS:Platform.OS==='ios'
}
export {
    BaseUrl,CLIENTHEIGHT,CLIENTWIDTH,CommonPageStyle
}