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

export default class LoginScene extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '登录',
	});

	constructor(props) {
		super(props);
		this.state = {
			phone: '',
			code: '',
		};
	}

	onPhoneChanged(phone) {
		this.setState({ phone });
	}

	onCodeChanged(code) {
		this.setState({ code });
	}

	render() {
		const {
			phone,
			code,
		} = this.state;
		return (
			<View style={styles.container}>
				<View style={styles.inputContainer}>
					<Image style={styles.icon} source={require('../../imgs/sj.png')} />
					<TextInput
						onChangeText={phone => {
							this.onPhoneChanged(phone);
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
								this.onCodeChanged(code);
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
				{
					// 登录按钮
				}
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {

					}}
					style={styles.loginBtn}
				>
					<Text style={styles.loginBtnTxt}>
						登录
					</Text>
				</TouchableOpacity>
				{
					// 忘记密码和注册
				}
				<View style={styles.functionsContainer}>
					<Text style={styles.functionTxt}>
						忘记密码
					</Text>
					<View style={styles.functionLine} />
					<Text style={styles.functionTxt}>
						马上注册
					</Text>
				</View>
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
	input: {
		marginLeft: toDips(10),
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
		fontWeight: '500',
		color: '#60C766',
	},
	loginBtn: {
		width: toDips(391),
		height: toDips(82),
		backgroundColor: '#DD4124',
		borderRadius: toDips(41),
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		marginTop: toDips(115),
	},
	loginBtnTxt: {
		fontSize: getFontSize(32),
		fontWeight: '500',
		color: 'white',
	},
	functionsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		marginTop: toDips(56),
	},
	functionTxt: {
		fontSize: getFontSize(30),
		fontWeight: '500',
		color: '#A6A6A6',
	},
	functionLine: {
		width: toDips(2),
		height: toDips(28),
		backgroundColor: '#BEBEBE',
		marginLeft: toDips(24),
		marginRight: toDips(24),
	},
});
