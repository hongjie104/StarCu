'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	TextInput,
	TouchableOpacity,
} from 'react-native';
import { toDips, getFontSize } from '../../utils/dimensions';
import { getBankCode, updateBank } from '../../service';
import toast from '../../utils/toast';
import { __TEST__ } from '../../config';

export default class PhoneChecker extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '验证手机号',
	});

	constructor(props) {
		super(props);
		this.state = {
			code: '',
			cd: 0,
		};
	}

	onCodeChange(code) {
		this.setState({
			code,
		});
	}

	onGetCode() {
		const { cd } = this.state;
		if (cd > 0) {
			toast('验证码已发送,请稍候');
			return;
		}
		this.setState({
			cd: 59,
		}, () => {
			this._interval = setInterval(() => {
				if (this.state.cd === 1) {
					if (this._interval) {
						clearInterval(this._interval);
						this._interval = null;
					}
				}
				this.setState({
					cd: this.state.cd - 1,
				});
			}, 1000);
			getBankCode().then(result => {
				if (__TEST__) {
					this.setState({
						code: result.datas.code,
					});
					toast('测试环境，验证码已自动填上');
				} else {
					toast('验证码已发送');
				}
			}).catch(e => {
				toast(e);
			});
		});
	}

	onUpdateBank() {		
		const { code } = this.state;
		if (!code) {
			toast('请输入验证码');
			return;
		}
		const data = { ...this.props.navigation.state.params, phoneNo: global.phone };
		updateBank(data, code).then(result => {
			toast('修改成功');
			const { updateBankName } = this.props.navigation.state.params;
			updateBankName && updateBankName();
			this.props.navigation.goBack();
		}).catch(e => {
			toast(e);
		});
	}

	render() {
		const { code } = this.state;
		return (
			<View style={styles.container}>
				<View style={styles.titleContainer}>
					<Text style={styles.title}>
						当前账户手机号：{ global.phone.substr(0, 3) + '****' + global.phone.substr(7) }
					</Text>
				</View>
				<View style={styles.inputContainer}>
					<Image style={styles.icon} source={require('../../imgs/yzm.png')} />
					<TextInput
						onChangeText={code => {
							this.onCodeChange(code);
						}}
						value={code}
						placeholder='请输入验证码'
						placeholderTextColor='#B5B5B5'
						style={styles.input}
						maxLength={4}
						keyboardType='numeric'
					/>
					<View style={styles.line} />
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							this.onGetCode();
						}}
						style={styles.sendCodeBtn}
					>
						<Text style={styles.sendCodeBtnTxt}>
							发送验证码
						</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						this.onUpdateBank();
					}}
					style={styles.submitBtn}
				>
					<Text style={styles.submitBtnTxt}>
						提交验证
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
		height: toDips(90),
		justifyContent: 'center',
	},
	title: {
		fontSize: getFontSize(30),
		color: '#333',
		marginLeft: toDips(36),
	},
	inputContainer: {
		height: toDips(117),
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: '#E9E9E9',
		borderTopWidth: toDips(1),
		borderBottomWidth: toDips(1),
	},
	icon: {
		width: toDips(48),
		height: toDips(48),
		marginLeft: toDips(30),
	},
	input: {
		fontSize: getFontSize(32),
		color: '#333',
		marginLeft: toDips(23),
		width: toDips(412),
	},
	line: {
		width: toDips(1),
		height: toDips(61),
		backgroundColor: '#60C766',
	},
	sendCodeBtn: {
		marginLeft: toDips(43),
	},
	sendCodeBtnTxt: {
		fontSize: getFontSize(32),
		color: '#60C766',
	},
	submitBtn: {
		width: toDips(391),
		height: toDips(82),
		backgroundColor: '#DD4124',
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: toDips(92),
		borderRadius: toDips(41),
	},
	submitBtnTxt: {
		fontSize: getFontSize(32),
		color: 'white',
	},
});
