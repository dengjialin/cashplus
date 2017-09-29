import React,{Component} from 'react'
import {observer} from 'mobx-react'
import { StyleSheet, View,} from 'react-native';
import {NavBar,TabCellOpacity} from '../../component/index'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import LoanStatus from './LoanStatus'
import LoanRecords from './LoanRecords'
const titles = ['借款进度','借款记录'];
const controllers = [
    {categoryId: 1, controller: LoanStatus},
    {categoryId: 2, controller: LoanRecords},
]



@observer
class Loan extends Component {
    render() {
        return (
            <View style={[styles.container]}>
                <NavBar
                    title='借款记录'
                />
                <ScrollableTabView
                    renderTabBar={() => <TabCellOpacity tabNames={titles}/>}
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
export default Loan
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
