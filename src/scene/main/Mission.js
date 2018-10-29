'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	FlatList,
	ImageBackground,
	TouchableOpacity,
} from 'react-native';
import { toDips, getFontSize } from '../../utils/dimensions';

const ITEM_HEIGHT = toDips(180);

export default class Mission extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			missionList: [
				{
					key: '1',
					name: '清风理货活动',
					category: '项目类型',
					time: '2016.12.12-2017.01.12',
					status: 1,
				},
				{
					key: '2',
					name: '清风理货活动',
					category: '项目类型',
					time: '2016.12.12-2017.01.12',
					status: 1,
				},
				{
					key: '3',
					name: '清风理货活动',
					category: '项目类型',
					time: '2016.12.12-2017.01.12',
					status: 1,
				},
				{
					key: '4',
					name: '清风理货活动',
					category: '项目类型',
					time: '2016.12.12-2017.01.12',
					status: 1,
				},
				{
					key: '5',
					name: '清风理货活动',
					category: '项目类型',
					time: '2016.12.12-2017.01.12',
					status: 1,
				},
			],
		};
	}

	onItemPress(missionId) {
		const {navigate} = this.props.navigation;
		navigate({
			routeName: 'missionDetail',
			params: {
				missionId,
			},
		});
	}

	renderItem({item, index}) {
		return (
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={() => {
					this.onItemPress(item.key);
				}}
				style={styles.itemContainer}
			>
				<View style={styles.itemInfoContainer}>
					<ImageBackground style={styles.itemStatusImgBg} source={require('../../imgs/huangk.png')}>
						<Image style={styles.itemStatusImg} source={require('../../imgs/wwc.png')} />
						<Text style={styles.itemStatusTxt}>
							未完成
						</Text>
					</ImageBackground>
					<View style={styles.itemInfoSubContainer}>
						<Text style={styles.name}>
							{ item.name }
						</Text>
						<Text style={styles.category}>
							{ item.category }
						</Text>
						<View style={styles.itemDateRow}>
							<Image style={styles.clockImg} source={require('../../imgs/clock.png')} />
							<Text style={styles.date}>
								{ item.time }
							</Text>
						</View>
					</View>
				</View>
				<Image style={styles.arrowImg} source={require('../../imgs/jt.png')} />
			</TouchableOpacity>
		);
	}

	render() {
		const {
			missionList,
		} = this.state;
		return (
			<View style={styles.container}>
				<View style={styles.infoContainer}>
					<View style={styles.info}>
						<Text style={styles.infoNum}>
							16
						</Text>
						<View style={styles.infoRow}>
							<Image style={styles.iconInfo} source={require('../../imgs/dqrw.png')} />
							<Text style={styles.iconTxt}>
								当前任务
							</Text>
						</View>
					</View>
					<View style={styles.infoLine} />
					<View style={styles.info}>
						<Text style={styles.infoNum}>
							120
						</Text>
						<View style={styles.infoRow}>
							<Image style={styles.iconInfo} source={require('../../imgs/yjsy.png')} />
							<Text style={styles.iconTxt}>
								预计收益(元)
							</Text>
						</View>
					</View>
				</View>
				<FlatList
					data={missionList}
					renderItem={itemData => {
						return this.renderItem(itemData);
					}}
					getItemLayout={(_, index) => (
						{length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
					)}
					style={styles.list}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		// ...
	},
	infoContainer: {
		width: toDips(675),
		height: toDips(195),
		backgroundColor: 'white',
		borderRadius: toDips(23),
		alignSelf: 'center',
		marginTop: toDips(54),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	info: {
		flex: 1,
		alignItems: 'center',
	},
	infoNum: {
		color: '#DD4124',
		fontSize: getFontSize(48),
		fontWeight: 'bold',
		// marginTop: toDips(36),
		marginBottom: toDips(24),

	},
	infoRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	iconInfo: {
		width: toDips(32),
		height: toDips(32),
		marginRight: toDips(13),
	},
	iconTxt: {
		fontSize: getFontSize(30),
		fontWeight: '500',
		color: '#333333',
	},
	infoLine: {
		width: toDips(2),
		height: toDips(77),
		backgroundColor: '#DADADA'
	},
	list: {
		marginTop: toDips(33),
	},
	itemContainer: {
		flex: 1,
		width: toDips(750),
		height: toDips(180),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 1,
		backgroundColor: 'white',
	},
	itemInfoContainer: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	itemStatusImgBg: {
		width: toDips(194),
		height: toDips(151),
		marginLeft: toDips(34),
		alignItems: 'center',
	},
	itemStatusTxt: {
		fontSize: getFontSize(26),
		fontWeight: '500',
		color: 'white',
		marginTop: toDips(11),
	},
	itemStatusImg: {
		width: toDips(48),
		height: toDips(48),
		marginTop: toDips(25),
	},
	itemInfoSubContainer: {
		marginLeft: toDips(36),
	},
	name: {
		color: '#2A2A2A',
		fontSize: getFontSize(36),
		fontWeight: '500',
	},
	category: {
		color: '#9D9D9D',
		fontSize: getFontSize(30),
		fontWeight: '500',
		marginTop: toDips(19),
	},
	itemDateRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: toDips(19),
	},
	clockImg: {
		width: toDips(27),
		height: toDips(27),
		marginRight: toDips(7),
	},
	date: {
		color: '#969696',
		fontSize: getFontSize(24),
		fontWeight: '500',
	},
	arrowImg: {
		width: toDips(18),
		height: toDips(34),
		marginRight: toDips(46),
	},
});
