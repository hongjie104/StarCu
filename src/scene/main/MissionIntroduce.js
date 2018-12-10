'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import Spinner from '../../component/Spinner';
import { toDips, getFontSize } from '../../utils/dimensions';
import { takeOrder, getMissionByOrder, getMissionInfo } from '../../service';
import toast from '../../utils/toast';

// 任务说明
export default class MissionIntroduce extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '理货',
	});

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
		};
	}

	async componentDidMount() {
		let taskId = null;
		let status = -1;
		let orderId = -1;
		let isEnabled = true;
		let taskTotalAmount = null;
		let taskTotalAmountLabel = '任务金额';
		if (this.props.navigation.state.params.type === 1) {
			status = this.props.navigation.state.params.mission.status;
			orderId = this.props.navigation.state.params.mission.orderId;
			const missionData = await this.getFirstMissionByOrder(orderId);
			taskId = missionData.task ? missionData.task.taskId : null;
			taskTotalAmount = missionData ? missionData.orderAmount : null;
			taskTotalAmountLabel = '任务总金额';
		} else {
			taskId = this.props.navigation.state.params.mission.taskId;
			isEnabled = this.props.navigation.state.params.mission.isEnabled;
		}
		if (taskId) {
			const missionData = await getMissionInfo(taskId);
			// { datas: 
			// { orderType: '1871479136913408',
			//   orderEndDate: '2018-12-31',
			//   skus: 
			//    [ { skuName: '闲趣自然清咸原味韧性饼干90克/包',
			//        skuNo: '1591076',
			//        skuId: '1',
			//        status: 0 } ],
			//   orderDays: 27,
			//   standardPhoto: [ 'http://media.hqxyun.com/20181205205522.jpg' ],
			//   orderBeginDate: '2018-12-05',
			//   require: 'test11111',
			//   remark: '123',
			//   orderTitle: 'test11111',
			//   orderTypeDesc: '堆头理货',
			//   taskTotalAmount: '596.70' } }
			// console.warn(missionData);
			this.setState({
				...missionData.datas,
				taskTotalAmount: taskTotalAmount || missionData.datas.taskTotalAmount,
				taskTotalAmountLabel,
				status: status !== -1 ? status : (missionData.datas.skus[0] ? missionData.datas.skus[0].status : -1),
				loading: false,
				orderId,
				taskId,
				isEnabled,
			});
		}
	}


	async getFirstMissionByOrder(orderId) {
		const result = await getMissionByOrder(orderId);
		const { tasks, taskNum } = result.datas;
		if (taskNum > 0) {
			return {
				task: tasks[0],
				orderAmount: result.datas.orderAmount,
			};
		}
		toast('该订单的任务数量为0');
	}

	async onSubmit() {
		this.setState({
			loading: true,
		});
		const { status, orderId } = this.state;
		const { type, onTakeOrder } = this.props.navigation.state.params;
		if (type === 1) {
			if (status === 1) {
				// 还没有接，那就先接一下任务
				try {
					await takeOrder(orderId);
				} catch (err) {
					toast(err);
					this.setState({
						loading: false,
					}, () => {
						if (err === '请先完善个人资料') {
							this.props.navigation.navigate({
								routeName: 'UserInfoScene',
							});
						}
					});
					return;
				}
				onTakeOrder && onTakeOrder(orderId)
			}
		}
		const { navigate } = this.props.navigation;
		navigate({
			routeName: 'MissionDetailScene',
			params: {
				...this.state,
				onMissionDone: taskId => {
					if (this.state.taskId === taskId) {
						if (this.props.navigation.state.params.type === 0) {
							// 任务的话，就变成已完成状态
							this.setState({
								status: 1,
							});
						} else {
							// 订单的话，就变成已接单的状态
							this.setState({
								status: 2,
							});
						}
					}
				},
			},
		});
		this.setState({
			loading: false,
		});
	}

	render() {
		const {
			taskTotalAmount,
			taskTotalAmountLabel,
			orderTitle,
			orderBeginDate,
			orderStartDate,
			orderEndDate,
			orderDays,
			orderTypeDesc,
			standardPhoto,
			status,
			remark,
			isEnabled,
			loading,
		} = this.state;
		// console.warn(isEnabled, status);
		return (
			<View style={styles.container}>
				<ScrollView style={styles.container}>
					<View style={styles.titleContainer}>
						<Text style={styles.missionTitle}>
							{ orderTitle }
						</Text>
						<View style={styles.misstionTitleRow}>
							<Image style={styles.icon} source={require('../../imgs/sj2.png')} />
							<Text style={styles.missionInfo}>
								项目时间：{ orderBeginDate || orderStartDate }至{ orderEndDate }（{ orderDays }天）
							</Text>
						</View>
						<View style={styles.misstionTitleRow}>
							<Image style={styles.icon} source={require('../../imgs/xm2.png')} />
							<Text style={styles.missionInfo}>
								项目介绍:  { orderTypeDesc }
							</Text>
						</View>
						<View style={styles.misstionTitleRow}>
							<Image style={styles.icon} source={require('../../imgs/qb.png')} />
							<Text style={styles.missionInfo}>
								{ taskTotalAmountLabel }:  { taskTotalAmount }元
							</Text>
						</View>
					</View>
					<View style={styles.desContainer}>
						<View style={styles.desTitleContainer}>
							<View style={styles.desTitleIcon} />
							<Text style={styles.desTitleTxt}>
								陈列要求：
							</Text>
						</View>
						<Text style={styles.des}>
							{ this.state.require }
						</Text>
						{
							// <Text style={styles.des}>
							// 	2.(服务器没有传)
							// </Text>
						}

						<View style={styles.desTitleContainer}>
							<View style={styles.desTitleIcon} />
							<Text style={styles.desTitleTxt}>
								补充说明：
							</Text>
						</View>
						<Text style={styles.des}>
							{ remark }
						</Text>

						<View style={styles.desTitleContainer}>
							<View style={styles.desTitleIcon} />
							<Text style={styles.desTitleTxt}>
								标准陈列图片：
							</Text>
						</View>
						{
							standardPhoto && standardPhoto.map((photo, i) => (
								<Image key={i} style={styles.img} source={{ uri: photo }} />
							))
						}
					</View>
				</ScrollView>
				{
					// 按钮
					isEnabled === 1 ? (
						<View
							style={[styles.submitBtn, styles.submitBtn_disabeld]}
						>
							<Text style={[styles.submitBtnTxt, styles.submitBtnTxt_disabeld]}>
								未开始
							</Text>
						</View>
					) : (
						isEnabled === -1 ? (
							// 已完成了，尽管已过期，但是还是可以点的
							status === 1 ? (
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {
										this.onSubmit();
									}}
									style={styles.submitBtn}
								>
									<Text style={styles.submitBtnTxt}>
										{ status === 1 ? '已完成': '做任务' }
									</Text>
								</TouchableOpacity>
							) : (
								<View
									style={[styles.submitBtn, styles.submitBtn_disabeld]}
								>
									<Text style={[styles.submitBtnTxt, styles.submitBtnTxt_disabeld]}>
										已过期
									</Text>
								</View>
							)
						) : (
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									this.onSubmit();
								}}
								style={styles.submitBtn}
							>
								<Text style={styles.submitBtnTxt}>
									{ this.props.navigation.state.params.type === 1 ? (status === 1 ? '接单' : '做任务') : (status === 1 ? '已完成': '做任务') }
								</Text>
							</TouchableOpacity>
						)
					)
				}
				{
					loading && <Spinner />
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
	titleContainer: {
		backgroundColor: 'white',
		padding: toDips(48),
		borderColor: '#E6E6E6',
		borderBottomWidth: 1,
	},
	missionTitle: {
		fontSize: getFontSize(32),
		color: '#4E4E4E',
		marginBottom: toDips(8),
	},
	misstionTitleRow: {
		flexDirection: 'row',
		marginTop: toDips(20),
		alignItems: 'center',
	},
	icon: {
		width: toDips(30),
		height: toDips(30),
	},
	missionInfo: {
		fontSize: getFontSize(28),
		color: '#A9A9A9',
		marginLeft: toDips(8),
	},
	desContainer: {
		backgroundColor: 'white',
		paddingLeft: toDips(32),
		paddingRight: toDips(32),
		paddingBottom: toDips(32),
		borderColor: '#E6E6E6',
		borderBottomWidth: 1,
		borderTopWidth: 1,
		marginTop: toDips(21),
	},
	desTitleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: toDips(32),
	},
	desTitleIcon: {
		width: toDips(6),
		height: toDips(32),
		borderRadius: toDips(3),
		backgroundColor: '#DD4124',
	},
	desTitleTxt: {
		fontSize: getFontSize(28),
		color: '#DD4124',
		marginLeft: toDips(13),
	},
	des: {
		fontSize: getFontSize(28),
		color: '#636363',
		marginTop: toDips(32),
		lineHeight: toDips(36),
	},
	img: {
		width: toDips(677),
		height: toDips(396),
		marginTop: toDips(32),
	},
	submitBtn: {
		width: toDips(391),
		height: toDips(82),
		borderRadius: toDips(41),
		backgroundColor: '#DD4124',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		marginTop: toDips(56),
		marginBottom: toDips(60),
	},
	submitBtnTxt: {
		fontSize: getFontSize(32),
		color: 'white',
	},
	submitBtn_disabeld: {
		backgroundColor: '#E9E9E9',
	},
	submitBtnTxt_disabeld: {
		color: 'rgba(0,0,0,0.6)',
	},
});
