'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ImageBackground,
	Image,
} from 'react-native';
import MissionItem from '../../component/MissionItem';
import { toDips, getFontSize } from '../../utils/dimensions';

export default class MsgScene extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '订单',
	});

	constructor(props) {
		super(props);
		this.state = {
			missionList: [
				{
					key: '1',
					name: '清风理货活动',
					category: '项目类型',
					time: '2016.12.12-2017.01.12',
					status: 1,
				},
				{
					key: '2',
					name: '清风理货活动',
					category: '项目类型',
					time: '2016.12.12-2017.01.12',
					status: 1,
				},
				{
					key: '3',
					name: '清风理货活动',
					category: '项目类型',
					time: '2016.12.12-2017.01.12',
					status: 1,
				},
				{
					key: '4',
					name: '清风理货活动',
					category: '项目类型',
					time: '2016.12.12-2017.01.12',
					status: 1,
				},
				{
					key: '5',
					name: '清风理货活动',
					category: '项目类型',
					time: '2016.12.12-2017.01.12',
					status: 1,
				},
			],
		};
	}

	render() {
		const { missionList } = this.state;
		return (
			<View style={styles.container}>
				{
					missionList.map((mission, index) => (
						<MissionItem key={mission.key} item={mission} navigation={this.props.navigation} />
					))
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
});
