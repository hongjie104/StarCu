'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	TextInput,
	findNodeHandle,
} from 'react-native';

import picker from 'react-native-picker';
import ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { toDips, getFontSize } from '../../utils/dimensions';

export default class MissionFeedback extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '任务反馈',
	});

	constructor(props) {
		super(props);

		this.state = {
			fenXiao: '有',
			zhuangTai: '正常',
			price: '',
			mianShu: '',
			year: 2019,
			month: 1,
			date: 1,
			huoDong: '无',
			xiaoLiang: '',
			kuCun: '',
			posImg: '',
			huoDongContent: '',
		};
	}

	componentWillUnmount() {
		picker.hide();
	}

	// 初始化分销的picker
	initFenXiaoPicker() {
		picker.init({
			selectedValue: [this.state.fenXiao],
			pickerData: ['有', '无'],
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '有无分销',
			pickerBg: [255, 255, 255, 1],
			onPickerConfirm: pickedValue => {
				this.setState({
					fenXiao: pickedValue[0],
				});
			},
		});
	}

	// 初始化商品状态的picker
	initZhuangTaiPicker() {
		picker.init({
			selectedValue: [this.state.fenXiao],
			pickerData: ['正常', '不正常'],
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '商品状态',
			pickerBg: [255, 255, 255, 1],
			onPickerConfirm: pickedValue => {
				this.setState({
					zhuangTai: pickedValue[0],
				});
			},
		});
	}

	_createDateData() {
		const now = new Date();
		const date = [];
		for (let i = now.getFullYear() - 2; i <= now.getFullYear(); i++) {
			const month = [];
			for (let j = 1; j < 13; j++) {
				const day = [];
				if (j === 2) {
					for (let k = 1; k < 29; k++) {
						day.push(k);
					}
					// Leap day for years that are divisible by 4, such as 2000, 2004
					if (i % 4 === 0) {
						day.push(29);
					}
				}
				else if (j in { 1: 1, 3: 1, 5: 1, 7: 1, 8: 1, 10: 1, 12: 1 }){
					for (let k = 1; k < 32; k++) {
						day.push(k);
					}
				} else {
					for (let k = 1; k < 31; k++) {
						day.push(k);
					}
				}
				const _month = {};
				_month[j] = day;
				month.push(_month);
			}
			const _date = {};
			_date[i] = month;
			date.push(_date);
		}
		return date;
	}

	initDatePicker() {
		const { year, month, date } = this.state;
		picker.init({
			selectedValue: [year, month, date],
			pickerData: this._createDateData(),
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '最早生产日期',
			pickerBg: [255, 255, 255, 1],
			onPickerConfirm: pickedValue => {
				this.setState({
					year: parseInt(pickedValue[0]),
					month: parseInt(pickedValue[1]),
					date: parseInt(pickedValue[2]),
				});
			},
		});
	}

	initHuoDongPicker() {
		picker.init({
			selectedValue: [this.state.huoDong],
			pickerData: ['无', '买赠'],
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '促销活动信息',
			pickerBg: [255, 255, 255, 1],
			onPickerConfirm: pickedValue => {
				this.setState({
					huoDong: pickedValue[0],
				});
			},
		});
	}

	showImagePicker() {
		ImagePicker.showImagePicker({
			title: '挑选POS数据照片',
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
					posImg: response.uri,
				});
			}
		});
	}

	scrollToInput(reactNode) {
		this.scroll.props.scrollToFocusedInput(reactNode);
	}

	render() {
		// const { navigate, goBack } = this.props.navigation;
		const {
			fenXiao,
			zhuangTai,
			price,
			mianShu,
			year,
			month,
			date,
			huoDong,
			xiaoLiang,
			kuCun,
			posImg,
			huoDongContent,
		} = this.state;
		return (
			<View style={styles.container}>
				<KeyboardAwareScrollView innerRef={ref => {this.scroll = ref;}} enableOnAndroid style={styles.container}>
					<TouchableOpacity activeOpacity={1}>
						<View style={styles.titleContainer}>
							<View style={styles.titleIcon} />
							<Text style={styles.title}>
								商品名称：产品名称1
							</Text>
						</View>
						<View style={styles.rowContainer}>
							<Text style={styles.key}>
								有无分销
							</Text>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									this.initFenXiaoPicker();
									picker.show();
								}}
								style={styles.valContainer}
							>
								<Text style={styles.val}>
									{ fenXiao }
								</Text>
								<Image style={styles.arrowImg} source={require('../../imgs/back.png')} />
							</TouchableOpacity>
						</View>
						<View style={styles.rowContainer}>
							<Text style={styles.key}>
								商品状态
							</Text>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									this.initZhuangTaiPicker();
									picker.show();
								}}
								style={styles.valContainer}
							>
								<Text style={styles.val}>
									{ zhuangTai }
								</Text>
								<Image style={styles.arrowImg} source={require('../../imgs/back.png')} />
							</TouchableOpacity>
						</View>
						<View style={styles.rowContainer}>
							<Text style={styles.key}>
								商品价格(元）
							</Text>
							<View style={styles.valContainer}>
								<TextInput
									onChangeText={priceTxt => {
										this.setState({
											price: priceTxt,
										});
									}}
									onFocus={(event: Event) => {
										this.scrollToInput(findNodeHandle(event.target));
									}}
									value={price}
									placeholder='请输入商品价格'
									placeholderTextColor='#999999'
									style={styles.input}
									maxLength={20}
									keyboardType='numeric'
								/>
							</View>
						</View>
						<View style={styles.rowContainer}>
							<Text style={styles.key}>
								陈列面数(个）
							</Text>
							<View style={styles.valContainer}>
								<TextInput
									onChangeText={txt => {
										this.setState({
											mianShu: txt,
										});
									}}
									onFocus={(event: Event) => {
										this.scrollToInput(findNodeHandle(event.target));
									}}
									value={mianShu}
									placeholder='请输入陈列面数'
									placeholderTextColor='#999999'
									style={styles.input}
									maxLength={20}
									keyboardType='numeric'
								/>
							</View>
						</View>
						<View style={styles.rowContainer}>
							<Text style={styles.key}>
								最早生产日期
							</Text>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									this.initDatePicker();
									picker.show();
								}}
								style={styles.valContainer}
							>
								<Text style={styles.val}>
									{ year }-{ month < 10 ? `0${month}` : month }-{ date < 10 ? `0${date}` : date }
								</Text>
								<Image style={styles.arrowImg} source={require('../../imgs/back.png')} />
							</TouchableOpacity>
						</View>
						<View style={{ backgroundColor: 'white', }}>
							<View style={styles.rowContainer}>
								<Text style={styles.key}>
									促销活动信息
								</Text>
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {
										this.initHuoDongPicker();
										picker.show();
									}}
									style={styles.valContainer}
								>
									<Text style={styles.val}>
										{ huoDong }
									</Text>
									<Image style={styles.arrowImg} source={require('../../imgs/back.png')} />
								</TouchableOpacity>
							</View>
							{
								huoDong !== '无' && (
									<View style={styles.huoDongInputContainer}>
										<TextInput
											multiline
											onChangeText={txt => {
												this.setState({
													huoDongContent: txt,
												});
											}}
											onFocus={(event: Event) => {
												this.scrollToInput(findNodeHandle(event.target));
											}}
											value={huoDongContent}
											placeholder='请输入买赠活动内容（30字以内）'
											placeholderTextColor='#999999'
											style={[styles.input, { width: toDips(578), marginTop: toDips(30), }]}
											maxLength={30}
											keyboardType='default'
										/>
									</View>
								)
							}
						</View>
						<View style={styles.rowContainer}>
							<Text style={styles.key}>
								昨日销量（个）
							</Text>
							<View style={styles.valContainer}>
								<TextInput
									onChangeText={txt => {
										this.setState({
											xiaoLiang: txt,
										});
									}}
									onFocus={(event: Event) => {
										this.scrollToInput(findNodeHandle(event.target));
									}}
									value={xiaoLiang}
									placeholder='请输入昨日销量'
									placeholderTextColor='#999999'
									style={styles.input}
									maxLength={20}
									keyboardType='numeric'
								/>
							</View>
						</View>
						<View style={styles.rowContainer}>
							<Text style={styles.key}>
								商品库存（个）
							</Text>
							<View style={styles.valContainer}>
								<TextInput
									onChangeText={txt => {
										this.setState({
											kuCun: txt,
										});
									}}
									onFocus={(event: Event) => {
										this.scrollToInput(findNodeHandle(event.target));
									}}
									value={kuCun}
									placeholder='请输入商品库存'
									placeholderTextColor='#999999'
									style={styles.input}
									maxLength={20}
									keyboardType='numeric'
								/>
							</View>
						</View>
						<View style={styles.photoContainer}>
							<View>
								<Text style={[styles.key, styles.photoTxt]}>
									POS数据照片
								</Text>
								<Text style={[styles.key, { color: '#999' }]}>
									(非必填）
								</Text>
							</View>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									this.showImagePicker();
								}}
								style={styles.photoCell}
							>
								<Image
									style={posImg ? styles.imgPos : styles.img10}
									source={posImg ? { uri: posImg } : require('../../imgs/10.png')}
								/>
							</TouchableOpacity>
						</View>
					</TouchableOpacity>
				</KeyboardAwareScrollView>
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
		height: toDips(125),
		alignItems: 'center',
		flexDirection: 'row',
	},
	titleIcon: {
		width: toDips(6),
		height: toDips(31),
		backgroundColor: 'rgba(221,65,36,1)',
		borderRadius: toDips(3),
		marginLeft: toDips(52),
	},
	title: {
		fontSize: getFontSize(32),
		color: 'rgba(58,58,58,1)',
		marginLeft: toDips(26),
	},
	rowContainer: {
		height: toDips(124),
		borderTopWidth: toDips(1),
		borderColor: 'rgb(220, 220, 220)',
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
	},
	key: {
		fontSize: getFontSize(30),
		color: '#3A3A3A',
		marginLeft: toDips(42),
	},
	valContainer: {
		width: toDips(436),
		height: toDips(70),
		backgroundColor: '#FBFBFB',
		borderRadius: toDips(9),
		borderColor: '#DCDCDC',
		borderWidth: toDips(1),
		marginRight: toDips(42),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	val: {
		color: '#666',
		fontSize: getFontSize(30),
		marginLeft: toDips(32),
	},
	arrowImg: {
		width: toDips(13),
		height: toDips(24),
		marginRight: toDips(16),
	},
	input: {
		fontSize: getFontSize(30),
		color: '#666',
		width: toDips(360),
		marginLeft: toDips(32),
	},
	photoContainer: {
		height: toDips(266),
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: 'white',
		borderTopWidth: toDips(1),
		borderBottomWidth: toDips(1),
		borderColor: 'rgb(220, 220, 220)',
	},
	photoTxt: {
		marginTop: toDips(48),
	},
	photoCell: {
		marginTop: toDips(48),
		width: toDips(150),
		height: toDips(150),
		borderStyle: 'dotted',
		borderWidth: toDips(2),
		borderColor: '#DCDCDC',
		borderRadius: toDips(12),
		marginRight: toDips(332),
		alignItems: 'center',
		justifyContent: 'center',
	},
	img10: {
		width: toDips(72),
		height: toDips(72),
	},
	imgPos: {
		width: toDips(150),
		height: toDips(150),
		borderRadius: toDips(12),
	},
	huoDongInputContainer: {
		width: toDips(614),
		height: toDips(194),
		borderColor: '#DCDCDC',
		borderWidth: toDips(1),
		borderRadius: toDips(9),
		alignSelf: 'center',
		backgroundColor: '#FBFBFB',
		marginTop: toDips(30),
		marginBottom: toDips(48),
	},
});
