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

export default class RegisterScene extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '注册',
	});

	constructor(props) {
		super(props);
		this.state = {
			phone: '',
			code: '',
			// 邀请码
			inviteCode: '',
			protocolChecked: true,
		};
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

	onInviteCodeChange(inviteCode) {
		this.setState({
			inviteCode,
		});
	}

	onRegister() {
		navigationUtil.reset(this.props.navigation, 'main');
	}

	render() {
		const {
			phone,
			code,
			inviteCode,
			protocolChecked,
		} = this.state;
		return (
			<View style={styles.container}>
				<View style={styles.inputContainer}>
					<Image style={styles.icon} source={require('../../imgs/sj.png')} />
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
				<View style={[styles.inputContainer, styles.inputCodeContainer]}>
					<View style={styles.inputCodeLeftContainer}>
						<Image style={styles.icon} source={require('../../imgs/yzm.png')} />
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
					<View style={styles.inputCodeRightContainer}>
						<View style={styles.inputCodeLine} />
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => {

							}}
							style={styles.codeBtn}
						>
							<Text style={styles.codeBtnTxt}>
								发送验证码
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={[styles.inputContainer, styles.inputInviteCodeContainer]}>
					<Image style={styles.icon} source={require('../../imgs/yqm.png')} />
					<Text style={styles.keyTxt}>
						邀请码：
					</Text>
					<TextInput
						onChangeText={inviteCode => {
							this.onInviteCodeChange(inviteCode);
						}}
						value={inviteCode}
						placeholder='请输入邀请码'
						placeholderTextColor='#999999'
						style={styles.input}
						maxLength={6}
						keyboardType='numeric'
					/>
				</View>
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
	inputContainer: {
		width: toDips(750),
		height: toDips(117),
		backgroundColor: 'white',
		borderColor: '#E9E9E9',
		borderTopWidth: toDips(1),
		borderBottomWidth: toDips(1),
		marginTop: toDips(85),
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		width: toDips(48),
		height: toDips(48),
		marginLeft: toDips(20),
	},
	keyTxt: {
		fontSize: getFontSize(32),
		// fontWeight: '500',
		color: '#333',
		marginLeft: toDips(23),
	},
	input: {
		marginLeft: toDips(23),
		width: toDips(360),
		fontSize: getFontSize(32),
	},
	inputCodeContainer: {
		marginTop: 0,
		borderTopWidth: 0,
		justifyContent: 'space-between',
	},
	inputCodeLeftContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	inputCodeRightContainer: {
		flexDirection: 'row',
	},
	inputCodeLine: {
		width: toDips(2),
		height: toDips(61),
		backgroundColor: '#60C766',
	},
	codeBtn: {
		width: toDips(256),
		justifyContent: 'center',
		alignItems: 'center',
	},
	codeBtnTxt: {
		fontSize: getFontSize(32),
		// fontWeight: '500',
		color: '#60C766',
	},
	inputInviteCodeContainer: {
		marginTop: 0,
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
