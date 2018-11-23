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
import Spinner from '../../component/Spinner';
import { toDips, getFontSize } from '../../utils/dimensions';
import { getReflect, getBankList, reflect } from '../../service';
import toast from '../../utils/toast';

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
			// 可提现金额
			withdrawableAmount: '',
 			// 银行卡信息
			bankInfo: {
				// 持卡人姓名
				cardholders_name: '',
				// 开户银行名称
				bankName: '',
				// 银行卡号
				bank_card_no: '',
			},
 			// 提现码，防止单次重复提现
			reflectKey: '',
 			// 到账描述
			arrivalDes: '',
			loading: true,
		};
	}

	async componentDidMount() {
		const bankArr = await getBankList();
		let data = null;
		try {
			data = await getReflect();
		} catch(e) {
			toast(e);
			return;
		}
		data = data.datas;
		let bankName = '';
		for (let i = 0; i < bankArr.datas.bankList.length; i++) {
			if (bankArr.datas.bankList[i].id === data.bankInfo.bankName) {
				bankName = bankArr.datas.bankList[i].text;
				break;
			}
		}
		this.setState({
			...data,
			bankInfo: {
				...data.bankInfo,
				bankName,
			},
			loading: false,
		});
	}

	// 全部提现
	onAllPress() {
		const { withdrawableAmount } = this.state;
		this.setState({
			value: withdrawableAmount,
		});
	}

	onValueChange(value) {
		this.setState({
			value,
		});
	}

	onSubmit() {
		const { value, reflectKey, withdrawableAmount } = this.state;
		if (value === '' || isNaN(value)) {
			toast('请输入提现金额');
			return;
		}
		const amount = parseFloat(value);
		if (amount < 1) {
			toast('可提现金额不能少于1元');
			return;
		}
		const withdrawableAmountValue = parseFloat(withdrawableAmount);
		if (amount > withdrawableAmountValue) {
			toast('提现金额超出了最大金额');
			return;
		}
		reflect(amount, reflectKey).then(result => {
			toast('提现成功!' + result.datas.arrivalDes);
		}).catch(e => {
			toast(e);
		});
	}

	render() {
		const { loading, value, withdrawableAmount, bankInfo } = this.state;
		if (loading) {
			return <Spinner />;
		}
		return (
			<View style={styles.container}>
				<View style={styles.cardContainer}>
					<Image style={styles.cardImg} source={require('../../imgs/yhk.png')} />
					<View style={styles.cardInfoContainer}>
						<Text style={styles.bankName}>
							{ bankInfo.bankName }
						</Text>
						<Text style={styles.cardNum}>
							{ bankInfo.bankCardNo }
						</Text>
					</View>
				</View>
				<View style={styles.numMoneyContainer}>
					<Text style={styles.numMoneyTxt}>
						可提现金额 <Text style={{ color: '#DD4124' }}>{ withdrawableAmount }</Text> 元
					</Text>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							this.onAllPress();
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
						this.onSubmit();
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
