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
import { getOrderMsg } from '../../service';
import toast from '../../utils/toast';

const ITEM_HEIGHT = toDips(206);

export default class OrderMsgList extends PureComponent {
	
	constructor(props) {
		super(props);
		this.state = {
			msgList: [],
			refreshing: false,
		};
		this.isFetching = false;
		this.page = 1;
		this.pageSize = 20;
	}

	componentWillMount() {
		this.fetchOrderMsg();
	}

	fetchOrderMsg() {
		if (this.isFetching){
			this.setState({
				refreshing: false,
			});
			return;
		}
		this.isFetching = true;
		this.getGetMsgFun()(this.page, this.pageSize).then(result => {
			/*
				time  时间
				id  ID
				title  消息标题
				content  消息内容
				status  状态（0：未读  1：已读）
			 */
			const orderMessages = this.getMsgFromData(result.datas);
			this.setState({
				msgList: orderMessages.map(m => {
					m.key = m.id.toString();
					return m;
				}),
				refreshing: false,
			}, () => {
				this.page++;
				this.isFetching = false;
			});
		}).catch(e => {
			toast(e);
		});
	}

	getItemImg() {
		return require('../../imgs/icon2.png');
	}

	getGetMsgFun() {
		return getOrderMsg;
	}

	getMsgFromData(data) {
		return data.orderMessages;
	}

	onRefresh() {
		this.page = 1;
		this.setState({
			refreshing: true,
		}, () => {
			this.fetchOrderMsg();
		});
	}

	onMore() {
		this.fetchOrderMsg();
	}

	renderItem({item, index}) {
		return (
			<View style={styles.itemContainer}>
				<Image style={styles.itemIcon} source={this.getItemImg()} />
				<View style={styles.itemInfo}>
					<View style={styles.nameContainer}>
						<Text style={styles.orderName}>
							{ item.title }
						</Text>
						<Text style={[styles.status, { color: item.status === 0 ? '#DD4124': '#999' }]}>
							{ item.status === 0 ? '未读' : '已读' }
						</Text>
					</View>
					<Text style={styles.time}>
						{ item.time }
					</Text>
					<Text style={styles.des} numberOfLines={2} ellipsizeMode='tail'>
						{ item.content }
					</Text>
				</View>
			</View>
		);
	}

	render() {
		const { msgList, refreshing } = this.state;
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
					onRefresh={() => {
						this.onRefresh();
					}}
					refreshing={refreshing}
					onEndReached={() => {
						this.onMore();
					}}
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
