'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	FlatList,
	Image,
	Text,
	TouchableOpacity,
} from 'react-native';
import { toDips, getFontSize } from '../../utils/dimensions';
import { getOrderMsg, setMsgReaded, getTodayMission } from '../../service';
import toast from '../../utils/toast';

// const ITEM_HEIGHT = toDips(206);

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
		if (this.isFetching) {
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
				msgList: orderMessages ? orderMessages.map(m => {
					m.key = m.id.toString();
					return m;
				}) : [],
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

	onItemPress(msgData) {
		/*
		{ orderId: '2579483158448128',
             time: '2018-11-22 22:32:57',
             id: '2584867454388224',
             title: '测试2测试2测试2测试2',
             content: '2580334082590720的订单您已成功接单，请及时完成任务并反馈。',
             taskId: '2580334082590720',
             status: '0' }*/
		const { id, taskId } = msgData;
		setMsgReaded(id).then(result => {
			const msgList = [...this.state.msgList];
			for (let i = 0; i < msgList.length; i++) {
				if (msgList[i].id === id) {
					msgList[i].status = 1;
					break
				}
			}
			this.setState({
				msgList,
			}, () => {
				if (taskId) {
					// 跳转到任务详情
					getTodayMission(taskId).then(result => {
						const { tasks } = result.datas;
						if (Array.isArray(tasks) && tasks.length > 0) {
							const { navigation: { navigate }, type } = this.props;
							navigate({
								routeName: 'MissionIntroduceScene',
								params: {
									mission: tasks[0],
									// 0 是任务
									type: 0,
								},
							});
						} else {
							toast('该消息tasks的不是数组或者长度为0,请联系后端');
						}
					}).catch(e => {
						toast(e);
					});
				}
			});
		}).catch(e => {
			toast(e);
		});
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
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={() => {
					this.onItemPress(item);
				}}
				style={styles.itemContainer}
			>
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
			</TouchableOpacity>
		);
	}

	render() {
		const { msgList, refreshing } = this.state;
		return (
			<View style={styles.container}>
				{
					Array.isArray(msgList) && msgList.length > 0 ? (
						<FlatList
							data={msgList}
							renderItem={itemData => {
								return this.renderItem(itemData);
							}}
							// getItemLayout={(_, index) => (
							// 	{length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
							// )}
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
					) : (
						<Image style={styles.emptyImg} source={require('../../imgs/empty.png')} />
					)
				}
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
		// height: toDips(206),
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: toDips(24),
		paddingBottom: toDips(24),
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
		lineHeight: toDips(42),
	},
	emptyImg: {
		width: toDips(283),
		height: toDips(292),
		marginLeft: toDips(267),
		marginTop: toDips(250),
	},
});
