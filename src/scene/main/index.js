'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
} from 'react-native';
import Mission from './Mission';
import Calendar from './Calendar';
import { toDips, getFontSize } from '../../utils/dimensions';
import { loadDataFromLocal } from '../../utils/storage';

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
		tabBarLabel: '任务',
	};

	constructor(props) {
		super(props);
		this.state = {
			curTabIndex: 0,
		};
		self = this;
	}

	onTabChanged(index) {
		this.setState({
			curTabIndex: index,
		});
	}

	render() {
		// const { navigate, goBack } = this.props.navigation;
		const { curTabIndex } = this.state;
		return (
			<View style={styles.container}>
				{
					// tab bar
					/*
					 */
				}
				{
					curTabIndex === 0 && <Mission navigation={this.props.navigation} />
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
		// marginTop: toDips(60),
		alignSelf: 'center',
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
		fontWeight: '500',
	},
	tabBarTxtSelected: {
		color: '#DD4124',
	},
	tabBarTxtUnselectedt: {
		color: '#FEFEFE',
	},
});
