'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	TextInput,
	TouchableOpacity,
} from 'react-native';
import { toDips, getFontSize } from '../../utils/dimensions';
import navigationUtil from '../../utils/navigation';
import toast from '../../utils/toast';
import { isPhone } from '../../utils/reg';
import { resiger, getReigsterCode } from '../../service';
import { saveDataToLocal } from '../../utils/storage';
import { __TEST__ } from '../../config';

export default class RegisterScene extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		header: null,
	});

	constructor(props) {
		super(props);
		this.state = {
			phone: '',
			code: '',
			// 邀请码
			invitationCode: '',
			protocolChecked: true,
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

	onInvitationCodeChange(invitationCode) {
		this.setState({
			invitationCode,
		});
	}

	onGetRegisterCode() {
		const { phone, cd, invitationCode } = this.state;
		if (cd > 0) {
			toast('验证码已发送,请稍候');
			return;
		}
		if (!isPhone(phone)) {
			toast('请输入正确的手机号码');
			return;
		}
		if (invitationCode === '') {
			toast('请输入邀请码');
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
			getReigsterCode(phone, invitationCode).then(result => {
				if (__TEST__) {
					this.setState({
						code: result.datas.code,
					});
					toast('测试环境，验证码已自动填上');
				} else {
					toast('验证码已发送');
				}
			}).catch(err => {
				console.warn(err);
				toast(err);
			});
		});
	}

	onRegister() {
		const { phone, code, invitationCode, protocolChecked } = this.state;
		if (!protocolChecked) {
			toast('请阅读并同意星促伙伴服务条款协议');
			return;
		}
		if (!isPhone(phone)) {
			toast('请输入正确的手机号码');
			return;
		}
		if (!/\d{4}/.test(code)) {
			toast('请输入正确的验证码');
			return;
		}
		saveDataToLocal('phone', phone, () => {
			resiger(phone, code, invitationCode).then(result => {
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

	render() {
		const {
			phone,
			code,
			invitationCode,
			protocolChecked,
			cd,
		} = this.state;
		return (
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
					<Text style={styles.keyTxt}>
						手机号码：
					</Text>
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
					<Text style={styles.codeBtnTxt} onPress={() => { this.onGetRegisterCode(); }}>
						{ cd > 0 ? `${cd}s` : '获取验证码' }
					</Text>	
				</View>
				<View style={styles.line} />
				<View style={[styles.inputContainer, { marginTop: toDips(47) }]}>
					<Image
						style={{
							width: toDips(41),
							height: toDips(38),
							marginLeft: toDips(74),
							marginRight: toDips(16),
						}}
						source={require('../../imgs/icon64.png')}
					/>
					<Text style={styles.keyTxt}>
						邀请码：
					</Text>
					<TextInput
						onChangeText={invitationCode => {
							this.onInvitationCodeChange(invitationCode);
						}}
						value={invitationCode}
						placeholder='请输入邀请码'
						placeholderTextColor='#999999'
						style={styles.input}
						maxLength={6}
						keyboardType='numeric'
					/>
				</View>
				<View style={styles.line} />
				{
					// 协议
				}
				<View style={styles.protocolContainer}>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							this.setState({
								protocolChecked: !protocolChecked,
							});
						}}
					>
						<Image
							style={styles.checkBoxImg}
							source={
								protocolChecked ? require('../../imgs/wgou.png') : require('../../imgs/gou.png')
							}
						/>
					</TouchableOpacity>
					<Text style={styles.protocolTxt}>
						我已阅读并同意星促伙伴 <Text style={{ color: '#2579E0' }}>服务条款协议</Text>
					</Text>
				</View>
				{
					// 注册按钮
				}
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						this.onRegister();
					}}
					style={styles.registerBtn}
				>
					<Text style={styles.registerBtnTxt}>
						注册
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
	keyTxt: {
		fontSize: getFontSize(32),
		color: '#666',
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
	protocolContainer: {
		flexDirection: 'row',
		marginTop: toDips(54),
		alignItems: 'center',
		justifyContent: 'center',
	},
	checkBoxImg: {
		width: toDips(38),
		height: toDips(38),
	},
	protocolTxt: {
		fontSize: getFontSize(28),
		// fontWeight: '500',
		color: '#9B9B9B',
		marginLeft: toDips(25),
	},
	registerBtn: {
		width: toDips(391),
		height: toDips(82),
		backgroundColor: '#DD4124',
		borderRadius: toDips(41),
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		marginTop: toDips(84),
	},
	registerBtnTxt: {
		fontSize: getFontSize(32),
		// fontWeight: '500',
		color: 'white',
	},
});
