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
import { takeOrder, getMissionByOrder } from '../../service';
import toast from '../../utils/toast';

// 任务说明
export default class MissionIntroduce extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '理货',
	});

	constructor(props) {
		super(props);
		/*
		{ statusDesc: '未接单',
		  orderEndDate: '2018-09-06',
		  orderDays: '14',
		  standardPhoto: [ 'http://media.hqxyun.com/20181116095741.jpg' ],
		  orderId: '853596988835840',
		  orderBeginDate: '2018-09-06',
		  require: '陈列要求',
		  remark: '其他说明',
		  orderTitle: 'wef',
		  status: 1,
		  orderContent: 'wef',
		  username: '平台管理员',
		  received: 0,
		  key: '853596988835840' }
		 */
		/*
		{ orderType: '堆头理货',
  statusDesc: '未完成',
  orderEndDate: '2018-11-30',
  orderId: '2579483158448128',
  orderStartDate: '2018-11-22',
  orderTypeId: '1871479136913408',
  orderTitle: '测试2测试2测试2测试2',
  taskId: '2580334666385408',
  key: '2580334666385408',
  status: 0 }
		 */
		const { mission } = props.navigation.state.params;
		// console.warn(mission);
		this.state = {
			...mission,
			loading: false,
		};
	}

	componentWillUnmount() {
		this.setState({
			loading: false,
		});
	}

	async getFirstMissionByOrder(orderId) {
		// status 1 是未接  2 是已接
		const result = await getMissionByOrder(orderId);
		const { tasks, taskNum } = result.datas;
		if (taskNum > 0) {
			return tasks[0];
		}
		toast('该订单的任务数量为0');
		//.then(result => {
			// { datas: 
			//    { expectedIncome: 300,
			//      tasks: 
			//       [ { orderType: '堆头理货',
			//           statusDesc: '未完成',
			//           orderEndDate: '2018-09-20',
			//           orderId: '853289351841792',
			//           orderStartDate: '2018-09-06',
			//           orderTypeId: '1871479136913408',
			//           orderTitle: 'wef',
			//           taskId: '853289791981568',
			//           status: '0' } ],
			//      taskNum: 1 } }
		// }).catch(e => {
		// 	toast(e);
		// });
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
			const missionData = await this.getFirstMissionByOrder(orderId);
			if (missionData) {
				// [ { orderType: '堆头理货',
				// statusDesc: '未完成',
				// orderEndDate: '2018-09-20',
				// orderId: '853289351841792',
				// orderStartDate: '2018-09-06',
				// orderTypeId: '1871479136913408',
				// orderTitle: 'wef',
				// taskId: '853289791981568',
				// status: '0' } ],
				const { navigate } = this.props.navigation;
				navigate({
					routeName: 'MissionDetailScene',
					params: missionData,
				});
			}
		} else {
			const { navigate } = this.props.navigation;
			navigate({
				routeName: 'MissionDetailScene',
				params: {
					...this.state,
				},
			});
		}
		this.setState({
			loading: false,
		});
	}

	render() {
		/*
		{ statusDesc: '未接单',
		  orderEndDate: '2018-09-06',
		  orderDays: '14',
		  standardPhoto: [ 'http://media.hqxyun.com/20181116095741.jpg' ],
		  orderId: '853596988835840',
		  orderBeginDate: '2018-09-06',
		  require: '陈列要求',
		  remark: '其他说明',
		  orderTitle: 'wef',
		  status: 1,
		  orderContent: 'wef',
		  username: '平台管理员',
		  received: 0,
		  key: '853596988835840' }
		 */
		const {
			orderTitle,
			orderBeginDate,
			orderStartDate,
			orderEndDate,
			orderDays,
			orderContent,
			standardPhoto,
			status,
			remark,
			isEnabled,
			loading,
		} = this.state;
		// type 0 是任务  1 是订单
		const { type } = this.props.navigation.state.params;
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
								项目介绍:  { orderContent }
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
								<Image key={i} style={styles.img} source={{ uri: 'photo' }} />
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
							type === 0 && status === 1 ? (
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
									{ type === 1 ? (status === 1 ? '接单' : '做任务') : (status === 1 ? '已完成': '做任务') }
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
