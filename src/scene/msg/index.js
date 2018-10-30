'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import OrderMsgList from './Order';
import SystemMsgList from './System';
import { toDips, getFontSize } from '../../utils/dimensions';

export default class MsgScene extends PureComponent {

	static navigationOptions = {
		headerTitle: '消息',
		tabBarIcon: ({ focused, tintColor }) => {
			const img = focused ? require('../../imgs/xxax.png') : require('../../imgs/xx.png');
			return <Image style={{ width: toDips(50), height: toDips(50), }} source={img} />;
		},
		tabBarLabel: ({ focused }) => {
			return <Text style={[{ fontSize: getFontSize(26), fontWeight: '500' }, focused ? { color: '#DD4124' } : { color: '#878787' }]}>消息</Text>;
		},
	};

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.container}>
				
				<ScrollableTabView
					tabBarActiveTextColor='#DD4124'
					tabBarInactiveTextColor='#333333'
					tabBarTextStyle={{
						fontSize: toDips(32),
						fontWeight: '500',
						marginTop: toDips(32),
					}}
					tabBarUnderlineStyle={{
						backgroundColor: '#DD4124',
					}}
				>
					<OrderMsgList tabLabel='订单消息' />
					<SystemMsgList tabLabel='系统消息' />
				</ScrollableTabView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FBFBFB',
	},
});
