'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableOpacity,
	TextInput,
} from 'react-native';
import { toDips, getFontSize } from '../../utils/dimensions';

// 提现
export default class WithdrawScene extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '提现申请',
	});

	constructor(props) {
		super(props);
		this.state = {
			// 提现金额
			value: '',
		};
	}

	onValueChange(value) {
		this.setState({
			value,
		});
	}

	render() {
		// const { navigate, goBack } = this.props.navigation;
		const { value } = this.state;
		return (
			<View style={styles.container}>
				<View style={styles.cardContainer}>
					<Image style={styles.cardImg} source={require('../../imgs/yhk.png')} />
					<View style={styles.cardInfoContainer}>
						<Text style={styles.bankName}>
							招商银行
						</Text>
						<Text style={styles.cardNum}>
							2312 **** **** **** 261
						</Text>
					</View>
				</View>
				<View style={styles.numMoneyContainer}>
					<Text style={styles.numMoneyTxt}>
						可提现金额 <Text style={{ color: '#DD4124' }}>5000</Text> 元
					</Text>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {

						}}
						style={styles.allBtn}
					>
						<Text style={styles.allBtnTxt}>
							全部提现
						</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.inputContainer}>
					<View style={styles.inputLeftContainer}>
						<Text style={styles.numMoneyTxt}>
							提现：
						</Text>
						<TextInput
							keyboardType='numeric'
							onChangeText={txt => {
								this.onValueChange(txt);
							}}
							placeholder='输入金额'
							placeholderTextColor='#999'
							underlineColorAndroid='transparent'
							value={value}
							style={styles.input}
						>
						</TextInput>
					</View>
					<Text style={[styles.numMoneyTxt, { marginLeft: 0, marginRight: toDips(32) }]}>
						元
					</Text>
				</View>
				{
					// 申请按钮
				}
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {

					}}
					style={styles.submitBtn}
				>
					<Text style={styles.submitBtnTxt}>
						申请
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
	cardContainer: {
		height: toDips(166),
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
	},
	cardImg: {
		width: toDips(92),
		height: toDips(65),
		marginLeft: toDips(40),
	},
	cardInfoContainer: {
		marginLeft: toDips(35),
	},
	bankName: {
		fontSize: getFontSize(32),
		// fontWeight: '500',
		color: '#333',
	},
	cardNum: {
		fontSize: getFontSize(30),
		// fontWeight: '500',
		color: '#999',
		marginTop: toDips(10),
	},
	numMoneyContainer: {
		height: toDips(95),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderColor: '#DCDCDC',
		borderTopWidth: 1,
		borderBottomWidth: 1,
	},
	numMoneyTxt: {
		fontSize: getFontSize(30),
		// fontWeight: '500',
		color: '#333',
		marginLeft: toDips(39),
	},
	allBtn: {
		marginRight: toDips(32),
		borderRadius: toDips(25),
		borderColor: '#DD4124',
		borderWidth: 1,
		padding: toDips(12),
		alignItems: 'center',
		justifyContent: 'center',
	},
	allBtnTxt: {
		fontSize: getFontSize(28),
		// fontWeight: '500',
		color: '#DD4124',
	},
	inputContainer: {
		height: toDips(113),
		backgroundColor: 'white',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderColor: '#DCDCDC',		
		borderBottomWidth: 1,
	},
	inputLeftContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	input: {
		width: toDips(300),
		fontSize: getFontSize(30),
		color: '#333',
		// fontWeight: '500',
	},
	submitBtn: {
		width: toDips(391),
		height: toDips(82),
		backgroundColor: '#DD4124',
		borderRadius: toDips(41),
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		marginTop: toDips(97),
	},
	submitBtnTxt: {
		fontSize: getFontSize(32),
		// fontWeight: '500',
		color: 'white',
	},
});
