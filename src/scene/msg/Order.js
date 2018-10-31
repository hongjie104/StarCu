'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	FlatList,
	Image,
	Text,
} from 'react-native';
import { toDips, getFontSize } from '../../utils/dimensions';

const ITEM_HEIGHT = toDips(206);

export default class OrderMsgList extends PureComponent {
	
	constructor(props) {
		super(props);
		this.state = {
			msgList: [
				{
					key: '1',
					name: '订单名称',
					des: '【订单号】的订单已成功接单，请及时完成并反馈任务',
					time: '2018-06-14 15:10',
					status: 1,
				},
				{
					key: '2',
					name: '订单名称',
					des: '【订单号】的订单已成功接单，请及时完成并反馈任务',
					time: '2018-06-14 15:10',
					status: 1,
				},
				{
					key: '3',
					name: '订单名称',
					des: '【订单号】的订单已成功接单，请及时完成并反馈任务',
					time: '2018-06-14 15:10',
					status: 1,
				},
				{
					key: '4',
					name: '订单名称',
					des: '【订单号】的订单已成功接单，请及时完成并反馈任务',
					time: '2018-06-14 15:10',
					status: 1,
				},
				{
					key: '5',
					name: '订单名称',
					des: '【订单号】的订单已成功接单，请及时完成并反馈任务',
					time: '2018-06-14 15:10',
					status: 1,
				},
				{
					key: '6',
					name: '订单名称',
					des: '【订单号】的订单已成功接单，请及时完成并反馈任务',
					time: '2018-06-14 15:10',
					status: 1,
				},
			],
		};
	}

	getItemImg() {
		return require('../../imgs/icon2.png');
	}

	renderItem({item, index}) {
		return (
			<View style={styles.itemContainer}>
				<Image style={styles.itemIcon} source={this.getItemImg()} />
				<View style={styles.itemInfo}>
					<View style={styles.nameContainer}>
						<Text style={styles.orderName}>
							{ item.name }
						</Text>
						<Text style={styles.status}>
							未读
						</Text>
					</View>
					<Text style={styles.time}>
						{ item.time }
					</Text>
					<Text style={styles.des} numberOfLines={2} ellipsizeMode='tail'>
						{ item.des }
					</Text>
				</View>
			</View>
		);
	}

	render() {
		const { msgList } = this.state;
		return (
			<View style={styles.container}>
				<FlatList
					data={msgList}
					renderItem={itemData => {
						return this.renderItem(itemData);
					}}
					getItemLayout={(_, index) => (
						{length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
					)}
					style={styles.list}
					ItemSeparatorComponent={() => (<View
						style={{
							backgroundColor: '#E0E0E0',
							width: toDips(750),
							height: toDips(1),
						}}
					/>)}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	list: {
		marginTop: toDips(20),
	},
	itemContainer: {
		width: toDips(750),
		height: toDips(206),
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
	},
	itemIcon: {
		width: toDips(84),
		height: toDips(84),
		marginLeft: toDips(32),
	},
	itemInfo: {
		marginLeft: toDips(32),
	},
	nameContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	orderName: {
		fontSize: toDips(32),
		// fontWeight: '500',
		color: '#333333',
	},
	status: {
		fontSize: toDips(28),
		// fontWeight: '500',
		color: '#DD4124',
	},
	time: {
		fontSize: getFontSize(24),
		// fontWeight: '500',
		color: '#999999',
		marginTop: toDips(14),
	},
	des: {
		fontSize: toDips(28),
		// fontWeight: '500',
		color: '#333333',
		width: toDips(569),
		marginTop: toDips(22),
	},
});
