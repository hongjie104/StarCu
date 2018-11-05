'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
} from 'react-native';
import { toDips, getFontSize } from '../../utils/dimensions';
import navigationUtil from '../../utils/navigation';

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
	}

	onLogout() {
		navigationUtil.reset(this.props.navigation, 'LoginScene');
	}

	render() {
		const { navigate } = this.props.navigation;
		return (
			<View style={styles.container}>
				<View style={styles.topContainer}>
					<Image style={styles.header} source={require('../../imgs/tx.png')} />
					<Text style={styles.myName}>
						16211242102
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
								¥20000
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
								未绑定
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

					}}
					style={styles.itemContainer}
				>
					<View style={styles.itemContainerLeft}>
						<Image style={styles.itemImg} source={require('../../imgs/lxkf.png')} />
						<Text style={styles.itemName}>
							联系客服 400-021-21221
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
