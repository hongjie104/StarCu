'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
} from 'react-native';

import picker from 'react-native-picker';
import ImagePicker from 'react-native-image-picker';

import Spinner from '../../component/Spinner';
import { toDips, getFontSize } from '../../utils/dimensions';
import { getDataFromDic, getMyInfo } from '../../service';
import toast from '../../utils/toast';
import * as qiniu from '../../utils/qiniu';
import { QI_NIU_DOMAIN } from '../../config';
import * as globalData from '../../globalData';
import Base64 from '../../utils/Base64';
import { formatDateTime } from '../../utils/datetime';

export default class MissionFeedback2 extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '任务反馈',
	});

	constructor(props) {
		super(props);
		this.state = {
			paiMianUri1: '',
			paiMianUri2: '',
			paiMianUri3: '',
			paiMianUri4: '',
			chenLie: '地推',
			chenLieArr: [],
			chenLieNameArr: [],
			chenLieUri1: '',
			chenLieUri2: '',
			chenLieUri3: '',
			chenLieUri4: '',
			loading: true,
		};
	}

	async componentDidMount() {
		const data = await getDataFromDic('special_show');
		// { code: '1', name: '地推' }
		const chenLieNameArr = data.datas.items.map(i => i.name);

		const { crdPicture, specialDisplayStr, specialPicture } = this.props.navigation.state.params;
		let paiMianUri1 = '';
		let paiMianUri2 = '';
		let paiMianUri3 = '';
		let paiMianUri4 = '';
		if (crdPicture) {
			const paiMianUriArr = crdPicture.split(',');
			paiMianUri1 = paiMianUriArr[0] || '';
			paiMianUri2 = paiMianUriArr[1] || '';
			paiMianUri3 = paiMianUriArr[2] || '';
			paiMianUri4 = paiMianUriArr[3] || '';
		}
		let chenLieUri1 = '';
		let chenLieUri2 = '';
		let chenLieUri3 = '';
		let chenLieUri4 = '';
		if (specialPicture) {
			const chenLieUriArr = specialPicture.split(',');
			chenLieUri1 = chenLieUriArr[0] || '';
			chenLieUri2 = chenLieUriArr[1] || '';
			chenLieUri3 = chenLieUriArr[2] || '';
			chenLieUri4 = chenLieUriArr[3] || '';
		}
		this.setState({
			paiMianUri1,
			paiMianUri2,
			paiMianUri3,
			paiMianUri4,
			chenLieUri1,
			chenLieUri2,
			chenLieUri3,
			chenLieUri4,
			chenLieNameArr,
			chenLieArr: data.datas.items,
			chenLie: specialDisplayStr,
			loading: false,
		}, () => {
			picker.init({
				selectedValue: [this.state.huoDong],
				pickerData: chenLieNameArr,
				pickerConfirmBtnText: '确定',
				pickerCancelBtnText: '取消',
				pickerTitleText: '特殊陈列',
				pickerBg: [255, 255, 255, 1],
				onPickerConfirm: pickedValue => {
					this.setState({
						chenLie: pickedValue[0],
					});
				},
			});
		});
	}

	componentWillUnmount() {
		picker.hide();
	}

	showImagePicker(title, stateKey) {
		const launchCamera = __DEV__ ? ImagePicker.showImagePicker : ImagePicker.launchCamera;
		launchCamera({
			title,
			// 加了这两句控制大小
			maxWidth: 800,
			// 加了这两句控制大小
			maxHeight: 800,
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
					[`${stateKey}`]: response.uri,
				});
			}
		});
	}

	async createImgSuffix(storeName) {
		const { province, city, district } = globalData;
		const str = Base64.encode(`${formatDateTime()} ${province} ${city} ${district} ${storeName}`).replace(/\//g, '_').replace(/\+/g, '-');
		return `?watermark/2/text/${str}/fontsize/360/dx/10/dy/10`;
	}

	async uploadImg(uri, imgSuffix = '') {
		if (uri.startsWith('http')) return uri;
		let data = null;
		try {
			data =  await qiniu.upload(uri, `${global.uid}_${new Date().getTime()}.jpg`);
		} catch (err) {
			toast('上传照片失败，请重试');
			console.warn(err);
			return false;
		}
		// return `${QI_NIU_DOMAIN}/${data.key}?imageView2/2/w/600/h/400`;
		return `${QI_NIU_DOMAIN}/${data.key}${imgSuffix}`;
	}

	async onSubmit() {
		let {
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
		} = this.state;
		if (!paiMianUri1 && !paiMianUri2 && !paiMianUri3 && !paiMianUri4) {
			toast('请选择至少一张牌面照片');
			return;
		}
		if (chenLie !== '无') {
			if (!chenLieUri1 && !chenLieUri2 && !chenLieUri3 && !chenLieUri4) {
				toast('请选择至少一张特殊陈列照片');
				return;
			}
		}
		const userInfo = await getMyInfo();
		const storeName = userInfo.datas.currentStoreName;
		const imgSuffix = await this.createImgSuffix(storeName);

		if (paiMianUri1) paiMianUri1 = await this.uploadImg(paiMianUri1, imgSuffix);
		if (paiMianUri2) paiMianUri2 = await this.uploadImg(paiMianUri2, imgSuffix);
		if (paiMianUri3) paiMianUri3 = await this.uploadImg(paiMianUri3, imgSuffix);
		if (paiMianUri4) paiMianUri4 = await this.uploadImg(paiMianUri4, imgSuffix);

		if (chenLie !== '无') {
			if (chenLieUri1) chenLieUri1 = await this.uploadImg(chenLieUri1, imgSuffix);
			if (chenLieUri2) chenLieUri2 = await this.uploadImg(chenLieUri2, imgSuffix);
			if (chenLieUri3) chenLieUri3 = await this.uploadImg(chenLieUri3, imgSuffix);
			if (chenLieUri4) chenLieUri4 = await this.uploadImg(chenLieUri4, imgSuffix);
		}
		
		const { navigate } = this.props.navigation;
		navigate({
			routeName: 'MissionFeedbackScene',
			params: {
				...this.props.navigation.state.params,
				...this.state,
				paiMianUri1,
				paiMianUri2,
				paiMianUri3,
				paiMianUri4,
				chenLieUri1,
				chenLieUri2,
				chenLieUri3,
				chenLieUri4,
			},
		});
	}

	render() {
		// const { navigate, goBack } = this.props.navigation;
		const {
			paiMianUri1,
			paiMianUri2,
			paiMianUri3,
			paiMianUri4,
			chenLie,
			chenLieUri1,
			chenLieUri2,
			chenLieUri3,
			chenLieUri4,
			loading,
		} = this.state;
		return (
			<View style={styles.container}>
				<View>
					<View style={styles.paiMianContainer}>
						<View style={styles.titleIcon} />
						<Text style={styles.titleTxt}>
							牌面照片
						</Text>
						<View style={styles.photoContainer}>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									this.showImagePicker('选择牌面照片', 'paiMianUri1');
								}}
								style={styles.photoCell}
							>
								<Image
									style={paiMianUri1 ? styles.imgPos : styles.img10}
									source={paiMianUri1 ? { uri: paiMianUri1 } : require('../../imgs/10.png')}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									this.showImagePicker('选择牌面照片', 'paiMianUri2');
								}}
								style={styles.photoCell}
							>
								<Image
									style={paiMianUri2 ? styles.imgPos : styles.img10}
									source={paiMianUri2 ? { uri: paiMianUri2 } : require('../../imgs/10.png')}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									this.showImagePicker('选择牌面照片', 'paiMianUri3');
								}}
								style={styles.photoCell}
							>
								<Image
									style={paiMianUri3 ? styles.imgPos : styles.img10}
									source={paiMianUri3 ? { uri: paiMianUri3 } : require('../../imgs/10.png')}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									this.showImagePicker('选择牌面照片', 'paiMianUri4');
								}}
								style={styles.photoCell}
							>
								<Image
									style={paiMianUri4 ? styles.imgPos : styles.img10}
									source={paiMianUri4 ? { uri: paiMianUri4 } : require('../../imgs/10.png')}
								/>
							</TouchableOpacity>
						</View>
					</View>
					<View style={[styles.paiMianContainer, styles.chenLieContainer, chenLie === '无' ? { paddingBottom: toDips(48) } : null]}>
						<View style={styles.chenLieTitleContainer}>
							<View style={[styles.titleIcon, { marginTop: toDips(65), }]} />
								<Text style={[styles.titleTxt, { marginTop: toDips(65), }]}>
									特殊陈列
								</Text>
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {
										picker.show();
									}}
									style={styles.chenLieValContainer}
								>
									<Text style={styles.chenLieValTxt}>
										{ chenLie }
									</Text>
									<Image style={styles.arrowImg} source={require('../../imgs/back.png')} />
								</TouchableOpacity>
						</View>
						{
							chenLie !== '无' && (
								<View style={[styles.photoContainer, { marginLeft: toDips(194), }]}>
									<TouchableOpacity
										activeOpacity={0.8}
										onPress={() => {
											this.showImagePicker('选择特殊陈列', 'chenLieUri1');
										}}
										style={styles.photoCell}
									>
										<Image
											style={chenLieUri1 ? styles.imgPos : styles.img10}
											source={chenLieUri1 ? { uri: chenLieUri1 } : require('../../imgs/10.png')}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										activeOpacity={0.8}
										onPress={() => {
											this.showImagePicker('选择特殊陈列', 'chenLieUri2');
										}}
										style={styles.photoCell}
									>
										<Image
											style={chenLieUri2 ? styles.imgPos : styles.img10}
											source={chenLieUri2 ? { uri: chenLieUri2 } : require('../../imgs/10.png')}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										activeOpacity={0.8}
										onPress={() => {
											this.showImagePicker('选择特殊陈列', 'chenLieUri3');
										}}
										style={styles.photoCell}
									>
										<Image
											style={chenLieUri3 ? styles.imgPos : styles.img10}
											source={chenLieUri3 ? { uri: chenLieUri3 } : require('../../imgs/10.png')}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										activeOpacity={0.8}
										onPress={() => {
											this.showImagePicker('选择特殊陈列', 'chenLieUri4');
										}}
										style={styles.photoCell}
									>
										<Image
											style={chenLieUri4 ? styles.imgPos : styles.img10}
											source={chenLieUri4 ? { uri: chenLieUri4 } : require('../../imgs/10.png')}
										/>
									</TouchableOpacity>
								</View>
							)
						}
					</View>
				</View>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={async () => {
						await this.onSubmit();
					}}
					style={styles.nextBtn}
				>
					<Text style={styles.btnTxt}>
						下一页
					</Text>
				</TouchableOpacity>
				{
					loading && <Spinner />
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
	},
	paiMianContainer: {
		// height: toDips(240),
		backgroundColor: 'white',
		flexDirection: 'row',
		borderColor: '#DCDCDC',
		borderBottomWidth: toDips(1),
	},
	titleIcon: {
		width: toDips(6),
		height: toDips(31),
		backgroundColor: 'rgba(221,65,36,1)',
		borderRadius: toDips(3),
		marginLeft: toDips(52),
		marginTop: toDips(37),
	},
	titleTxt: {
		fontSize: getFontSize(30),
		color: '#3A3A3A',
		marginTop: toDips(37),
		marginLeft: toDips(12),
	},
	photoContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		width: toDips(530),
		paddingBottom: toDips(48),
	},
	photoCell: {
		marginTop: toDips(45),
		marginLeft: toDips(40),
		marginRight: toDips(50),
		width: toDips(150),
		height: toDips(150),
		borderStyle: 'dotted',
		borderWidth: toDips(2),
		borderColor: '#DCDCDC',
		borderRadius: toDips(12),
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
	chenLieContainer: {
		flexDirection: 'column',
	},
	chenLieTitleContainer: {
		flexDirection: 'row',
	},
	chenLieValContainer: {
		width: toDips(498),
		height: toDips(70),
		backgroundColor: '#FBFBFB',
		borderWidth: toDips(1),
		borderColor: '#DCDCDC',
		borderRadius: toDips(9),
		marginLeft: toDips(23),
		marginTop: toDips(44),
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
	},
	chenLieValTxt: {
		fontSize: getFontSize(30),
		color: '#666',
		marginLeft: toDips(26),
	},
	arrowImg: {
		width: toDips(13),
		height: toDips(24),
		marginRight: toDips(16),
	},
	nextBtn: {
		width: toDips(391),
		height: toDips(82),
		backgroundColor: '#DD4124',
		borderRadius: toDips(41),
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		// marginTop: toDips(286),
		marginBottom: toDips(126),
	},
	btnTxt: {
		fontSize: getFontSize(32),
		color: 'white',
	},
});
