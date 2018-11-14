'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Image,
	ImageBackground,
} from 'react-native';

import { toDips, getFontSize } from '../utils/dimensions';

export default class MissionItem extends PureComponent {

	constructor(props) {
		super(props);
	}

	onItemPress(mission) {
		const { navigation: { navigate }, type } = this.props;
		navigate({
			routeName: 'MissionIntroduceScene',
			params: {
				mission,
				type,
			},
		});
	}

	render() {
		/*
			proType  任务类型
			statusDesc  任务状态描述
			endDate  订单结束日期
			proId  订单ID
			orderType  订单类型描述
			orderEndDate  订单结束日期
			orderId  订单ID
			orderStartDate  订单开始日期
			orderTypeId  订单类型ID
			orderTitle  订单标题
			taskId  任务ID
			status  任务状态
		 */
		// type 0 是任务  1 是订单
		const { item, type } = this.props;
		return (
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={() => {
					this.onItemPress(item);
				}}
				style={styles.itemContainer}
			>
				<View style={styles.itemInfoContainer}>
					<ImageBackground
						style={styles.itemStatusImgBg}
						// source={item.received === 1 ? require('../imgs/lvk.png') : (item.received === 0 ? require('../imgs/hongk.png') : require('../imgs/huangk.png'))}
						source={
							type === 1 ? (item.status === 0 ? require('../imgs/hongk.png') : require('../imgs/lvk.png')) : (item.status === 0 ? require('../imgs/huangk.png') : require('../imgs/lvk.png'))
						}
					>
						<Image
							style={styles.itemStatusImg}
							source={
								type === 1 ? (item.status === 0 ? require('../imgs/wjd.png') : require('../imgs/yjd.png')) : (item.status === 0 ? require('../imgs/wwc.png') : require('../imgs/ywc.png'))
							}
						/>
						<Text style={styles.itemStatusTxt}>
							{ type === 1 ? (item.status === 0 ? '未接单' : '已接单') : (item.status === 0 ? '未完成' : '已完成') }
						</Text>
					</ImageBackground>
					<View style={styles.itemInfoSubContainer}>
						<Text style={styles.itemName}>
							{ item.orderTitle }
						</Text>
						<Text style={styles.category}>
							{ item.orderType || item.orderContent }
						</Text>
						<View style={styles.itemDateRow}>
							<Image style={styles.clockImg} source={require('../imgs/clock.png')} />
							<Text style={styles.date}>
								{ item.orderStartDate || item.orderBeginDate } - { item.orderEndDate }
							</Text>
						</View>
					</View>
				</View>
				<Image style={styles.arrowImg} source={require('../imgs/jt.png')} />
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	itemContainer: {
		flex: 1,
		width: toDips(750),
		height: toDips(180),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 1,
		backgroundColor: 'white',
	},
	itemInfoContainer: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	itemStatusImgBg: {
		width: toDips(194),
		height: toDips(151),
		marginLeft: toDips(34),
		alignItems: 'center',
	},
	itemStatusTxt: {
		fontSize: getFontSize(26),
		// fontWeight: '500',
		color: 'white',
		marginTop: toDips(11),
	},
	itemStatusImg: {
		width: toDips(48),
		height: toDips(48),
		marginTop: toDips(25),
	},
	itemInfoSubContainer: {
		marginLeft: toDips(36),
	},
	itemName: {
		color: '#2A2A2A',
		fontSize: getFontSize(36),
		// fontWeight: '500',
	},
	category: {
		color: '#9D9D9D',
		fontSize: getFontSize(30),
		// fontWeight: '500',
		marginTop: toDips(19),
	},
	itemDateRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: toDips(19),
	},
	clockImg: {
		width: toDips(27),
		height: toDips(27),
		marginRight: toDips(7),
	},
	date: {
		color: '#969696',
		fontSize: getFontSize(24),
		// fontWeight: '500',
	},
	arrowImg: {
		width: toDips(18),
		height: toDips(34),
		marginRight: toDips(46),
	},
});
