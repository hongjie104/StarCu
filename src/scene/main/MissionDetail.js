'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Platform,
	TouchableOpacity,
	TextInput,
} from 'react-native';
import { toDips, getFontSize } from '../../utils/dimensions';

export default class MissionDetail extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '任务详情',
	});

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		const { params: { missionId } } = this.props.navigation.state;
	}

	render() {
		// const { navigate, goBack } = this.props.navigation;
		return (
			<View style={styles.container}>
				<View style={styles.titleContainer}>
					<View style={styles.titleIcon} />
					<Text style={styles.titleTxt}>
						理货拍照
					</Text>
				</View>
				<View style={styles.phoneItemContainer}>
					<View style={styles.phoneItemLeftContainer}>
						<View style={styles.phoneItemIndexContainer}>
							<Text style={styles.phoneItemIndexTxt}>
								1
							</Text>
						</View>
						<Text style={styles.phoneItemTxt}>
							理货前牌面（正面）
						</Text>
					</View>
					{
						// 虚线框
					}
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {

						}}
						style={styles.addPhoneBtn}
					>
						<Image style={styles.addPhoneImg} source={require('../../imgs/jia.png')} />
					</TouchableOpacity>
				</View>
				<View style={styles.phoneItemContainer}>
					<View style={styles.phoneItemLeftContainer}>
						<View style={styles.phoneItemIndexContainer}>
							<Text style={styles.phoneItemIndexTxt}>
								1
							</Text>
						</View>
						<Text style={styles.phoneItemTxt}>
							理货前牌面（左侧）
						</Text>
					</View>
					{
						// 虚线框
					}
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {

						}}
						style={styles.addPhoneBtn}
					>
						<Image style={styles.addPhoneImg} source={require('../../imgs/jia.png')} />
					</TouchableOpacity>
				</View>
				<View style={styles.phoneItemContainer}>
					<View style={styles.phoneItemLeftContainer}>
						<View style={styles.phoneItemIndexContainer}>
							<Text style={styles.phoneItemIndexTxt}>
								1
							</Text>
						</View>
						<Text style={styles.phoneItemTxt}>
							理货后牌面（正面）
						</Text>
					</View>
					{
						// 虚线框
					}
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {

						}}
						style={styles.addPhoneBtn}
					>
						<Image style={styles.addPhoneImg} source={require('../../imgs/jia.png')} />
					</TouchableOpacity>
				</View>
				<View style={[styles.phoneItemContainer, styles.lastPhoneItemContainer]}>
					<View style={styles.phoneItemLeftContainer}>
						<View style={styles.phoneItemIndexContainer}>
							<Text style={styles.phoneItemIndexTxt}>
								1
							</Text>
						</View>
						<Text style={styles.phoneItemTxt}>
							理货后牌面（左侧）
						</Text>
					</View>
					{
						// 虚线框
					}
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {

						}}
						style={styles.addPhoneBtn}
					>
						<Image style={styles.addPhoneImg} source={require('../../imgs/jia.png')} />
					</TouchableOpacity>
				</View>
				{
					// 补货数据汇报
				}
				<View style={styles.titleContainer}>
					<View style={styles.titleIcon} />
					<Text style={styles.titleTxt}>
						补货数据汇报
					</Text>
				</View>
				<View style={styles.dataContainer}>
					<Text style={styles.dataTxt}>
						SKU1
					</Text>
					<View style={styles.dataInputContainer}>
						<TextInput
							keyboardType='numeric'
							onChange={() => {}}
							placeholder='请输入补货量'
							placeholderTextColor='#999'
							style={styles.input}
						/>
					</View>
				</View>
				<View style={[styles.dataContainer, styles.lastDataContainer]}>
					<Text style={styles.dataTxt}>
						SKU2
					</Text>
					<View style={styles.dataInputContainer}>
						<TextInput
							keyboardType='numeric'
							onChange={() => {}}
							placeholder='请输入补货量'
							placeholderTextColor='#999'
							style={styles.input}
						/>
					</View>
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
	titleContainer: {
		flexDirection: 'row',
		height: toDips(87),
		alignItems: 'center',
	},
	titleIcon: {
		width: toDips(6),
		height: toDips(31),
		backgroundColor: '#DD4124',
		borderRadius: toDips(3),
		marginLeft: toDips(19),
	},
	titleTxt: {
		fontSize: getFontSize(30),
		// fontWeight: '500',
		color: '#3A3A3A',
		marginLeft: toDips(12),
	},
	phoneItemContainer: {
		height: toDips(124),
		backgroundColor: 'white',
		borderColor: '#DCDCDC',
		borderTopWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	lastPhoneItemContainer: {
		borderBottomWidth: 1,
	},
	phoneItemLeftContainer: {
		flexDirection: 'row',
	},
	phoneItemIndexContainer: {
		width: toDips(35),
		height: toDips(35),
		borderColor: '#60C766',
		borderWidth: toDips(2),
		borderRadius: toDips(17.5),
		marginLeft: toDips(26),
		alignItems: 'center',
	},
	phoneItemIndexTxt: {
		fontSize: getFontSize(30),
		// fontWeight: '500',
		color: '#60C766',
		textAlign: 'center',
		includeFontPadding: false,
		textAlignVertical: 'center',
		marginTop: Platform.select({
			ios: toDips(-5),
			android: 0,
		}),
	},
	phoneItemTxt: {
		fontSize: getFontSize(30),
		// fontWeight: '500',
		color: '#3A3A3A',
		marginLeft: toDips(22),
	},
	addPhoneBtn: {
		marginRight: toDips(28),
	},
	addPhoneImg: {
		width: toDips(85),
		height: toDips(87),
	},
	dataContainer: {
		height: toDips(124),
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: '#DCDCDC',
		borderTopWidth: 1,
	},
	lastDataContainer: {
		borderBottomWidth: 1,
	},
	dataTxt: {
		fontSize: getFontSize(30),
		// fontWeight: '500',
		color: '#333',
		marginLeft: toDips(37),
	},
	dataInputContainer: {
		width: toDips(534),
		height: toDips(70),
		borderColor: '#DCDCDC',
		borderWidth: 1,
		borderRadius: toDips(9),
		marginLeft: toDips(50),
	},
	input: {
		width: toDips(500),
		height: toDips(70),
		marginLeft: toDips(26),
	},
	submitBtn: {
		alignSelf: 'center',
		width: toDips(391),
		height: toDips(82),
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#DD4124',
		borderRadius: toDips(41),
		marginTop: toDips(77),
	},
	submitBtnTxt: {
		fontSize: getFontSize(32),
		// fontWeight: '500',
		color: 'white',
	},
});
