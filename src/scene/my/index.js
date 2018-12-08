'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	// Linking,
} from 'react-native';
import { toDips, getFontSize } from '../../utils/dimensions';
import navigationUtil from '../../utils/navigation';
import { getMine, getBank, getBankList } from '../../service';
import toast from '../../utils/toast';
import { removeLocalData } from '../../utils/storage';
import { open as openMeiQia, setClientInfo as setClientInfoForMeiQia } from '../../utils/meiQia';

export default class MyScene extends PureComponent {
	
	static navigationOptions = {
		headerTitle: '我的',
		tabBarIcon: ({ focused, tintColor }) => {
			const img = focused ? require('../../imgs/wdax.png') : require('../../imgs/wd.png');
			return <Image style={{ width: toDips(50), height: toDips(50), }} source={img} />;
		},
		tabBarLabel: ({ focused }) => {
			return <Text style={[{ fontSize: getFontSize(26), alignSelf: 'center', }, focused ? { color: '#DD4124' } : { color: '#878787' }]}>我的</Text>;
		},
	};

	constructor(props) {
		super(props);
		this.state = {
			// 头像
			avatar: null,
			// 电话号码
			phoneNo: '',
			// 姓名
			fullName: '',
			// 账户总额
			totalIncome: 0,
			// 客服热线
			consumerHotline: '',
			// withdrawableAmount 可提现金额
		};
	}

	async componentDidMount() {
		let result = null;
		try {
			result = await getMine();
		} catch(e) {
			toast(e);
			return;
		}
		let bankArr = await getBankList()
		bankArr = bankArr.datas.bankList;
		let bankData = null;
		let bankName = '';
		try {
			bankData = await getBank();
			for (let i = 0; i < bankArr.length; i++) {
				if (bankArr[i].id === bankData.datas.bankName) {
					bankName = bankArr[i].text;
					break;
				}
			}
		} catch(e) {
			toast(e);
			return;
		}
		this.setState({ ...result.datas, ...bankData.datas, bankName });
	}

	onHelp() {
		const { navigation: { navigate } } = this.props;
		navigate({
			routeName: 'HelperScene',
			params: {
				url: 'http://101.132.113.94/helper.html',
				title: '帮助中心',
			},
		});
	}

	onContactCustomerService() {
		setClientInfoForMeiQia({
			// name	真实姓名
			// gender	性别
			// age	年龄
			// tel	电话
			// weixin	微信
			// weibo	微博
			// address	地址
			// email	邮件
			// weibo	微博
			// avatar	头像 URL
			// tags	标签，数组形式，且必须是企业中已经存在的标签
			// source	顾客来源
			// comment	备注
			name: '张三',
		}, () => {
			openMeiQia();
		}, err => {
			// toast(err);
			console.warn(err);
		});
	}

	onLogout() {
		global.token = null;
		global.uid = null;
		removeLocalData('token');
		removeLocalData('uid');
		removeLocalData('phone');
		navigationUtil.reset(this.props.navigation, 'LoginScene');
	}

	render() {
		const {
			avatar,
			phoneNo,
			fullName,
			totalIncome,
			consumerHotline,
			bankName,
		} = this.state;
		const { navigate } = this.props.navigation;
		return (
			<View style={styles.container}>
				<View style={styles.topContainer}>
					<Image style={styles.header} source={avatar ? { uri: avatar } : require('../../imgs/tx.png')} />
					<Text style={styles.myName}>
						{ phoneNo }
					</Text>
				</View>
				{
					// 数据统计
				}
				<View style={styles.middleContainer}>
					{
						// 账户总额
					}
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							navigate({
								routeName: 'AccountScene',
							});
						}}
						style={styles.infoContainer}
					>
						<Image style={styles.imgInfo} source={require('../../imgs/zhze.png')} />
						<View style={styles.infoKeyVal}>
							<Text style={styles.infoKey}>
								账户总额
							</Text>
							<Text style={styles.infoVal}>
								¥{ totalIncome }
							</Text>
						</View>
					</TouchableOpacity>
					<View style={styles.infoLine} />
					{
						// 银行卡
					}
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							navigate({
								routeName: 'BankCardScene',
								params: {
									updateBankName: bankName => {
										this.setState({
											bankName, 
										});
									},
								},
							});
						}}
						style={styles.infoContainer}
					>
						<Image style={styles.imgInfo} source={require('../../imgs/thk.png')} />
						<View style={styles.infoKeyVal}>
							<Text style={styles.infoKey}>
								银行卡
							</Text>
							<Text style={styles.infoVal}>
								{ bankName || '未绑定' }
							</Text>
						</View>
					</TouchableOpacity>
				</View>
				{
					// N个按钮
				}
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						navigate({
							routeName: 'UserInfoScene',
						});
					}}
					style={[styles.itemContainer, styles.firstItemContainer]}
				>
					<View style={styles.itemContainerLeft}>
						<Image style={styles.itemImg} source={require('../../imgs/grxx.png')} />
						<Text style={styles.itemName}>
							个人信息
						</Text>
					</View>
					<Image style={styles.arrowImg} source={require('../../imgs/jt.png')} />
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						this.onHelp();
					}}
					style={styles.itemContainer}
				>
					<View style={styles.itemContainerLeft}>
						<Image style={styles.itemImg} source={require('../../imgs/bzzx.png')} />
						<Text style={styles.itemName}>
							帮助中心
						</Text>
					</View>
					<Image style={styles.arrowImg} source={require('../../imgs/jt.png')} />
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						this.onContactCustomerService();
						// Linking.openURL(`tel:${consumerHotline.replace(/-/g, '')}`).then(result => {
						// 	// ...
						// }).catch(e => {
						// 	console.warn(e);
						// });
					}}
					style={styles.itemContainer}
				>
					<View style={styles.itemContainerLeft}>
						<Image style={styles.itemImg} source={require('../../imgs/lxkf.png')} />
						<Text style={styles.itemName}>
							联系客服
						</Text>
					</View>
					<Image style={styles.arrowImg} source={require('../../imgs/jt.png')} />
				</TouchableOpacity>
				{
					// 退出登录
				}
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						this.onLogout();
					}}
					style={styles.logoutBtn}
				>
					<Text style={styles.logoutBtnTxt}>
						退出登录		
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
	topContainer: {
		width: toDips(750),
		height: toDips(236),
		backgroundColor: '#DD4124',
		alignItems: 'center',
	},
	header: {
		width: toDips(110),
		height: toDips(110),
		borderColor: 'rgba(255, 255, 255, 0.3)',
		borderWidth: toDips(5),
		borderRadius: toDips(55),
		marginTop: toDips(18),
	},
	myName: {
		fontSize: toDips(30),
		// fontWeight: '500',
		color: 'white',
		marginTop: toDips(24),
	},
	middleContainer: {
		flexDirection: 'row',
		height: toDips(136),
		backgroundColor: 'white',
		alignItems: 'center',
		borderColor: 'rgba(224, 224, 224, 1)',
		borderBottomWidth: 1,
	},
	infoContainer: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
	},
	imgInfo: {
		width: toDips(60),
		height: toDips(60),
		marginLeft: toDips(76),
	},
	infoKeyVal: {
		marginLeft: toDips(40),
	},
	infoKey: {
		fontSize: toDips(28),
		// fontWeight: '500',
		color: '#333333',
	},
	infoVal: {
		fontSize: toDips(28),
		// fontWeight: '500',
		color: '#DD4124',
		marginTop: toDips(12),
	},
	infoLine: {
		width: toDips(1),
		height: toDips(59),
		backgroundColor: '#D7D7D7',
	},
	itemContainer: {
		width: toDips(750),
		height: toDips(110),
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderColor: 'rgba(224, 224, 224, 1)',
		borderBottomWidth: 1,
	},
	firstItemContainer: {
		borderTopWidth: 1,
		marginTop: toDips(22),
	},
	itemContainerLeft: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	itemImg: {
		width: toDips(60),
		height: toDips(60),
		marginLeft: toDips(35),
	},
	itemName: {
		fontSize: getFontSize(30),
		color: '#3E3E3E',
		// fontWeight: '500',
		marginLeft: toDips(32),
	},
	arrowImg: {
		width: toDips(18),
		height: toDips(34),
		marginRight: toDips(27),
	},
	logoutBtn: {
		width: toDips(750),
		height: toDips(110),
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: 'rgba(224, 224, 224, 1)',
		borderBottomWidth: 1,
		borderTopWidth: 1,
		marginTop: toDips(23),
	},
	logoutBtnTxt: {
		fontSize: getFontSize(32),
		// fontWeight: '500',
		color: '#DD4124',
	},
});
