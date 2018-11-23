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
	findNodeHandle,
	Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AutoHideKeyboard from '../../component/AutoHideKeyboard';
import Spinner from '../../component/Spinner';
import { toDips, getFontSize } from '../../utils/dimensions';
import * as qiniu from '../../utils/qiniu';
import { QI_NIU_DOMAIN, __TEST__ } from '../../config';
import { getMissionInfo, updateMission } from '../../service';
import toast from '../../utils/toast';

class MissionDetail extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '任务详情',
	});

	constructor(props) {
		super(props);
		this.state = {
			missionInfo: null,
			img1: '',
			img2: '',
			img3: '',
			img4: '',
			skuDataArr: [],
			showSpinner: false,
		};
	}

	componentDidMount() {
		const { taskId } = this.props.navigation.state.params;
		getMissionInfo(taskId).then(result => {
			// let img1 = __TEST__ ? 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542974794639&di=6078b02f950776bd7e0db9b21e237966&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F8%2F5121d1d75db08.jpg' : '';
			// let img2 = __TEST__ ? 'https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1542964770&di=4efc120002d666c14f5c32e2f1de31f3&src=http://img4q.duitang.com/uploads/item/201207/03/20120703151527_23RQB.thumb.700_0.jpeg' : '';
			// let img3 = __TEST__ ? 'https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1542964770&di=5fe709d61b55cef89b58ae782b99e66b&src=http://img.mp.itc.cn/upload/20160321/c40e1ef85ec44540ac5a2eeed9d12cf8_th.jpg' : '';
			// let img4 = __TEST__ ? 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1510874208,1865362337&fm=11&gp=0.jpg' : '';
			let img1 = '';
			let img2 = '';
			let img3 = '';
			let img4 = '';
			if (result.datas.skus[0]) {
				if (Array.isArray(result.datas.skus[0].feedDatas)) {
					for (let i= 0; i < result.datas.skus[0].feedDatas.length; i++) {
						if (result.datas.skus[0].feedDatas[i].dataCode === 'beforeTally') {
							img1 = result.datas.skus[0].feedDatas[i].dataContent;
						} else if (result.datas.skus[0].feedDatas[i].dataCode === 'beforeTallyLeft') {
							img2 = result.datas.skus[0].feedDatas[i].dataContent;
						} else if (result.datas.skus[0].feedDatas[i].dataCode === 'afterTally') {
							img3 = result.datas.skus[0].feedDatas[i].dataContent;
						} else if (result.datas.skus[0].feedDatas[i].dataCode === 'afterTallyLeft') {
							img4 = result.datas.skus[0].feedDatas[i].dataContent;
						}
					}
				}
			}
			this.setState({
				missionInfo: result.datas,
				skuDataArr: result.datas.skus.map(sku => {
					let skuNum = 0;
					for (let i = 0; i < sku.feedDatas.length; i++) {
						if (sku.feedDatas[i].dataType === sku.skuId) {
							skuNum = parseInt(sku.feedDatas[i].dataContent, 10);
							break;
						}
					}
					return {
						skuId: sku.skuId,
						skuNum,
					};
				}),
				img1,
				img2,
				img3,
				img4,
			});
		}).catch(e => {
			toast(e);
		});
	}

	async uploadImg(uri) {
		let data = null;
		try {
			data =  await qiniu.upload(uri, `${global.uid}_${new Date().getTime()}.jpg`);
		} catch (err) {
			toast('上传照片失败，请重试');
			return false;
		}
		return `${QI_NIU_DOMAIN}/${data.key}?imageView2/2/w/600/h/400`;
	}

	onPickImage(type) {
		// type 1 是理货前的正面照 2 是理货前的左侧照 3 是理货后的正面照 4 是理货后的左侧照
		ImagePicker.launchCamera({
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
					[`img${type}`]: response.uri,
				});
			}
		});
	}

	scrollToInput(reactNode) {
		this.scroll.props.scrollToFocusedInput(reactNode);
	}

	onSkuNumChange(skuId, num) {
		const skuDataArr = [...this.state.skuDataArr];
		for (let i = 0; i < skuDataArr.length; i++) {
			if (skuDataArr[i].skuId === skuId) {
				skuDataArr[i].skuNum = num === '' ? 0 : (isNaN(num) ? skuDataArr[i].skuNum : parseInt(num));
				break;
			}
		}
		this.setState({
			skuDataArr,
		});
	}

	onSubmit() {
		const {
			skuDataArr,
		} = this.state;
		const { taskId } = this.props.navigation.state.params;
		let {
			img1,
			img2,
			img3,
			img4,
		} = this.state;
		if (!img1) {
			toast('请选择理货前正面照');
			return;
		}
		if (!img2) {
			toast('请选择理货前左侧照');
			return;
		}
		if (!img3) {
			toast('请选择理货后正面照');
			return;
		}
		if (!img4) {
			toast('请选择理货后左侧照');
			return;
		}
		Alert.alert(
			'提示',
			'是否确认提交',
			[
				{ text: '否', onPress: () => {}, style: 'cancel'},
				{ text: '是', onPress: () => {
					this.setState({
						showSpinner: true,
					}, async () => {
						if (!img1.startsWith('http')) {
							img1 = await this.uploadImg(img1);
						}
						if (!img2.startsWith('http')) {
							img2 = await this.uploadImg(img2);
						}
						if (!img3.startsWith('http')) {
							img3 = await this.uploadImg(img3);
						}
						if (!img4.startsWith('http')) {
							img4 = await this.uploadImg(img4);
						}
						updateMission(taskId, img1, img2, img3, img4, JSON.stringify(skuDataArr)).then(result => {
							toast('提交成功');
							this.setState({
								showSpinner: false,
							});
						}).catch(e => {
							toast(e);
							this.setState({
								showSpinner: false,
							});
						});
					});			
				} },
			],
			{ cancelable: false }
		);
	}

	render() {
		const {
			img1,
			img2,
			img3,
			img4,
			missionInfo,
			skuDataArr,
			showSpinner,
		} = this.state;
		return (
			<View style={styles.container}>
				<KeyboardAwareScrollView innerRef={ref => {this.scroll = ref;}} enableOnAndroid>
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
								this.onPickImage(1);
							}}
							style={styles.addPhoneBtn}
						>
							{
								img1 ? (
									<Image style={styles.addPhoneImg} source={{ uri: img1 }} />
								) : (
									<Image style={styles.addPhoneImg} source={require('../../imgs/jia.png')} />
								)
							}
						</TouchableOpacity>
					</View>
					<View style={styles.phoneItemContainer}>
						<View style={styles.phoneItemLeftContainer}>
							<View style={styles.phoneItemIndexContainer}>
								<Text style={styles.phoneItemIndexTxt}>
									2
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
								this.onPickImage(2);
							}}
							style={styles.addPhoneBtn}
						>
							{
								img2 ? (
									<Image style={styles.addPhoneImg} source={{ uri: img2 }} />
								) : (
									<Image style={styles.addPhoneImg} source={require('../../imgs/jia.png')} />
								)
							}
						</TouchableOpacity>
					</View>
					<View style={styles.phoneItemContainer}>
						<View style={styles.phoneItemLeftContainer}>
							<View style={styles.phoneItemIndexContainer}>
								<Text style={styles.phoneItemIndexTxt}>
									3
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
								this.onPickImage(3);
							}}
							style={styles.addPhoneBtn}
						>
							{
								img3 ? (
									<Image style={styles.addPhoneImg} source={{ uri: img3 }} />
								) : (
									<Image style={styles.addPhoneImg} source={require('../../imgs/jia.png')} />
								)
							}
						</TouchableOpacity>
					</View>
					<View style={[styles.phoneItemContainer, styles.lastPhoneItemContainer]}>
						<View style={styles.phoneItemLeftContainer}>
							<View style={styles.phoneItemIndexContainer}>
								<Text style={styles.phoneItemIndexTxt}>
									4
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
								this.onPickImage(4);
							}}
							style={styles.addPhoneBtn}
						>
							{
								img4 ? (
									<Image style={styles.addPhoneImg} source={{ uri: img4 }} />
								) : (
									<Image style={styles.addPhoneImg} source={require('../../imgs/jia.png')} />
								)
							}
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
					{
						missionInfo && missionInfo.skus.map((sku, i) => (
							<View key={i} style={[styles.dataContainer, i === missionInfo.skus.length - 1 ? styles.lastDataContainer : null]}>
								<Text style={styles.dataTxt}>
									{ sku.skuName }
								</Text>
								<View style={styles.dataInputContainer}>
									<TextInput
										keyboardType='numeric'
										onChangeText={text => {
											this.onSkuNumChange(sku.skuId, text);
										}}
										placeholder='请输入补货量'
										placeholderTextColor='#999'
										style={styles.input}
										onFocus={(event: Event) => {
											// `bind` the function if you're using ES6 classes
											this.scrollToInput(findNodeHandle(event.target));
										}}
										value={skuDataArr.filter(item => item.skuId === sku.skuId )[0].skuNum.toString()}
									/>
								</View>
							</View>
						))
					}
					{
						// 提交按钮
					}
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							this.onSubmit();
						}}
						style={styles.submitBtn}
					>
						<Text style={styles.submitBtnTxt}>
							{
								(missionInfo && missionInfo.tallyStatus) === 1 ? '再次提交' : '提交'
							}
						</Text>	
					</TouchableOpacity>
				</KeyboardAwareScrollView>
				{
					showSpinner && <Spinner />
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
		width: toDips(160),
	},
	dataInputContainer: {
		width: toDips(434),
		height: toDips(70),
		borderColor: '#DCDCDC',
		borderWidth: 1,
		borderRadius: toDips(9),
		marginLeft: toDips(50),
	},
	input: {
		width: toDips(400),
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
		marginBottom: toDips(126),
	},
	submitBtnTxt: {
		fontSize: getFontSize(32),
		// fontWeight: '500',
		color: 'white',
	},
});

export default AutoHideKeyboard(MissionDetail);
