'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ImageBackground,
	Image,
	ScrollView,
} from 'react-native';
import MissionItem from '../../component/MissionItem';
import { toDips, getFontSize } from '../../utils/dimensions';
import toast from '../../utils/toast';
import { getOrderArr } from '../../service';

export default class MsgScene extends PureComponent {
	
	static navigationOptions = {
		headerTitle: '接单',
		tabBarIcon: ({ focused, tintColor }) => {
			const img = focused ? require('../../imgs/ddax.png') : require('../../imgs/dd.png');
			return <Image style={{ width: toDips(50), height: toDips(50), }} source={img} />;
		},
		tabBarLabel: ({ focused }) => {
			return <Text style={[{ fontSize: getFontSize(26), alignSelf: 'center', }, focused ? { color: '#DD4124' } : { color: '#878787' }]}>订单</Text>;
		},
	};

	constructor(props) {
		super(props);
		this.state = {
			missionList: [],
		};
	}

	componentWillMount() {
		getOrderArr().then(result => {
			/*
				statusDesc 状态描述 
				orderEndDate 订单结束时间 
				orderDays 订单执行时长（天） 
				standardPhoto: [ 'http://oyxr5nbal.bkt.clouddn.com/20181107114116.jpg' ],
				orderId 订单ID 
				orderBeginDate 订单开始时间 
				require 订单要求 
				remark: null,
				orderTitle 订单标题 
				status 订单状态 
				orderContent 订单描述 
				username 订单管理员
			 */
			const { receivedOrder, unReceivedOrder } = result.datas;
			const missionList = [
				...(receivedOrder.map(o => {
					o.received = 1;
					o.key = o.orderId;
					return o;
				})),
				...(unReceivedOrder.map(o => {
					o.received = 0;
					o.key = o.orderId;
					return o;
				})),
			];
			this.setState({
				missionList,
			});
		}).catch(e => {
			toast(e);
		});
	}

	render() {
		const { missionList } = this.state;
		return (
			<View style={styles.container}>
				<ScrollView style={styles.container}>
					{
						missionList.map((mission, index) => (
							<MissionItem key={mission.key} item={mission} navigation={this.props.navigation} />
						))
					}
				</ScrollView>
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
