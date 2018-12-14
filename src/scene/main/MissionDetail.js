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
import { updateMission, getMyInfo } from '../../service';
import toast from '../../utils/toast';
import { getLocation } from '../../utils/geolocation';
import Base64 from '../../utils/Base64';
import { formatDateTime } from '../../utils/datetime';

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
		// const { taskId } = ;
		// getMissionInfo(taskId).then(result => {
		const { skus } = this.props.navigation.state.params;
			// console.warn(result);
			// let img1 = __DEV__ ? 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542974794639&di=6078b02f950776bd7e0db9b21e237966&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F8%2F5121d1d75db08.jpg' : '';
			// let img2 = __DEV__ ? 'https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1542964770&di=4efc120002d666c14f5c32e2f1de31f3&src=http://img4q.duitang.com/uploads/item/201207/03/20120703151527_23RQB.thumb.700_0.jpeg' : '';
			// let img3 = __DEV__ ? 'https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1542964770&di=5fe709d61b55cef89b58ae782b99e66b&src=http://img.mp.itc.cn/upload/20160321/c40e1ef85ec44540ac5a2eeed9d12cf8_th.jpg' : '';
			// let img4 = __DEV__ ? 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1510874208,1865362337&fm=11&gp=0.jpg' : '';
			let img1 = '';
			let img2 = '';
			let img3 = '';
			let img4 = '';
			
			// console.warn(skus);
			for (let i = 0; i < skus.length; i++) {
				if (Array.isArray(skus[i].feedDatas)) {
					const feedDatas = skus[i].feedDatas;
					for (let j= 0; j < feedDatas.length; j++) {
						if (feedDatas[j].dataCode === 'beforeTally') {
							img1 = decodeURIComponent(feedDatas[j].dataContent);
						} else if (feedDatas[j].dataCode === 'beforeTallyLeft') {
							img2 = decodeURIComponent(feedDatas[j].dataContent);
						} else if (feedDatas[j].dataCode === 'afterTally') {
							img3 = decodeURIComponent(feedDatas[j].dataContent);
						} else if (feedDatas[j].dataCode === 'afterTallyLeft') {
							img4 = decodeURIComponent(feedDatas[j].dataContent);
						}
					}
					break;
				}
			}
			this.setState({
				missionInfo: this.props.navigation.state.params,
				skuDataArr: skus.map(sku => {
					let skuNum = 0;
					if (Array.isArray(sku.feedDatas)) {
						for (let i = 0; i < sku.feedDatas.length; i++) {
							if (sku.feedDatas[i].dataCode === 'addNum') {
								skuNum = parseInt(sku.feedDatas[i].dataContent, 10);
								break;
							}
						}
					}
					return {
						outOfStockFlag: 0,
						skuId: sku.skuId,						
						skuNum,
					};
				}),
				img1,
				img2,
				img3,
				img4,
			});
		// }).catch(e => {
		// 	toast(e);
		// });
	}

	async uploadImg(uri, imgSuffix) {
		let data = null;
		try {
			data =  await qiniu.upload(uri, `${global.uid}_${new Date().getTime()}.jpg`);
		} catch (err) {
			toast('上传照片失败，请重试');
			return false;
		}
		// return `${QI_NIU_DOMAIN}/${data.key}?imageView2/2/w/600/h/400`;
		return `${QI_NIU_DOMAIN}/${data.key}${imgSuffix}`;
	}

	onPickImage(type) {
		const { missionInfo } = this.state;
		if (missionInfo.canEdit) {
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

	onSkuOutOfStockFlagChange(skuId) {
		const skuDataArr = [...this.state.skuDataArr];
		for (let i = 0; i < skuDataArr.length; i++) {
			if (skuDataArr[i].skuId === skuId) {
				skuDataArr[i].outOfStockFlag = skuDataArr[i].outOfStockFlag === 0 ? 1 : 0;
				break;
			}
		}
		this.setState({
			skuDataArr,
		});	
	}

	async createImgSuffix(storeName) {
		// 先获取地理位置
		const location = await getLocation();
		if (location) {
			const { province, city, district } = location.result.addressComponent;
			const str = Base64.encode(`${formatDateTime()} ${province} ${city} ${district} ${storeName}`).replace(/\//g, '_').replace(/\+/g, '-');
			return `?watermark/2/text/${str}/fontsize/2400/dx/10/dy/10`;
		}
		return '';
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
						const userInfo = await getMyInfo();
						const storeName = userInfo.datas.currentStoreName;

						let imgSuffix = null;
						if (!img1.startsWith('http')) {
							imgSuffix = await this.createImgSuffix(storeName);
							img1 = await this.uploadImg(img1, imgSuffix);
						}
						if (!img2.startsWith('http')) {
							if (!imgSuffix) {
								imgSuffix = await this.createImgSuffix(storeName);
							}
							img2 = await this.uploadImg(img2, imgSuffix);
						}
						if (!img3.startsWith('http')) {
							if (!imgSuffix) {
								imgSuffix = await this.createImgSuffix(storeName);
							}
							img3 = await this.uploadImg(img3, imgSuffix);
						}
						if (!img4.startsWith('http')) {
							if (!imgSuffix) {
								imgSuffix = await this.createImgSuffix(storeName);
							}
							img4 = await this.uploadImg(img4, imgSuffix);
						}
						updateMission(taskId, img1, img2, img3, img4, JSON.stringify(skuDataArr)).then(result => {
							toast('提交成功');
							this.setState({
								showSpinner: false,
							}, () => {
								const { onMissionDone } = this.props.navigation.state.params;
								onMissionDone && onMissionDone(taskId);
								this.props.navigation.goBack();
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
		const canEdit = missionInfo ? missionInfo.canEdit : false;
		let taskTime = 0;
		let nowTime = 0;
		if (missionInfo) {
			taskTime = new Date(missionInfo.taskDate).getTime();
			nowTime = new Date().getTime();
		}
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
										editable={canEdit && skuDataArr.filter(item => item.skuId === sku.skuId )[0].outOfStockFlag === 0}
										keyboardType='numeric'
										onChangeText={text => {
											this.onSkuNumChange(sku.skuId, text);
										}}
										placeholder='请输入补货量'
										placeholderTextColor='#999'
										style={styles.input}
										onFocus={(event: Event) => {
											this.scrollToInput(findNodeHandle(event.target));
										}}
										value={
											skuDataArr.filter(item => item.skuId === sku.skuId )[0].outOfStockFlag === 0 ? 
												skuDataArr.filter(item => item.skuId === sku.skuId )[0].skuNum.toString() :
												'缺货'
										}
									/>
								</View>
								<Text
									style={{ marginLeft: toDips(16), marginRight: toDips(16), }}
									onPress={() => {
										this.onSkuOutOfStockFlagChange(sku.skuId);
									}}
								>
									缺货
								</Text>
							</View>
						))
					}
					{
						// 提交按钮
					 	canEdit ? (
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
					 	) : (
					 		nowTime < taskTime ? (
					 			<View									
									style={styles.submitBtn}
								>
									<Text style={styles.submitBtnTxt}>
										未开始
									</Text>	
								</View>
				 			) : null
					 	)
					}
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
		width: toDips(384),
		height: toDips(80),
		borderColor: '#DCDCDC',
		borderWidth: 1,
		borderRadius: toDips(9),
		marginLeft: toDips(50),
	},
	input: {
		width: toDips(400),
		height: toDips(80),
		marginLeft: toDips(26),
		textAlignVertical: 'center',
		includeFontPadding: false,
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
