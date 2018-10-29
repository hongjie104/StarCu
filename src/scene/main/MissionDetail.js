'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
} from 'react-native';
import { toDips, getFontSize } from '../../utils/dimensions';

export default class MissionDetail extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '任务详情',
	});

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		const { params: { missionId } } = this.props.navigation.state;
	}

	render() {
		// const { navigate, goBack } = this.props.navigation;
		return (
			<View style={styles.container}>
				<View style={styles.titleContainer}>
					<View style={styles.titleIcon} />
					<Text style={styles.titleTxt}>
						理货拍照
					</Text>
				</View>
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
		fontWeight: '500',
		color: '#3A3A3A',
		marginLeft: toDips(12),
	}
});
