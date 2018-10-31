'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import { toDips, getFontSize } from '../../utils/dimensions';

// 任务说明
export default class MissionIntroduce extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '理货',
	});

	constructor(props) {
		super(props);
	}

	onSubmit() {
		const {navigate} = this.props.navigation;
		navigate({
			routeName: 'MissionDetailScene',
			// params: {
			// 	missionId,
			// },
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<ScrollView style={styles.container}>
					<View style={styles.titleContainer}>
						<Text style={styles.missionTitle}>
							清风【生活用纸】理货
						</Text>
						<View style={styles.misstionTitleRow}>
							<Image style={styles.icon} source={require('../../imgs/sj2.png')} />
							<Text style={styles.missionInfo}>
								项目时间：2016-09-01至2016-09-30（30天）
							</Text>
						</View>
						<View style={styles.misstionTitleRow}>
							<Image style={styles.icon} source={require('../../imgs/xm2.png')} />
							<Text style={styles.missionInfo}>
								项目介绍:  项目介绍内容项目介绍内容项目介绍内容项目介绍内容项目介绍内容项目介绍内容
							</Text>
						</View>
					</View>
					<View style={styles.desContainer}>
						<View style={styles.desTitleContainer}>
							<View style={styles.desTitleIcon} />
							<Text style={styles.desTitleTxt}>
								陈列要求：
							</Text>
						</View>
						<Text style={styles.des}>
							1.牌面货架加满，依照先进先出原则进行补货陈列和前进陈列确保商品陈列先丰满、整齐、美观（严禁只拉一个面，货品排列不乱）
						</Text>
						<Text style={styles.des}>
							2.严格检查商品质量，如发现货架上出现霉变，过期、包装陈旧、商品破损及非销售期的商品即时撤离货架；
						</Text>

						<View style={styles.desTitleContainer}>
							<View style={styles.desTitleIcon} />
							<Text style={styles.desTitleTxt}>
								补充说明：
							</Text>
						</View>
						<Text style={styles.des}>
							1.牌面货架加满，依照先进先出原则进行补货陈列和前进陈列确保商品陈列先丰满、整齐、美观（严禁只拉一个面，货品排列不乱）
						</Text>

						<View style={styles.desTitleContainer}>
							<View style={styles.desTitleIcon} />
							<Text style={styles.desTitleTxt}>
								标准陈列图片：
							</Text>
						</View>
						<Image style={styles.img} source={{ uri: 'http://g.hiphotos.baidu.com/image/pic/item/21a4462309f790524ec4285a01f3d7ca7acbd5ff.jpg' }} />
					</View>
					{
						// 按钮
					}
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							this.onSubmit();
						}}
						style={styles.submitBtn}
					>
						<Text style={styles.submitBtnTxt}>
							接单
						</Text>
					</TouchableOpacity>
				</ScrollView>
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
		backgroundColor: 'white',
		padding: toDips(48),
		borderColor: '#E6E6E6',
		borderBottomWidth: 1,
	},
	missionTitle: {
		fontSize: getFontSize(32),
		color: '#4E4E4E',
		marginBottom: toDips(8),
	},
	misstionTitleRow: {
		flexDirection: 'row',
		marginTop: toDips(20),
		alignItems: 'center',
	},
	icon: {
		width: toDips(30),
		height: toDips(30),
	},
	missionInfo: {
		fontSize: getFontSize(28),
		color: '#A9A9A9',
		marginLeft: toDips(8),
	},
	desContainer: {
		backgroundColor: 'white',
		paddingLeft: toDips(32),
		paddingRight: toDips(32),
		paddingBottom: toDips(32),
		borderColor: '#E6E6E6',
		borderBottomWidth: 1,
		borderTopWidth: 1,
		marginTop: toDips(21),
	},
	desTitleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: toDips(32),
	},
	desTitleIcon: {
		width: toDips(6),
		height: toDips(32),
		borderRadius: toDips(3),
		backgroundColor: '#DD4124',
	},
	desTitleTxt: {
		fontSize: getFontSize(28),
		color: '#DD4124',
		marginLeft: toDips(13),
	},
	des: {
		fontSize: getFontSize(28),
		color: '#636363',
		marginTop: toDips(32),
		lineHeight: toDips(36),
	},
	img: {
		width: toDips(677),
		height: toDips(396),
		marginTop: toDips(32),
	},
	submitBtn: {
		width: toDips(391),
		height: toDips(82),
		borderRadius: toDips(41),
		backgroundColor: '#DD4124',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		marginTop: toDips(56),
	},
	submitBtnTxt: {
		fontSize: getFontSize(32),
		color: 'white',
	},
});
