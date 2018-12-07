'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	TextInput,
	TouchableOpacity,
	Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import picker from 'react-native-picker';
import { toDips, getFontSize } from '../../utils/dimensions';
import navigationUtil from '../../utils/navigation';
import Spinner from '../../component/Spinner';
import { getMyInfo, setMyInfo, getCityArr, getStoreArr } from '../../service';
import toast from '../../utils/toast';
import * as qiniu from '../../utils/qiniu';
import { isCardno } from '../../utils/reg';
import { QI_NIU_DOMAIN } from '../../config';
import cityJsonArr from './city.json';

class HeaderRight extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			isCanEdit: false,
		};
	}

	render() {
		const { isCanEdit } = this.state;
		return (
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={() => {
					this.setState({
						isCanEdit: !isCanEdit,
					}, () => {
						this.props.navigation.state.params.onHeaderRightPress(this.state.isCanEdit);
					});
				}}
				style={{flex: 1,}}
			>
				<Text
					style={{
						fontSize: getFontSize(34),
						color: 'white',
						marginRight: toDips(32),
					}}
				>
					{ isCanEdit ? '保存' : '编辑' }
				</Text>
			</TouchableOpacity>
		);
	}
}

export default class UserInfoScene extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '填写个人信息',
		headerRight: <HeaderRight navigation={navigation} />,
	});

	constructor(props) {
		super(props);
		this.state = {
			myInfo: {
				fullName: '',
				// 身份证号码
				idNo: '',
				// 身份证正面照
				idPositivePho: '',
				// 身份证反面照
				idOppositePho: '',
				userImage1: '',
				userImage2: '',
			},
			// 省的名字
			province: null,
			// 当前选中的城市
			cityData: null,
			// 当前选中的门店
			storeData: null,
			inited: false,
			uploading: false,
			isCanEdit: false,
			isEmpty: false,
		};
	}

	async componentDidMount() {
		this.props.navigation.setParams({
			onHeaderRightPress: (isCanEdit) => {
				this.onHeaderRightPress(isCanEdit);
			},
		});
		/*
			idOppositePho  身份证反面照 
			salesId  促销员ID 
			fullName  促销员姓名 
			idPositivePho  身份证正面照 
			storeList  门店列表 
			storeList.storeName  门店名称 
			storeList.id  门店ID 
			idNo  身份证号 
			personalPhoto  个人照片（json数组） 
			currentStoreId  当前绑定门店ID
		*/
		let myInfo = null;
		try {
			/*
			{ idOppositePho: null,
			currentCityId: null,
			salesId: '2192667870824448',
			fullName: '11',
			idPositivePho: null,
			idNo: null,
			personalPhoto: null,
			currentStoreId: null }
			*/
			myInfo = await getMyInfo();			
		} catch (e) {
			toast(e);
			return;
		}
		let storeData = null;
		let storeId = null;
		const currentCityId = parseInt(myInfo.datas.currentCityId);
		// 获取门店数据
		this.storeArr = await getStoreArr(currentCityId);
		this.storeArr = this.storeArr.datas.storeList;
		for (let i = 0; i < this.storeArr.length; i++) {
			if (this.storeArr[i].id === myInfo.datas.currentStoreId) {
				storeData = this.storeArr[i];
				storeId = storeData.id;
				break;
			}
		}
		this.setState({
			myInfo: {
				...myInfo.datas,
				userImage1: Array.isArray(myInfo.datas.personalPhoto) ? decodeURIComponent(myInfo.datas.personalPhoto[0]) : '',
				userImage2: Array.isArray(myInfo.datas.personalPhoto) ? decodeURIComponent(myInfo.datas.personalPhoto[1]) : '',
				cityId: currentCityId,
				storeId,
			},
			province: myInfo.datas.currentCountyName,
			cityData: { name: myInfo.datas.currentCityName, id: parseInt(currentCityId) },
			storeData,
			inited: true,
			isEmpty: !myInfo.datas.fullName,
			isCanEdit: !myInfo.datas.fullName,
		});
	}

	onHeaderRightPress(isCanEdit) {
		if (!isCanEdit) {
			Alert.alert(
				'提示',
				'是否保存修改内容',
				[
					{ text: '否', onPress: () => {
						this.setState({
							isCanEdit,
						});
					}, style: 'cancel'},
					{ text: '是', onPress: () => {
						this.onSubmit((result) => {
							if (result) {
								this.setState({
									isCanEdit,
								});
							}
						});
					} },
				],
				{ cancelable: false }
			);
		} else {
			this.setState({
				isCanEdit,
			});
		}
	}

	initCityPicker() {

		function createCityData() {
			const data = [];
			const len = cityJsonArr.length;
			for (let i = 0; i < len; i++) {				
				const _data = {};
				_data[cityJsonArr[i]['name']] = cityJsonArr[i].city.map(c => c.name);
				data.push(_data);
			}
			return data;
		}

		picker.init({
			pickerData: createCityData(),
			// selectedValue: ['河北', '唐山', '古冶区'],
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '城市选择',
			pickerBg: [255, 255, 255, 1],
			onPickerConfirm: pickedValue => {
				let finded = false;
				for (let index = 0; index < cityJsonArr.length; index++) {
					finded = false;
					for (let x = 0; x < cityJsonArr[index].city.length; x++) {
						if (cityJsonArr[index].city[x].name === pickedValue[1]) {
							finded = true;
							this.setState({
								cityData: cityJsonArr[index].city[x],
								storeData: null,
								myInfo: {
									...this.state.myInfo,
									cityId: cityJsonArr[index].city[x].id,
								},
							}, () => {								
								// 获取门店数据
								getStoreArr(cityJsonArr[index].city[x].id).then(result => {
									this.storeArr = result.datas.storeList;
								}).catch(e => {
									toast(e);
								});
							});
						}
						if (finded) {
							break;
						}
					}
					if (finded) {
						break;
					}
				}
			},
			onPickerCancel: pickedValue => {
				console.log('area', pickedValue);
			},
			onPickerSelect: pickedValue => {
				// picker.select(['山东', '青岛', '黄岛区'])
				console.log('area', pickedValue);
			}
		});
	}

	initStorePicker() {
		const pickerData = this.storeArr.map(storeData => storeData.name);
		if (pickerData.length > 0) {
			picker.init({
				pickerData,
				pickerConfirmBtnText: '确定',
				pickerCancelBtnText: '取消',
				pickerTitleText: '门店选择',
				pickerBg: [255, 255, 255, 1],
				onPickerConfirm: pickedValue => {
					for (let i = 0; i < this.storeArr.length; i++) {
						if (this.storeArr[i].name === pickedValue[0]) {
							this.setState({
								storeData: this.storeArr[i],
								myInfo: {
									...this.state.myInfo,
									storeId: this.storeArr[i].id,
								},
							});
							break;
						}
					}
				},
			});
			return true;
		}
		return false;
	}

	componentWillUnmount() {
		picker.hide();
	}

	onShowCityPicker() {
		if (this.state.isCanEdit) {
			if (!picker.isPickerShow()) {
				this.initCityPicker();
				picker.show();
			}
		}
	}

	onShowStorePicker() {
		if (this.state.isCanEdit) {
			if (!picker.isPickerShow()) {
				if (this.initStorePicker()) {
					picker.show();
				} else {
					toast('该地区的门店列表为空！');
				}
			}	
		}
	}

	onFullNameChange(fullName) {
		this.setState({
			myInfo: {
				...this.state.myInfo,
				fullName,
			},
		});
	}

	onIdNoChange(idNo) {
		this.setState({
			myInfo: {
				...this.state.myInfo,
				idNo,
			},
		});
	}

	onPickImage(category, type) {
		const { isCanEdit } = this.state;
		if (!isCanEdit) { return; }
		// category 1 是身份证照 2 是个人照片
		// type 1 是正面照 2 是反面照
		// type 1 是个人照1 2 是个人照2
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
				if (category === 1) {
					this.setState({
						myInfo: {
							...this.state.myInfo,
							[`${type === 1 ? 'idPositivePho' : 'idOppositePho'}`]: response.uri,
						},
					});
				} else {
					this.setState({
						myInfo: {
							...this.state.myInfo,
							[`userImage${type}`]: response.uri,
						},
					});
				}
			}
		});
	}

	async uploadImg(uri) {
		let data = null;
		try {
			data =  await qiniu.upload(uri, `${global.uid}_${new Date().getTime()}.jpg`);
		} catch (err) {
			console.warn(err);
			toast('上传照片失败，请重试');
			this.setState({
				uploading: false,
			});
			return false;
		}
		return `${QI_NIU_DOMAIN}/${data.key}?imageView2/2/w/600/h/400`;
	}

	onSubmit(callback) {
		const { myInfo } = this.state;
		const { from } = this.props.navigation.state.params;
		let { fullName, idNo, idPositivePho, idOppositePho, userImage1, userImage2, cityId, storeId } = myInfo;
		if (!fullName) {
			toast('请输入真实姓名');
			callback && callback(false);
			return;
		}
		if (!isCardno(idNo)) {
			toast('请输入正确的身份证号');
			callback && callback(false);
			return;
		}
		if (!idPositivePho) {
			toast('请上传身份证正面照');
			callback && callback(false);
			return;
		}
		if (!idOppositePho) {
			toast('请上传身份证反面照');
			callback && callback(false);
			return;
		}
		if (!userImage1) {
			toast('请上传第一张个人照片');
			callback && callback(false);
			return;
		}
		if (!userImage2) {
			toast('请上传第二张个人照片');
			callback && callback(false);
			return;
		}
		if (!cityId) {
			toast('请选择所在城市');
			callback && callback(false);
			return;	
		}
		if (!storeId) {
			toast('请选择绑定门店');
			callback && callback(false);
			return;
		}
		this.setState({
			uploading: true,
		}, async () => {
			if (!idPositivePho.startsWith('http')) {
				idPositivePho = await this.uploadImg(idPositivePho);
				if (!idPositivePho) {
					callback && callback(false);
					return;
				}
			}
			if (!idOppositePho.startsWith('http')) {
				idOppositePho = await this.uploadImg(idOppositePho);
				if (!idOppositePho) {
					callback && callback(false);
					return;
				}
			}
			if (!userImage1.startsWith('http')) {
				userImage1 = await this.uploadImg(userImage1);
				if (!userImage1) {
					callback && callback(false);
					return;
				}
			}
			if (!userImage2.startsWith('http')) {
				userImage2 = await this.uploadImg(userImage2);
				if (!userImage2) {
					callback && callback(false);
					return;
				}
			}
			
			setMyInfo({
				fullName,
				idNo,
				cityId,
				storeId,
				idPositivePho,
				idOppositePho,
				personalPhotos: [userImage1, userImage2].join(','),
			}).then(result => {
				if (from === 'register') {
					// 跳到首页
					this.setState({
						uploading: false,
					}, () => {
						navigationUtil.reset(this.props.navigation, 'main');
					});
				} else {
					toast('修改成功');
					this.setState({
						uploading: false,
						isCanEdit: false,
						isEmpty: false,
					});
					callback && callback(true);
				}
			}).catch(e => {
				toast(e);
				this.setState({
					uploading: false,
				});
				callback && callback(false);
			});
		});
	}

	render() {
		const {
			myInfo: {
				fullName,
				idNo,
				idPositivePho,
				idOppositePho,
				userImage1,
				userImage2,
			},
			province,
			cityData,
			storeData,
			inited,
			uploading,
			isCanEdit,
			isEmpty,
		} = this.state;
		if (!inited) {
			return <Spinner />;
		}
		return (
			<View style={styles.container}>
				<View style={styles.itemContainer}>
					<Image style={styles.icon} source={require('../../imgs/xm.png')} />
					<Text style={styles.contentTxt}>
						姓名：
					</Text>
					{
						isCanEdit ? (
							<TextInput
								onChangeText={fullName => {
									this.onFullNameChange(fullName);
								}}
								value={fullName}
								placeholder='请输入真实姓名'
								placeholderTextColor='#B5B5B5'
								style={styles.input}
								maxLength={6}
							/>
						) : (
							<Text style={styles.input}>
								{ fullName }
							</Text>
						)
					}
				</View>
				<View style={styles.itemContainer}>
					<Image style={styles.icon} source={require('../../imgs/sfzh.png')} />
					<Text style={styles.contentTxt}>
						身份证号码：
					</Text>
					{
						isCanEdit ? (
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
						) : (
							<Text style={styles.input}>
								{ idNo }
							</Text>
						)
					}
				</View>
				<View style={[styles.itemContainer, { height: toDips(141) }]}>
					<Image style={styles.icon} source={require('../../imgs/sfzzp.png')} />
					<Text style={styles.contentTxt}>
						身份证照片：
					</Text>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							this.onPickImage(1, 1);
						}}
					>
						{
							idPositivePho ? (
								<Image style={styles.phoneBgImg} source={{ uri: idPositivePho }} />
							) : (
								<Image style={styles.phoneBgImg} source={require('../../imgs/jia2.png')} />
							)
						}
					</TouchableOpacity>
					<Text style={styles.infoTxt}>
						正面
					</Text>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							this.onPickImage(1, 2);
						}}
					>
						{
							idOppositePho ? (
								<Image style={styles.phoneBgImg} source={{ uri: idOppositePho }} />
							) : (
								<Image style={styles.phoneBgImg} source={require('../../imgs/jia2.png')} />
							)
						}
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
							this.onPickImage(2, 1);
						}}
					>
						{
							userImage1 ? (
								<Image style={styles.phoneBgImg} source={{ uri: userImage1 }} />
							) : (
								<Image style={styles.phoneBgImg} source={require('../../imgs/jia2.png')} />
							)
						}
					</TouchableOpacity>
					<Text style={styles.infoTxt}>
						照片1
					</Text>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							this.onPickImage(2, 2);
						}}
					>
						{
							userImage2 ? (
								<Image style={styles.phoneBgImg} source={{ uri: userImage2 }} />
							) : (
								<Image style={styles.phoneBgImg} source={require('../../imgs/jia2.png')} />
							)
						}
					</TouchableOpacity>
					<Text style={styles.infoTxt}>
						照片2
					</Text>
				</View>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						this.onShowCityPicker();
					}}
					style={[styles.itemContainer, { justifyContent: 'space-between' }]}
				>
					<View style={styles.itemLeftContainer}>
						<Image style={styles.icon} source={require('../../imgs/cs.png')} />
						<Text style={styles.contentTxt}>
							所在城市：
						</Text>
						<Text style={styles.contentTxt}>
							{ cityData ? `${province} ${cityData.name}` : '选择城市' }
						</Text>
					</View>
					{
						isCanEdit && <Image style={styles.arrowImg} source={require('../../imgs/jt.png')} />
					}
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						this.onShowStorePicker();
					}}
					style={[styles.itemContainer, { justifyContent: 'space-between' }]}
				>				
					<View style={styles.itemLeftContainer}>
						<Image style={styles.icon} source={require('../../imgs/md.png')} />
						<Text style={styles.contentTxt}>
							绑定门店：
						</Text>
						<Text style={styles.contentTxt}>
							{ storeData ? storeData.name : '选择门店' }
						</Text>
					</View>
					{
						isCanEdit && <Image style={styles.arrowImg} source={require('../../imgs/jt.png')} />
					}
				</TouchableOpacity>
				{
					// 提交按钮
				}
				{
					isEmpty && (
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => {
								this.onSubmit();
							}}
							style={styles.submitBtn}
						>
							<Text style={styles.submitBtnTxt}>
								提交
							</Text>
						</TouchableOpacity>
					)
				}
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
		// width: toDips(225),
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
