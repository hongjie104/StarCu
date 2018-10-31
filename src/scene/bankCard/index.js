'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { toDips, getFontSize } from '../../utils/dimensions';

// 银行卡
export default class BankCard extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '银行卡',
	});

	constructor(props) {
		super(props);
		this.state = {
			protocolChecked: true,
			cardImage1: '',
			cardImage2: '',
		};
	}

	onPickImage(type) {
		// type 1 是正面照 2 是反面照
		ImagePicker.showImagePicker({
			title: '挑选照片',
			cancelButtonTitle: '取消',
			takePhotoButtonTitle: '拍照',
			chooseFromLibraryButtonTitle: '从相册选',
			storageOptions: {
				skipBackup: true,
				path: 'images',
			},
		}, (response) => {
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			} else {
				// You can also display the image using data:
				// const source = { uri: 'data:image/jpeg;base64,' + response.data };
				const source = { uri: response.uri };
				this.setState({
					[`cardImage${type}`]: response.uri,
				});
			}
		});
	}

	render() {
		const { protocolChecked, cardImage1, cardImage2 } = this.state;
		return (
			<View style={styles.container}>
				<View style={styles.itemContainer}>
					<Text style={styles.keyTxt}>
						持卡人姓名：
					</Text>
					<Text style={styles.valTxt}>
						李三
					</Text>
				</View>
				<View style={styles.itemContainer}>
					<Text style={styles.keyTxt}>
						持卡人电话：
					</Text>
					<Text style={styles.valTxt}>
						18523632019
					</Text>
				</View>
				<View style={styles.itemContainer}>
					<Text style={styles.keyTxt}>
						银行卡号：
					</Text>
					<Text style={styles.valTxt}>
						6214 4512 1102 0124 021
					</Text>
				</View>
				<View style={styles.itemContainer}>
					<Text style={styles.keyTxt}>
						开户行：
					</Text>
					<Text style={styles.valTxt}>
						招商银行
					</Text>
				</View>
				<View style={[styles.itemContainer, { height: toDips(141) }]}>
					<Text style={styles.keyTxt}>
						银行卡照片：
					</Text>
					{
						// 正面照
					}
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							this.onPickImage(1);
						}}
					>
						{
							cardImage1 ? (
								<Image style={styles.phoneBgImg} source={{ uri: cardImage1 }} />
							) : (
								<Image style={styles.phoneBgImg} source={require('../../imgs/jia2.png')} />
							)
						}
					</TouchableOpacity>
					<Text style={[styles.valTxt, { marginLeft: toDips(15), marginRight: toDips(49) }]}>
						正面
					</Text>
					{
						// 反面照
					}
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							this.onPickImage(2);
						}}
					>
						{
							cardImage2 ? (
								<Image style={styles.phoneBgImg} source={{ uri: cardImage2 }} />
							) : (
								<Image style={styles.phoneBgImg} source={require('../../imgs/jia2.png')} />
							)
						}
					</TouchableOpacity>
					<Text style={[styles.valTxt, { marginLeft: toDips(15) }]}>
						反面
					</Text>
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
						本人声明确认使用此银行卡进行此账户费用提现
					</Text>
				</View>
				{
					// 保存按钮
				}
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {

					}}
					style={styles.saveBtn}
				>
					<Text style={styles.saveBtnTxt}>
						保存
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
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		height: toDips(113),
		borderColor: '#DCDCDC',
		borderBottomWidth: 1,
	},
	keyTxt: {
		width: toDips(230),
		fontSize: getFontSize(30),
		// fontWeight: '500',
		color: '#333',
		marginLeft: toDips(32),
	},
	valTxt: {
		fontSize: getFontSize(30),
		// fontWeight: '500',
		color: '#666',
	},
	phoneBgImg: {
		width: toDips(86),
		height: toDips(86),
	},
	protocolContainer: {
		flexDirection: 'row',
		alignSelf: 'center',
		marginTop: toDips(48),
		justifyContent: 'center',
		alignItems: 'center',
	},
	checkBoxImg: {
		width: toDips(38),
		height: toDips(38),
	},
	protocolTxt: {
		fontSize: getFontSize(24),
		// fontWeight: '500',
		color: '#9B9B9B',
		marginLeft: toDips(25),
	},
	saveBtn: {
		width: toDips(391),
		height: toDips(82),
		borderRadius: toDips(41),
		backgroundColor: '#DD4124',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: toDips(80),
		alignSelf: 'center',
	},
	saveBtnTxt: {
		fontSize: getFontSize(32),
		// fontWeight: '500',
		color: 'white',
	},
});
