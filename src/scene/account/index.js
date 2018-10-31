'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableOpacity,
} from 'react-native';
import { toDips, getFontSize } from '../../utils/dimensions';

// 账户页面
export default class AccountScene extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '账户总额',
	});

	constructor(props) {
		super(props);
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		return (
			<View style={styles.container}>
				<View style={styles.topContainer}>
					<Image style={styles.moneyIcon} source={require('../../imgs/qd.png')} />
					<Text style={styles.title}>
						当前账户总额
					</Text>
					<Text style={styles.numMoneyTxt}>
						¥2000.00
					</Text>
				</View>
				<View style={styles.infoContainer}>
					<View style={styles.infoCell}>
						<Text style={styles.infoKey}>
							累计收入
						</Text>
						<Text style={styles.infoVal}>
							¥3000.00
						</Text>
					</View>
					<View style={styles.infoCell}>
						<View style={styles.infoKeyRow}>
							<Text style={styles.infoKey}>
								可提现
							</Text>
							<Image style={styles.questionImg} source={require('../../imgs/wh.png')} />
						</View>
						<Text style={styles.infoVal}>
							¥3000.00
						</Text>
					</View>
					<View style={styles.infoCell}>
						<Text style={styles.infoKey}>
							累计扣款
						</Text>
						<Text style={styles.infoVal}>
							¥3000.00
						</Text>
					</View>
					<View style={styles.infoCell}>
						<View style={styles.infoKeyRow}>
							<Text style={styles.infoKey}>
								待入账
							</Text>
							<Image style={styles.questionImg} source={require('../../imgs/wh.png')} />
						</View>
						<Text style={styles.infoVal}>
							¥3000.00
						</Text>
					</View>
				</View>
				{
					// 其他项目
				}
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {

					}}
					style={[styles.itemContainer, { marginTop: toDips(24), borderTopWidth: 1 }]}
				>
					<View style={styles.itemLeftContainer}>
						<Image style={styles.itemImg} source={require('../../imgs/dzls.png')} />
						<Text style={styles.itemTxt}>
							对账流水
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
					<View style={styles.itemLeftContainer}>
						<Image style={styles.itemImg} source={require('../../imgs/cjwt.png')} />
						<Text style={styles.itemTxt}>
							常见问题
						</Text>
					</View>
					<Image style={styles.arrowImg} source={require('../../imgs/jt.png')} />
				</TouchableOpacity>
				{
					// 提现按钮
				}
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {

					}}
					style={styles.submitBtn}
				>
					<Text style={styles.submitBtnTxt}>
						提现
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
		height: toDips(279),
		backgroundColor: '#DD4124',
		alignItems: 'center',
	},
	moneyIcon: {
		width: toDips(59),
		height: toDips(70),
		marginTop: toDips(30),
	},
	title: {
		fontSize: getFontSize(28),
		fontWeight: '500',
		color: 'white',
		opacity: 0.8,
		marginTop: toDips(28),
	},
	numMoneyTxt: {
		fontSize: getFontSize(48),
		fontWeight: '500',
		color: 'white',
		marginTop: toDips(22),
	},
	infoContainer: {
		flexDirection: 'row',
		height: toDips(134),
		backgroundColor: 'white',
		borderColor: '#DCDCDC',
		borderTopWidth: 1,
		borderBottomWidth: 1,
	},
	infoCell: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	infoKeyRow: {
		flexDirection: 'row',
	},
	infoKey: {
		fontSize: getFontSize(28),
		fontWeight: '500',
		color: '#333',
	},
	infoVal: {
		fontSize: getFontSize(28),
		fontWeight: '500',
		color: '#DD4124',
		marginTop: toDips(18),
	},
	questionImg: {
		width: toDips(29),
		height: toDips(29),
		marginLeft: toDips(16),
	},
	itemContainer: {
		height: toDips(110),
		backgroundColor: 'white',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderColor: '#E0E0E0',
		borderBottomWidth: 1,
	},
	itemLeftContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	itemImg: {
		width: toDips(60),
		height: toDips(60),
		marginLeft: toDips(29),
	},
	itemTxt: {
		fontSize: getFontSize(30),
		fontWeight: '500',
		color: '#3E3E3E',
		marginLeft: toDips(32),
	},
	arrowImg: {
		width: toDips(18),
		height: toDips(34),
		marginRight: toDips(32),
	},
	submitBtn: {
		alignSelf: 'center',
		width: toDips(391),
		height: toDips(82),
		backgroundColor: '#DD4124',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: toDips(41),
		marginTop: toDips(96),
	},
	submitBtnTxt: {
		fontSize: getFontSize(32),
		fontWeight: '500',
		color: 'white',
	},
});
