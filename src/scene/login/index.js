'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from 'react-native';
const dismissKeyboard = require('dismissKeyboard');
import { toDips, getFontSize } from '../../utils/dimensions';
import navigationUtil from '../../utils/navigation';
import toast from '../../utils/toast';
import { getLoginCode, login } from '../../service';
import { isPhone } from '../../utils/reg';
import { __TEST__ } from '../../config';
import { saveDataToLocal } from '../../utils/storage';

export default class LoginScene extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		header: null,
	});

	constructor(props) {
		super(props);
		this.state = {
			phone: '',
			code: '',
			cd: 0,
		};
	}

	componentWillUnmount() {
		if (this._interval) {
			clearInterval(this._interval);
			this._interval = null;
		}
	}

	onPhoneChange(phone) {
		this.setState({
			phone,
		});
	}

	onCodeChange(code) {
		this.setState({
			code,
		});
	}

	onGetLoginCode() {
		const { phone, cd } = this.state;
		if (cd > 0) {
			toast('验证码已发送,请稍候');
			return;
		}
		if (!isPhone(phone)) {
			toast('请输入正确的手机号码');
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
			getLoginCode(phone).then(result => {
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
				if (this._interval) {
					clearInterval(this._interval);
					this._interval = null;
				}
				this.setState({
					cd: 0, 
				});
			});
		});
	}

	onLogin() {
		const { phone, code } = this.state;
		if (!code) {
			toast('请输入正确的验证码');
			return;
		}
		if (!isPhone(phone)) {
			toast('请输入正确的手机号码');
			return;
		}
		saveDataToLocal('phone', phone, () => {
			global.phone = phone;
			login(phone, code).then(result => {
				const { token, uid } = result.datas;
				global.token = token;
				global.uid = uid;
				saveDataToLocal('token', token, () => {
					saveDataToLocal('uid', uid, () => {
						navigationUtil.reset(this.props.navigation, 'main');
					});
				});
			}).catch(err => {
				toast(err);
			});
		});
	}

	onNavigateToRegister() {
		const {navigate} = this.props.navigation;
		navigate({
			routeName: 'RegisterScene',
		});
	}

	render() {
		const {
			phone,
			code,
			invitationCode,
			protocolChecked,
			cd,
		} = this.state;
		return (
			<TouchableWithoutFeedback style={styles.container} onPress={dismissKeyboard}>
				<View style={styles.container}>
					<Image style={styles.bigIcon} source={require('../../imgs/icon.png')} />
					<View style={[styles.inputContainer, { marginTop: toDips(85) }]}>
						<Image
							style={{
								width: toDips(29),
								height: toDips(46),
								marginLeft: toDips(80),
								marginRight: toDips(22),
							}}
							source={require('../../imgs/icon61.png')}
						/>
						<TextInput
							onChangeText={phone => {
								this.onPhoneChange(phone);
							}}
							value={phone}
							placeholder='请输入手机号'
							placeholderTextColor='#999999'
							style={styles.input}
							maxLength={11}
							keyboardType='numeric'
						/>
					</View>
					<View style={styles.line} />
					<View style={[styles.inputContainer, { marginTop: toDips(44) }]}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								flex: 1,
							}}
						>
							<Image
								style={{
									width: toDips(39),
									height: toDips(47),
									marginLeft: toDips(75),
									marginRight: toDips(16),
								}}
								source={require('../../imgs/icon63.png')}
							/>
							<TextInput
								onChangeText={code => {
									this.onCodeChange(code);
								}}
								value={code}
								placeholder='请输入验证码'
								placeholderTextColor='#999999'
								style={styles.input}
								maxLength={6}
								keyboardType='numeric'
							/>
						</View>
						<Text style={styles.codeBtnTxt} onPress={() => { this.onGetLoginCode(); }}>
							{ cd > 0 ? `${cd}s` : '发送验证码' }
						</Text>	
					</View>
					<View style={styles.line} />
					{
						// 登录按钮
					}
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							this.onLogin();
						}}
						style={styles.loginBtn}
					>
						<Text style={styles.loginBtnTxt}>
							登录
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							this.onNavigateToRegister();
						}}
						style={styles.registerBtbContainer}
					>
						<Text style={styles.registerBtn}>
							去注册
						</Text>
						<Image style={styles.arrowImg} source={require('../../imgs/back.png')} />
					</TouchableOpacity>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FBFBFB',
	},
	bigIcon: {
		width: toDips(164),
		height: toDips(164),
		alignSelf: 'center',
		marginTop: toDips(208),
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	input: {
		fontSize: getFontSize(32),
		color: '#666',
		width: toDips(360),
	},
	line: {
		width: toDips(600),
		height: toDips(2),
		alignSelf: 'center',
		marginTop: toDips(26),
		backgroundColor: '#DFDFDF',
	},
	codeBtnTxt: {
		fontSize: getFontSize(32),
		color: '#DD4124',
		marginRight: toDips(75),
	},
	loginBtn: {
		width: toDips(391),
		height: toDips(82),
		backgroundColor: '#DD4124',
		borderRadius: toDips(41),
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		marginTop: toDips(84),
	},
	loginBtnTxt: {
		fontSize: getFontSize(32),
		// fontWeight: '500',
		color: 'white',
	},
	registerBtbContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginTop: toDips(218),
	},
	registerBtn: {
		fontSize: getFontSize(30),
		color: '#999',
		textDecorationLine: 'underline',
	},
	arrowImg: {
		width: toDips(13),
		height: toDips(23),
		marginLeft: toDips(6),
		marginRight: toDips(82),
	},
});
