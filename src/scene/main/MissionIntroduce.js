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
		const { mission } = props.navigation.state.params;
		this.state = {
			...mission,
		};
	}

	onSubmit() {
		const { status } = this.state;
		const { type } = this.props.navigation.state.params;
		if (type === 1 && status === 1) {
			const { orderId } = this.state;
			getMissionByOrder(orderId).then(result => {
				console.warn(result);
				// takeOrder(orderId).then(result => {
				// 	const {navigate} = this.props.navigation;
				// 	navigate({
				// 		routeName: 'MissionDetailScene',
				// 		params: {
				// 			...this.state,
				// 		},
				// 	});
				// }).catch(e => {
				// 	toast(e);
				// });
			}).catch(e => {
				toast(e);
			});
		} else {
			const {navigate} = this.props.navigation;
			navigate({
				routeName: 'MissionDetailScene',
				params: {
					...this.state,
				},
			});
		}
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
			orderEndDate,
			orderDays,
			orderContent,
			standardPhoto,
			status,
			remark,
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
								项目时间：{ orderBeginDate }至{ orderEndDate }（{ orderDays }天）
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
				}
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						this.onSubmit();
					}}
					style={styles.submitBtn}
				>
					<Text style={styles.submitBtnTxt}>
						{ type === 1 ? (status === 1 ? '接单' : '做任务') : '做任务' }
					</Text>
				</TouchableOpacity>
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
});
