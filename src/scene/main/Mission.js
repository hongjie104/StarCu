'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	FlatList,
} from 'react-native';
import MissionItem from '../../component/MissionItem';
import { toDips, getFontSize } from '../../utils/dimensions';
import toast from '../../utils/toast';
import { getTodayMission } from '../../service';

const ITEM_HEIGHT = toDips(180);

export default class Mission extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			missionList: [],
			numMission: 0,
			expectedIncome: 0,	
		};
	}

	componentDidMount() {
		console.warn('aa');
		getTodayMission().then(result => {
			const { expectedIncome, taskNum, tasks } = result.datas;
			this.setState({
				expectedIncome,
				numMission: taskNum,
				missionList: tasks.map(m => {
					m.key = m.taskId.toString();
					return m;
				}),
			});
		}).catch(e => {
			toast(e);
		})
	}

	renderItem({item, index}) {
		return (
			<MissionItem item={item} type={0} navigation={this.props.navigation} />
		);
	}

	render() {
		const {
			missionList,
			numMission,
			expectedIncome,
		} = this.state;
		return (
			<View style={styles.container}>
				<Image style={styles.bangImg} source={require('../../imgs/main.png')} />
				<View style={styles.infoContainer}>
					<View style={styles.info}>
						<Text style={styles.infoNum}>
							{ numMission }
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
							{ expectedIncome }
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
		flex: 1,
	},
	bangImg: {
		width: toDips(750),
		height: toDips(167),
		position: 'absolute',
	},
	infoContainer: {
		width: toDips(675),
		height: toDips(195),
		backgroundColor: 'white',
		borderRadius: toDips(23),
		alignSelf: 'center',
		marginTop: toDips(40),
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
		// fontWeight: '500',
		color: '#333333',
	},
	infoLine: {
		width: toDips(2),
		height: toDips(77),
		backgroundColor: '#DADADA'
	},
	list: {
		marginTop: toDips(33),
		flex: 1,
	},
});
