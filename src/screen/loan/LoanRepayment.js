import React,{Component} from 'react'
import {observer} from 'mobx-react'
import { StyleSheet, View} from 'react-native';
import {NavBar,TabCellUnderline} from '../../component/index'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import LoanRepaymentNow from './LoanRepaymentNow'
import LoanRepaymentDelay from './LoanRepaymentDelay'
const titles = ['立即还款','延期还款'];
const controllers = [
    {categoryId: 1, controller: LoanRepaymentNow},
    {categoryId: 2, controller: LoanRepaymentDelay},
]
class LoanRepayment extends Component {

    render() {
        const {goBack} = this.props.navigation
        return (
            <View style={[styles.container]}>
                <NavBar
                    title='我要还款'
                    leftIcon='angle-left'
                    leftPress={()=>goBack()}
                />
                <ScrollableTabView
                    renderTabBar={() => <TabCellUnderline/>}
                    tabBarPosition='top'
                    scrollWithoutAnimation={false}
                >
                    {controllers.map((data, index) => {
                        let Component = data.controller;
                        return (
                            <Component
                                key={titles[index]}
                                tabLabel={titles[index]}
                                categoryId={data.categoryId}
                                navigation={this.props.navigation}
                            />
                        )
                    })}
                </ScrollableTabView>

            </View>
        );
    }
}
export default LoanRepayment
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
