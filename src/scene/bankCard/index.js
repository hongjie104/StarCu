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
import ImagePicker from 'react-native-image-picker';
import picker from 'react-native-picker';
import Spinner from '../../component/Spinner';
import MyTextInput from '../../component/MyTextInput';
import { toDips, getFontSize } from '../../utils/dimensions';
import { getBank, getBankList } from '../../service';
import toast from '../../utils/toast';
import * as qiniu from '../../utils/qiniu';
import { QI_NIU_DOMAIN } from '../../config';

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
			bankName: '',
			uploading: false,
		};
	}

	async componentDidMount() {
		const bankArr = await getBankList();
		this.bankArr = bankArr.datas.bankList;
		this.initBrankPicker();

		let bankCard = await getBank();
		bankCard = bankCard.datas;
		const { cardPhoto } = bankCard;
		const cardPhotoArr = cardPhoto ? decodeURIComponent(cardPhoto).split(',') : [];
		let bankName = '点击选择';
		for (let i = 0; i < this.bankArr.length; i++) {
			if (this.bankArr[i].id === bankCard.bankName) {
				bankName = this.bankArr[i].text;
				break;
			}
		}
		this.setState({
			...bankCard,
			bankName,
			cardImage1: cardPhotoArr[0] || '',
			cardImage2: cardPhotoArr[1] || '',
		});
	}

	initBrankPicker() {
		const pickerData = this.bankArr.map(bankData => bankData.text);
		if (pickerData.length > 0) {
			picker.init({
				pickerData,
				pickerConfirmBtnText: '确定',
				pickerCancelBtnText: '取消',
				pickerTitleText: '银行选择',
				pickerBg: [255, 255, 255, 1],
				onPickerConfirm: pickedValue => {
					this.setState({
						bankName: pickedValue[0],
					});
				},
			});
			return true;
		}
		return false;
	}

	componentWillUnmount() {
		picker.hide();
	}

	async uploadImg(uri) {
		let data = null;
		try {
			data =  await qiniu.upload(uri, `${global.uid}_${new Date().getTime()}.jpg`);
		} catch (err) {
			console.warn(err);
			toast('上传照片失败，请重试');
			return false;
		}
		return `${QI_NIU_DOMAIN}/${data.key}?imageView2/2/w/600/h/400`;
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

	onCardHoldersNameChange(cardholdersName) {
		this.setState({
			cardholdersName,
		});
	}

	onCardHoldersPhoneChange(cardholdersPhone) {
		this.setState({
			cardholdersPhone,
		});
	}

	onBankCardNoChange(bankCardNo) {
		this.setState({
			bankCardNo,
		});
	}

	onBankNameChange(bankName) {
		this.setState({
			bankName,
		});
	}

	onSubmit() {
		const {
			protocolChecked,
			cardholdersName,
			cardholdersPhone,
			bankCardNo,
			bankName,
		} = this.state;
		let {
			cardImage1,
			cardImage2,
		} = this.state;
		if (!cardholdersName) {
			toast('请输入持卡人姓名');
			return;
		}
		if (!cardholdersPhone) {
			toast('请输入持卡人手机号码');
			return;
		}
		if (!bankCardNo) {
			toast('请输入银行卡号');
			return;	
		}
		if (bankName === '点击选择') {
			toast('请输入开户银行');
			return;		
		}
		if (!cardImage1) {
			toast('请选择银行卡正面照片');
			return;
		}
		if (!cardImage2) {
			toast('请选择银行卡反面照片');
			return;
		}

		this.setState({
			uploading: true,
		}, async () => {
			if (!cardImage1.startsWith('http')) {
				cardImage1 = await this.uploadImg(cardImage1);
			}
			if (!cardImage1) {
				this.setState({
					uploading: false,
				});
				return;
			}
			if (!cardImage2.startsWith('http')) {
				cardImage2 = await this.uploadImg(cardImage2);
			}
			if (!cardImage2) {
				this.setState({
					uploading: false,
				});
				return;
			}
			this.setState({
				uploading: false,
			}, () => {
				let bankId = -1;
				for (let i = 0; i < this.bankArr.length; i++) {
					if (this.bankArr[i].text === bankName) {
						bankId = this.bankArr[i].id;
						break;
					}
				}
				this.props.navigation.navigate({
					routeName: 'PhoneCheckerScene',
					params: {
						cardholdersName,
						cardholdersPhone,
						bankCardNo,
						bankName,
						bankId,
						cardPhoto: `${cardImage1},${cardImage2}`,
					},
				});
			});
		});
	}

	render() {
		const {
			protocolChecked,
			cardImage1,
			cardImage2,
			cardholdersName,
			cardholdersPhone,
			bankCardNo,
			bankName,
			uploading,
		} = this.state;
		return (
			<View style={styles.container}>
				<View style={styles.itemContainer}>
					<Text style={styles.keyTxt}>
						持卡人姓名：
					</Text>
					<TextInput
						onChangeText={cardholdersName => {
							this.onCardHoldersNameChange(cardholdersName);
						}}
						value={cardholdersName}
						placeholder='请输入持卡人姓名'
						placeholderTextColor='#B5B5B5'
						style={styles.valTxt}
						maxLength={6}
					/>
				</View>
				<View style={styles.itemContainer}>
					<Text style={styles.keyTxt}>
						持卡人电话：
					</Text>
					<TextInput
						onChangeText={cardholdersPhone => {
							this.onCardHoldersPhoneChange(cardholdersPhone);
						}}
						value={cardholdersPhone}
						placeholder='请输入持卡人手机号码'
						placeholderTextColor='#B5B5B5'
						style={styles.valTxt}
						maxLength={11}
						keyboardType='numeric'
					/>
				</View>
				<View style={styles.itemContainer}>
					<Text style={styles.keyTxt}>
						银行卡号：
					</Text>
					<TextInput
						onChangeText={bankCardNo => {
							this.onBankCardNoChange(bankCardNo);
						}}
						value={bankCardNo}
						placeholder='请输入银行卡号'
						placeholderTextColor='#B5B5B5'
						style={styles.valTxt}
						maxLength={19}
						keyboardType='numeric'
					/>
				</View>
				<View style={styles.itemContainer}>
					<Text style={styles.keyTxt}>
						开户行：
					</Text>
					{
						// <TextInput
						// 	onChangeText={bankName => {
						// 		this.onBankNameChange(bankName);
						// 	}}
						// 	value={bankName}
						// 	placeholder='请输入开户银行'
						// 	placeholderTextColor='#B5B5B5'
						// 	style={styles.valTxt}
						// />
						<Text
							style={styles.valTxt}
							onPress={() => {
								if (!picker.isPickerShow()) {
									picker.show();
								}
							}}
						>
							{ bankName }
						</Text>
					}
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
						this.onSubmit();
					}}
					style={styles.saveBtn}
				>
					<Text style={styles.saveBtnTxt}>
						保存
					</Text>
				</TouchableOpacity>
				{
					uploading && <Spinner />
				}
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
		flex: 1,
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
