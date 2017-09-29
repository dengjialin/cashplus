import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Animated,
    Text
} from 'react-native'

const DEFAULT_SCALE = 1
const SELECT_SCALE = 1.2
const DEFAULT_COLOR = 'black'
const SELECT_COLOR = rnScreen.primaryColor

class TabCellOpacity extends Component {
    static propTypes = {
        goToPage: React.PropTypes.func,
        activeTab: React.PropTypes.number,
        tabs: React.PropTypes.array,

        tabNames: React.PropTypes.array
    }

    offsetX = new Animated.Value(0)

    componentDidMount() {
        this.props.scrollValue.addListener(this.setAnimationValue)
    }

    setAnimationValue = ({value}) => this.offsetX.setValue(value)

    render() {
        const {tabs} = this.props
        const indicatorX = this.offsetX.interpolate({
            inputRange: [0, tabs.length - 1],
            outputRange: [0, rnScreen.width * (tabs.length - 1) / tabs.length]
        })
        return (
            <View style={styles.tabs}>
                {tabs.map((tab, i) => {
                    const scale = this.offsetX.interpolate({
                        inputRange: [i - 2, i - 1, i, i + 1, i + 2],
                        outputRange: [DEFAULT_SCALE, DEFAULT_SCALE, SELECT_SCALE, DEFAULT_SCALE, DEFAULT_SCALE]
                    })
                    const color = this.offsetX.interpolate({
                        inputRange: [i - 2, i - 1, i, i + 1, i + 2],
                        outputRange: [DEFAULT_COLOR, DEFAULT_COLOR, SELECT_COLOR, DEFAULT_COLOR, DEFAULT_COLOR]
                    })

                    return (
                        <Animated.View key={`Tab_${i}`} style={[styles.tab, {transform: [{scale}]}]}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.tab}
                                onPress={() => this.props.goToPage(i)}
                            >
                                <Animated.Text style={{color: color, fontSize: 14}}>
                                    {this.props.tabNames[i]}
                                </Animated.Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )
                })}
                {/*<Animated.View style={[styles.indicatorContainer, {left: indicatorX}]}>*/}
                 {/*<View style={styles.indicator}/>*/}
                 {/*</Animated.View>*/}
            </View>
        )
    }
}
class TabCellUnderline extends Component{
    static propTypes = {
        goToPage: React.PropTypes.func,
        activeTab: React.PropTypes.number,
        tabs: React.PropTypes.array,
        backgroundColor: React.PropTypes.string,
        activeTextColor: React.PropTypes.string,
        inactiveTextColor: React.PropTypes.string,
        textStyle: Text.propTypes.style,
        tabStyle: View.propTypes.style,
        renderTab: React.PropTypes.func, //定制的rendertab方法
        underlineStyle: View.propTypes.style,
    }
    static defaultProps = {
        activeTextColor: '#0398ff',
        inactiveTextColor: '#666',
        backgroundColor: "#fff",
    }
    renderTabOption(name, page) {
    }
    renderTab(name, page, isTabActive, onPressHandler) {
        const { activeTextColor='#0398ff', inactiveTextColor='#666', textStyle={},} = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const fontWeight = isTabActive ? 'bold' : 'normal';

        return <TouchableOpacity
            style={{flex: 1, }}
            key={name}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
        >
            <View style={[stylesUnderline.tab, this.props.tabStyle, ]}>
                <Text style={[{color: textColor, fontWeight, fontSize: 14 }, textStyle, ]}>
                    {name}
                </Text>
            </View>
        </TouchableOpacity>;
    }

    render() {
        const containerWidth = this.props.containerWidth;
        const numberOfTabs = this.props.tabs.length;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs,
            bottom: 6,
            justifyContent: "center",
            alignItems: "center"
        };

        const translateX = this.props.scrollValue.interpolate({
            inputRange: [0, 1, ], outputRange: [0,  containerWidth / numberOfTabs, ],
        });
        return (
            <View style={[stylesUnderline.tabs, {backgroundColor: this.props.backgroundColor||'#fff', }, this.props.style, ]}>
                {this.props.tabs.map((name, page) => {
                    const isTabActive = this.props.activeTab === page;
                    const renderTab = this.props.renderTab || this.renderTab.bind(this);
                    return renderTab(name, page, isTabActive, this.props.goToPage);
                })}
                <Animated.View style={[tabUnderlineStyle, {transform:[{translateX}]}, this.props.underlineStyle, ]} >
                    <View style={{height: 2, width: 35, backgroundColor: '#0398ff',}}></View>
                </Animated.View>
            </View>
        );
    }

}

const stylesUnderline = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabs: {
        height: 44,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
});

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        height: 44,
        borderBottomColor: 'rgb(242, 242, 242)',
        borderBottomWidth: 1
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorContainer: {
        position: 'absolute',
        bottom: 7,
        height: 3,
        width: rnScreen.width / 4,
        alignItems: 'center'
    },
    indicator: {
        backgroundColor: 'red',
        height: 3,
        width: 3,
        borderRadius: 1.5,
    }
});
export {
    TabCellOpacity,TabCellUnderline
}