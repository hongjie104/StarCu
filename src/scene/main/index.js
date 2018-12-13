'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	Platform,
} from 'react-native';
import Mission from './Mission';
import Calendar from './Calendar';
import { toDips, getFontSize } from '../../utils/dimensions';

let self = null;

class HeaderTitle extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			curTabIndex: 0,
		};
	}

	onTabChanged(index) {
		this.setState({
			curTabIndex: index,
		}, () => {
			this.props.onTabChanged(index);
		});
	}

	render() {
		const { curTabIndex } = this.state;
		return (
			<View style={styles.tabBarContainer}>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						this.onTabChanged(0);
					}}
					style={[styles.tabBar, styles.tabBarLeft, curTabIndex === 0 ? styles.tabBarSelected : styles.tabBarUnselected]}
				>
					<Text style={[styles.tabBarTxt, curTabIndex === 0 ? styles.tabBarTxtSelected : styles.tabBarTxtUnselectedt]}>
						今日任务
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						this.onTabChanged(1);
					}}
					style={[styles.tabBar, styles.tabBarRight, curTabIndex === 1 ? styles.tabBarSelected : styles.tabBarUnselected]}
				>
					<Text style={[styles.tabBarTxt, curTabIndex === 1 ? styles.tabBarTxtSelected : styles.tabBarTxtUnselectedt]}>
						我的日历
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
}


export default class MainScene extends PureComponent {

	static navigationOptions = {
		headerTitle: <HeaderTitle onTabChanged={index => {
			self.onTabChanged(index);
		}} />,
		tabBarIcon: ({ focused, tintColor }) => {
			const img = focused ? require('../../imgs/syax.png') : require('../../imgs/sy.png');
			return <Image style={{ width: toDips(50), height: toDips(50), }} source={img} />;
		},
		tabBarLabel: ({ focused }) => {
			return <Text style={[{ fontSize: getFontSize(26), alignSelf: 'center', }, focused ? { color: '#DD4124' } : { color: '#878787' }]}>任务</Text>;
		},
	};

	static onShow = () => {
		if (self) {
			if (self._mission) {
				self._mission.fetchTodayMission();
			}
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			curTabIndex: 0,
		};
	}

	componentWillMount() {
		self = this;
	}

	onTabChanged(index) {
		this.setState({
			curTabIndex: index,
		});
	}

	render() {
		const { curTabIndex } = this.state;		
		this._mission = null;
		return (
			<View style={styles.container}>
				{
					curTabIndex === 0 && <Mission navigation={this.props.navigation} ref={c => this._mission = c} />
				}
				{
					curTabIndex === 1 && <Calendar navigation={this.props.navigation} />
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FBFBFB',
	},
	tabBarContainer: {
		width: toDips(356),
		height: toDips(66),
		borderColor: 'white',
		borderWidth: toDips(2),
		borderRadius: toDips(12),
		flexDirection: 'row',
		marginLeft: Platform.select({
			ios: 0,
			// android上的左右都留了56的空间，所以这里减去56
			// 见navigation/index.js
			/*
				headerTitleContainerStyle: Platform.select({
					ios: null,
					android: {
						left: 56,
						right: 56,
					},
				}),
			 */
			android: toDips(197) - 56,
		}),
		marginTop: Platform.select({
			ios: 0,
			android: toDips(45),
		}),
	},
	tabBar: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	tabBarLeft: {
		borderTopLeftRadius: toDips(12),
		borderBottomLeftRadius: toDips(12),
	},
	tabBarRight: {
		borderTopRightRadius: toDips(12),
		borderBottomRightRadius: toDips(12),
	},
	tabBarSelected: {
		backgroundColor: 'white',
	},
	tabBarUnselected: {
		backgroundColor: '#DD4124',
	},
	tabBarTxt: {
		fontSize: toDips(30),
		// fontWeight: '500',
	},
	tabBarTxtSelected: {
		color: '#DD4124',
	},
	tabBarTxtUnselectedt: {
		color: '#FEFEFE',
	},
});
