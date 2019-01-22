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

import toast from '../../utils/toast';
import Spinner from '../../component/Spinner';
// crdPicture, specialPicture, specialDisplay, datas
import { getDataFromDic, updateMission2, getMyInfo } from '../../service';
import { toDips, getFontSize } from '../../utils/dimensions';
import * as qiniu from '../../utils/qiniu';
import { QI_NIU_DOMAIN } from '../../config';
import * as globalData from '../../globalData';
import Base64 from '../../utils/Base64';
import { formatDateTime } from '../../utils/datetime';

export default class MissionFeedback extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '任务反馈',
	});

	constructor(props) {
		super(props);

		this.state = {
			total: 0,
			curIndex: 0,
			skus: null,
			fenXiaoArr: [],
			fenXiaoNameArr: [],
			fenXiao: '有',
			zhuangTaiArr: [],
			zhuangTaiNameArr: [],
			zhuangTai: '正常',
			price: '',
			mianShu: '',
			year: 2019,
			month: 1,
			date: 1,
			huoDong: '无',
			huoDongArr: [],
			huoDongNameArr: [],
			xiaoLiang: '',
			kuCun: '',
			posImg: '',
			huoDongContent: '',
			loading: true,
		};
	}

	async componentDidMount() {
		let fenXiaoArr = await getDataFromDic('distribution');
		fenXiaoArr = fenXiaoArr.datas.items;
		const fenXiaoNameArr = fenXiaoArr.map(t => t.name);

		let zhuangTaiArr = await getDataFromDic('goods_state');
		zhuangTaiArr = zhuangTaiArr.datas.items;
		const zhuangTaiNameArr = zhuangTaiArr.map(t => t.name);

		let huoDongArr = await getDataFromDic('sales_promotion');
		huoDongArr = huoDongArr.datas.items;
		const huoDongNameArr = huoDongArr.map(t => t.name);

		const { skus } = this.props.navigation.state.params;
		const total = skus.length;
		if (!skus[0].feedDatas) {
			skus[0].feedDatas = {};
		}
		const { mfdDate } = skus[0].feedDatas;
		const mfdDateArr = mfdDate ? mfdDate.split('-') : [];
		console.warn(skus);
		const now = new Date();
		this.setState({
			curIndex: 0,
			fenXiao: skus[0].feedDatas.distributionStr || fenXiaoNameArr[0],
			fenXiaoArr,
			fenXiaoNameArr,
			zhuangTaiArr,
			zhuangTaiNameArr,
			zhuangTai: skus[0].feedDatas.goodsStateStr || zhuangTaiNameArr[0],
			total,
			skus,
			price: skus[0].feedDatas.goodsPrice || '',
			mianShu: skus[0].feedDatas.displaySurfaces || '',
			// mfdDate   最早生产日期
			year: mfdDateArr[0] ? parseInt(mfdDateArr[0]) : now.getFullYear(),
			month: mfdDateArr[1] ? parseInt(mfdDateArr[1]) : now.getMonth() + 1,
			date: mfdDateArr[2] ? parseInt(mfdDateArr[2]) : now.getDate(),
			loading: false,
			huoDongArr,
			huoDongNameArr,
			huoDong: skus[0].feedDatas.salesPromotionStr || huoDongNameArr[0],
			huoDongContent: skus[0].feedDatas.salesRemark || '',
			xiaoLiang: skus[0].feedDatas.yestodayNum || '',
			kuCun: skus[0].feedDatas.stockNum || '',
			posImg: skus[0].feedDatas.posPicture,
		});
	}

	componentWillUnmount() {
		picker.hide();
	}

	// 初始化分销的picker
	initFenXiaoPicker() {
		picker.init({
			selectedValue: [this.state.fenXiao],
			pickerData: this.state.fenXiaoNameArr,
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '有无分销',
			pickerBg: [255, 255, 255, 1],
			onPickerConfirm: pickedValue => {
				const { curIndex, fenXiaoArr } = this.state;
				const skus = [...this.state.skus];
				const a = fenXiaoArr.filter(t => t.name === pickedValue[0]);
				if (Array.isArray(a) && a[0]) {
					skus[curIndex].feedDatas.distribution = a[0].code;
					skus[curIndex].feedDatas.distributionStr = pickedValue[0];
					this.setState({
						fenXiao: pickedValue[0],
						skus,
					});
				}
			},
		});
	}

	// 初始化商品状态的picker
	initZhuangTaiPicker() {
		picker.init({
			selectedValue: [this.state.fenXiao],
			pickerData: this.state.zhuangTaiNameArr,
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '商品状态',
			pickerBg: [255, 255, 255, 1],
			onPickerConfirm: pickedValue => {
				const { curIndex, zhuangTaiArr } = this.state;
				const skus = [...this.state.skus];
				const a = zhuangTaiArr.filter(t => t.name === pickedValue[0]);
				if (Array.isArray(a) && a[0]) {
					skus[curIndex].feedDatas.goodsState = a[0].code;
					skus[curIndex].feedDatas.goodsStateStr = pickedValue[0];
					this.setState({
						zhuangTai: pickedValue[0],
						skus,
					});
				}
			},
		});
	}

	_createDateData() {
		const now = new Date();
		const nowYear = now.getFullYear();
		const nowMonth = now.getMonth() + 1;
		const nowDate = now.getDate();
		const date = [];
		for (let i = 2000; i <= nowYear; i++) {
			const month = [];
			for (let j = 1; j < 13; j++) {
				if (i === nowYear) {
					if (j > nowMonth) continue;
				}
				const day = [];
				if (j === 2) {
					for (let k = 1; k < 29; k++) {
						if (i === nowYear && j === nowMonth) {
							if (k <= nowDate) {
								day.push(k);
							}
						} else {
							day.push(k);
						}
					}
					// Leap day for years that are divisible by 4, such as 2000, 2004
					if (i % 4 === 0) {
						if (i === nowYear && j === nowMonth) {
							if (29 <= nowDate) {
								day.push(29);
							}
						} else {
							day.push(29);
						}
					}
				} else if (j in { 1: 1, 3: 1, 5: 1, 7: 1, 8: 1, 10: 1, 12: 1 }) {
					for (let k = 1; k < 32; k++) {
						if (i === nowYear && j === nowMonth) {
							if (k <= nowDate) {
								day.push(k);
							}
						} else {
							day.push(k);
						}
					}
				} else {
					for (let k = 1; k < 31; k++) {
						if (i === nowYear && j === nowMonth) {
							if (k <= nowDate) {
								day.push(k);
							}
						} else {
							day.push(k);
						}
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
				const { curIndex } = this.state;
				const skus = [...this.state.skus];
				const year = parseInt(pickedValue[0]);
				const month = parseInt(pickedValue[1]);
				const date = parseInt(pickedValue[2]);
				skus[curIndex].feedDatas.mfdDate = formatDateTime(new Date(year, month - 1, date), 'yyyy-MM-dd');
				this.setState({
					year,
					month,
					date,
					skus,
				});
			},
		});
	}

	initHuoDongPicker() {
		picker.init({
			selectedValue: [this.state.huoDong],
			pickerData: this.state.huoDongNameArr,
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '促销活动信息',
			pickerBg: [255, 255, 255, 1],
			onPickerConfirm: pickedValue => {
				const { curIndex, huoDongArr } = this.state;
				const skus = [...this.state.skus];
				const a = huoDongArr.filter(t => t.name === pickedValue[0]);
				if (Array.isArray(a) && a[0]) {
					skus[curIndex].feedDatas.salesPromotion = a[0].code;
					skus[curIndex].feedDatas.salesPromotionStr = pickedValue[0];
					this.setState({
						huoDong: pickedValue[0],
						skus,
					});
				}
			},
		});
	}

	showImagePicker() {
		const launchCamera = __DEV__ ? ImagePicker.showImagePicker : ImagePicker.launchCamera;
		launchCamera({
			// 加了这两句控制大小
			maxWidth: 800,
			// 加了这两句控制大小
			maxHeight: 800,
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
				const { curIndex } = this.state;
				const skus = [...this.state.skus];
				skus[curIndex].feedDatas.posPicture = response.uri;
				this.setState({
					posImg: response.uri,
					skus,
				});
			}
		});
	}

	scrollToInput(reactNode) {
		this.scroll.props.scrollToFocusedInput(reactNode);
	}

	async createImgSuffix(storeName) {
		const str = Base64.encode(`${formatDateTime()} ${globalData.province} ${globalData.city} ${globalData.district} ${storeName}`).replace(/\//g, '_').replace(/\+/g, '-');
		return `?watermark/2/text/${str}/fontsize/360/dx/10/dy/10`;
	}

	async uploadImg(uri, imgSuffix = '') {
		if (uri.startsWith('http')) return uri;
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

	onPrev() {
		const { skus, total, curIndex, fenXiao, zhuangTai, price, mianShu, huoDong, huoDongContent, xiaoLiang, kuCun, fenXiaoNameArr, zhuangTaiNameArr, huoDongNameArr } = this.state;
		if (curIndex > 0) {
			const newIndex = curIndex - 1;
			const { mfdDate } = skus[newIndex].feedDatas;
			const mfdDateArr = mfdDate ? mfdDate.split('-') : [];
			const now = new Date();
			this.setState({
				skus,
				curIndex: newIndex,
				fenXiao: skus[newIndex].feedDatas.distributionStr || fenXiaoNameArr[0],
				zhuangTai: skus[newIndex].feedDatas.goodsStateStr || zhuangTaiNameArr[0],	
				price: skus[newIndex].feedDatas.goodsPrice || '',
				mianShu: skus[newIndex].feedDatas.displaySurfaces || '',
				// mfdDate   最早生产日期
				year: mfdDateArr[0] ? parseInt(mfdDateArr[0]) : now.getFullYear(),
				month: mfdDateArr[1] ? parseInt(mfdDateArr[1]) : now.getMonth() + 1,
				date: mfdDateArr[2] ? parseInt(mfdDateArr[2]) : now.getDate(),
				huoDong: skus[newIndex].feedDatas.salesPromotionStr || huoDongNameArr[0],
				huoDongContent: skus[newIndex].feedDatas.salesRemark || '',
				xiaoLiang: skus[newIndex].feedDatas.yestodayNum || '',
				kuCun: skus[newIndex].feedDatas.stockNum || '',
				posImg: skus[newIndex].feedDatas.posPicture || '',
			});
		}
	}

	onSubmit() {
		const {
			total,
			curIndex,
			fenXiao,
			fenXiaoArr,
			zhuangTai,
			zhuangTaiArr,
			price,
			mianShu,
			huoDong,
			huoDongArr,
			huoDongContent,
			xiaoLiang,
			kuCun,
			fenXiaoNameArr,
			zhuangTaiNameArr,
			huoDongNameArr,
			year,
			month,
			date,
			posImg,
		} = this.state;
		const skus = [...this.state.skus];
		if (!skus[curIndex].feedDatas) skus[curIndex].feedDatas = {};
		skus[curIndex].feedDatas.distributionStr = fenXiao;
		skus[curIndex].feedDatas.distribution = fenXiaoArr.filter(t => t.name === fenXiao)[0].code;
		skus[curIndex].feedDatas.goodsStateStr = zhuangTai;
		skus[curIndex].feedDatas.goodsState = zhuangTaiArr.filter(t => t.name === zhuangTai)[0].code;
		skus[curIndex].feedDatas.goodsPrice = price;
		skus[curIndex].feedDatas.displaySurfaces = mianShu;
		skus[curIndex].feedDatas.salesPromotionStr = huoDong;
		skus[curIndex].feedDatas.salesPromotion = huoDongArr.filter(t => t.name === huoDong)[0].code;
		skus[curIndex].feedDatas.salesRemark = huoDongContent;
		skus[curIndex].feedDatas.yestodayNum = xiaoLiang;
		skus[curIndex].feedDatas.stockNum = kuCun;
		skus[curIndex].feedDatas.mfdDate = formatDateTime(new Date(year, month - 1, date), 'yyyy-MM-dd');
		skus[curIndex].feedDatas.posPicture = posImg;
		let newIndex = curIndex;
		if (curIndex < total - 1) {
			newIndex = curIndex + 1;
		}

		if (!skus[newIndex].feedDatas) {
			skus[newIndex].feedDatas = {};
		}
		const { mfdDate } = skus[newIndex].feedDatas;
		const mfdDateArr = mfdDate ? mfdDate.split('-') : [];
		const now = new Date();
		this.setState({
			skus,
			curIndex: newIndex,
			fenXiao: skus[newIndex].feedDatas.distributionStr || fenXiaoNameArr[0],
			zhuangTai: skus[newIndex].feedDatas.goodsStateStr || zhuangTaiNameArr[0],	
			price: skus[newIndex].feedDatas.goodsPrice || '',
			mianShu: skus[newIndex].feedDatas.displaySurfaces || '',
			// mfdDate   最早生产日期
			huoDong: skus[newIndex].feedDatas.salesPromotionStr || huoDongNameArr[0],
			huoDongContent: skus[newIndex].feedDatas.salesRemark || '',
			xiaoLiang: skus[newIndex].feedDatas.yestodayNum || '',
			kuCun: skus[newIndex].feedDatas.stockNum || '',
			year: mfdDateArr[0] ? parseInt(mfdDateArr[0]) : now.getFullYear(),
			month: mfdDateArr[1] ? parseInt(mfdDateArr[1]) : now.getMonth() + 1,
			date: mfdDateArr[2] ? parseInt(mfdDateArr[2]) : now.getDate(),
			posImg: skus[newIndex].feedDatas.posPicture,
		}, async () => {
			if (curIndex === total - 1) {
				// 准备提交
				const { skus } = this.state;
				const feedDatas = skus.map(s => s.feedDatas);

				for (let i = 0; i < feedDatas.length; i++) {
					feedDatas[i].skuid = skus[i].skuId;
					if (feedDatas[i].distributionStr !== '无') {
						if (feedDatas[i].goodsStateStr !== '缺货' && feedDatas[i].goodsStateStr !== '滞销退货') {
							if (feedDatas[i].goodsPrice === '' || isNaN(feedDatas[i].goodsPrice)) {
								toast(`请正确填写第${i + 1}个商品的价格`);
								return;
							}
							if (feedDatas[i].displaySurfaces === '' || isNaN(feedDatas[i].displaySurfaces)) {
								toast(`请正确填写第${i + 1}个商品的陈列面数`);
								return;
							}
							if (feedDatas[i].yestodayNum === '' || isNaN(feedDatas[i].yestodayNum)) {
								toast(`请正确填写第${i + 1}个商品的昨日销量`);
								return;
							}
							if (feedDatas[i].stockNum === '' || isNaN(feedDatas[i].stockNum)) {
								toast(`请正确填写第${i + 1}个商品的商品库存`);
								return;
							}
						}
					}
					if (feedDatas[i].posPicture) {
						const userInfo = await getMyInfo();
						const storeName = userInfo.datas.currentStoreName;
						const imgSuffix = await this.createImgSuffix(storeName);
						feedDatas[i].posPicture = await this.uploadImg(feedDatas[i].posPicture, imgSuffix);
					}
				}

				const {
					paiMianUri1,
					paiMianUri2,
					paiMianUri3,
					paiMianUri4,
					chenLie,
					chenLieArr,
					chenLieNameArr,
					chenLieUri1,
					chenLieUri2,
					chenLieUri3,
					chenLieUri4,
					onMissionDone,
					taskId,
				} = this.props.navigation.state.params;
				const crdPicture = [paiMianUri1, paiMianUri2, paiMianUri3, paiMianUri4].filter(t => t).join(',');
				const specialPicture = [chenLieUri1, chenLieUri2, chenLieUri3, chenLieUri4].filter(t => t).join(',');
				const specialDisplay = chenLieArr.filter(t => t.name === chenLie)[0].code;
				updateMission2(taskId, crdPicture, specialPicture, specialDisplay, JSON.stringify(feedDatas)).then(result => {
					toast('提交成功');
					onMissionDone && onMissionDone(taskId);
					this.props.navigation.goBack('MissionIntroduceScene');
				}).catch(e => {
					toast(e);
				});
			}
		});
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
			total,
			curIndex,
			skus,
			loading,
		} = this.state;
		if (loading) {
			return <Spinner />;
		}
		const { isEnabled } = this.props.navigation.state.params;
		const looseScales = parseInt(skus[curIndex].looseScales);
		return (
			<View style={styles.container}>
				<KeyboardAwareScrollView innerRef={ref => {this.scroll = ref;}} enableOnAndroid style={styles.container}>
					<TouchableOpacity activeOpacity={1}>
						<View style={styles.titleContainer}>
							<View style={styles.titleIcon} />
							<Text style={styles.title}>
								商品名称：{ skus[curIndex].skuName }
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
						{
							fenXiao !== '无' && (
								<View>
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
									{
										zhuangTai !== '缺货' && zhuangTai !== '滞销退货' && (
											<View>
												<View style={styles.rowContainer}>
													<Text style={styles.key}>
														商品价格(元）
													</Text>
													<View style={styles.valContainer}>
														<TextInput
															onChangeText={priceTxt => {
																const newSkus = [...this.state.skus];
																newSkus[curIndex].feedDatas.goodsPrice = priceTxt;
																this.setState({
																	price: priceTxt,
																	skus: newSkus,
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
																const newSkus = [...this.state.skus];
																newSkus[curIndex].feedDatas.displaySurfaces = txt;
																this.setState({
																	mianShu: txt,
																	skus: newSkus,
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
														(huoDong === '买赠' || huoDong === '其他') && (
															<View style={styles.huoDongInputContainer}>
																<TextInput
																	multiline
																	onChangeText={txt => {
																		const newSkus = [...this.state.skus];
																		newSkus[curIndex].feedDatas.salesRemark = txt;
																		this.setState({
																			huoDongContent: txt,
																			skus: newSkus,
																		});
																	}}
																	onFocus={(event: Event) => {
																		this.scrollToInput(findNodeHandle(event.target));
																	}}
																	value={huoDongContent}
																	placeholder={'请输入' + huoDong + '活动内容（30字以内）'}
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
														昨日销量（{ looseScales === 1 ? 'kg' : '个' }）
													</Text>
													<View style={styles.valContainer}>
														<TextInput
															onChangeText={txt => {
																const newSkus = [...this.state.skus];
																newSkus[curIndex].feedDatas.yestodayNum = txt;
																this.setState({
																	xiaoLiang: txt,
																	skus: newSkus,
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
														商品库存（{ looseScales === 1 ? 'kg' : '个' }）
													</Text>
													<View style={styles.valContainer}>
														<TextInput
															onChangeText={txt => {
																const newSkus = [...this.state.skus];
																newSkus[curIndex].feedDatas.stockNum = txt;
																this.setState({
																	kuCun: txt,
																	skus: newSkus,
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
											</View>		
										)
									}
								</View>
							)
						}
						<View style={styles.btnContainer}>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									this.onPrev();
								}}
								style={[styles.nextBtn, curIndex === 0 ? styles.disableBtn : null]}
							>
								<Text style={[styles.btnTxt, curIndex === 0 ? styles.disableBtnTxt : null]}>
									上一个
								</Text>
							</TouchableOpacity>
							{
								(total - 1 !== curIndex || isEnabled !== -1) && (
									<TouchableOpacity
										activeOpacity={0.8}
										onPress={() => {
											this.onSubmit();
										}}
										style={styles.nextBtn}
									>
										<Text style={styles.btnTxt}>
											{
												total - 1 === curIndex ? '提交' : '下一个'
											}
										</Text>
									</TouchableOpacity>
								)
							}
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
		height: toDips(80),
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
	btnContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: toDips(48),
		marginBottom: toDips(56),
	},
	nextBtn: {
		width: toDips(294),
		height: toDips(82),
		backgroundColor: '#DD4124',
		borderRadius: toDips(41),
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		// marginTop: toDips(286),
		marginBottom: toDips(126),
	},
	disableBtn: {
		backgroundColor: '#E0E0E0',
	},
	btnTxt: {
		fontSize: getFontSize(32),
		color: 'white',
	},
	disableBtnTxt: {
		color: '#A9A9A9',
	},
});
