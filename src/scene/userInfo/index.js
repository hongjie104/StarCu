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

export default class UserInfoScene extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '填写个人信息',
	});

	constructor(props) {
		super(props);
		this.state = {
			realName: '',
			// 身份证号码
			idNo: '',
		};
	}

	onRealNameChange(realName) {
		this.setState({
			realName,
		});
	}

	onIdNoChange(idNo) {
		this.setState({
			idNo,
		});
	}

	render() {
		const {
			realName,
			idNo,
		} = this.state;
		return (
			<View style={styles.container}>
				<View style={styles.itemContainer}>
					<Image style={styles.icon} source={require('../../imgs/xm.png')} />
					<Text style={styles.contentTxt}>
						姓名：
					</Text>
					<TextInput
						onChangeText={realName => {
							this.onRealNameChange(realName);
						}}
						value={realName}
						placeholder='请输入真实姓名'
						placeholderTextColor='#B5B5B5'
						style={styles.input}
						maxLength={6}
					/>
				</View>
				<View style={styles.itemContainer}>
					<Image style={styles.icon} source={require('../../imgs/sfzh.png')} />
					<Text style={styles.contentTxt}>
						身份证号码：
					</Text>
					<TextInput
						onChangeText={idNo => {
							this.onIdNoChange(idNo);
						}}
						value={idNo}
						placeholder='请输入18位身份证号'
						placeholderTextColor='#B5B5B5'
						style={styles.input}
						maxLength={18}
						keyboardType='numeric'
					/>
				</View>
				<View style={[styles.itemContainer, { height: toDips(141) }]}>
					<Image style={styles.icon} source={require('../../imgs/sfzzp.png')} />
					<Text style={styles.contentTxt}>
						身份证照片：
					</Text>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {

						}}
					>
						<Image style={styles.phoneBgImg} source={require('../../imgs/jia2.png')} />
					</TouchableOpacity>
					<Text style={styles.infoTxt}>
						正面
					</Text>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {

						}}
					>
						<Image style={styles.phoneBgImg} source={require('../../imgs/jia2.png')} />
					</TouchableOpacity>
					<Text style={styles.infoTxt}>
						反面
					</Text>
				</View>
				<View style={[styles.itemContainer, { height: toDips(141) }]}>
					<Image style={styles.icon} source={require('../../imgs/zp.png')} />
					<Text style={styles.contentTxt}>
						个人照片：
					</Text>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {

						}}
					>
						<Image style={styles.phoneBgImg} source={require('../../imgs/jia2.png')} />
					</TouchableOpacity>
					<Text style={styles.infoTxt}>
						照片1
					</Text>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {

						}}
					>
						<Image style={styles.phoneBgImg} source={require('../../imgs/jia2.png')} />
					</TouchableOpacity>
					<Text style={styles.infoTxt}>
						照片2
					</Text>
				</View>
				<View style={[styles.itemContainer, { justifyContent: 'space-between' }]}>
					<View style={styles.itemLeftContainer}>
						<Image style={styles.icon} source={require('../../imgs/cs.png')} />
						<Text style={styles.contentTxt}>
							所在城市：
						</Text>
						<Text style={styles.contentTxt}>
							选择城市
						</Text>
					</View>
					<Image style={styles.arrowImg} source={require('../../imgs/jt.png')} />
				</View>
				<View style={[styles.itemContainer, { justifyContent: 'space-between' }]}>
					<View style={styles.itemLeftContainer}>
						<Image style={styles.icon} source={require('../../imgs/md.png')} />
						<Text style={styles.contentTxt}>
							绑定门店：
						</Text>
						<Text style={styles.contentTxt}>
							选择门店
						</Text>
					</View>
					<Image style={styles.arrowImg} source={require('../../imgs/jt.png')} />
				</View>
				{
					// 提交按钮
				}
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {

					}}
					style={styles.submitBtn}
				>
					<Text style={styles.submitBtnTxt}>
						提交
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
	itemContainer: {
		height: toDips(113),
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: '#DCDCDC',
		borderBottomWidth: 1,
	},
	icon: {
		width: toDips(42),
		height: toDips(42),
		marginLeft: toDips(22),
		marginRight: toDips(20),
	},
	contentTxt: {
		fontSize: getFontSize(32),
		// fontWeight: '500',
		color: '#333',
		width: toDips(225),
	},
	input: {
		fontSize: getFontSize(32),
		// fontWeight: '500',
		color: '#333',	
	},
	phoneBgImg: {
		width: toDips(86),
		height: toDips(86),
	},
	infoTxt: {
		fontSize: getFontSize(30),
		// fontWeight: '500',
		color: '#999',
		marginLeft: toDips(15),
		marginRight: toDips(50),
	},
	itemLeftContainer: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	arrowImg: {
		width: toDips(18),
		height: toDips(34),
		marginRight: toDips(40),
	},
	submitBtn: {
		width: toDips(391),
		height: toDips(82),
		backgroundColor: '#DD4124',
		borderRadius: toDips(41),
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		marginTop: toDips(88),
	},
	submitBtnTxt: {
		fontSize: getFontSize(32),
		// fontWeight: '500',
		color: 'white',
	},
});
