'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
} from 'react-native';
import { toDips, getFontSize } from '../../utils/dimensions';

export default class MyScene extends PureComponent {
	
	// static navigationOptions = ({ navigation, screenProps }) => ({
	// 	title: ``,
	// });

	constructor(props) {
		super(props);
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		return (
			<View style={styles.container}>
				<View style={styles.topContainer}>
					<Image style={styles.header} source={require('../../imgs/tx.png')} />
					<Text style={styles.name}>
						16211242102
					</Text>
				</View>
				<View style={styles.middleContainer}>
					<View style={styles.infoContainer}>
						<Image style={styles.imgInfo} source={require('../../imgs/zhze.png')} />
						<View style={styles.infoKeyVal}>
							<Text style={styles.infoKey}>
								账户总额
							</Text>
							<Text style={styles.infoVal}>
								¥20000
							</Text>
						</View>
					</View>
					<View style={styles.infoLine} />
					<View style={styles.infoContainer}>
						<Image style={styles.imgInfo} source={require('../../imgs/thk.png')} />
						<View style={styles.infoKeyVal}>
							<Text style={styles.infoKey}>
								银行卡
							</Text>
							<Text style={styles.infoVal}>
								未绑定
							</Text>
						</View>
					</View>
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
	topContainer: {
		width: toDips(750),
		height: toDips(236),
		backgroundColor: '#DD4124',
		alignItems: 'center',
	},
	header: {
		width: toDips(110),
		height: toDips(110),
		borderColor: 'rgba(255, 255, 255, 0.3)',
		borderWidth: toDips(5),
		borderRadius: toDips(55),
		marginTop: toDips(18),
	},
	name: {
		fontSize: toDips(30),
		fontWeight: '500',
		color: 'white',
		marginTop: toDips(24),
	},
	middleContainer: {
		flexDirection: 'row',
		height: toDips(136),
		backgroundColor: 'white',
		alignItems: 'center',
	},
	infoContainer: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
	},
	imgInfo: {
		width: toDips(60),
		height: toDips(60),
		marginLeft: toDips(76),
	},
	infoKeyVal: {
		marginLeft: toDips(40),
	},
	infoKey: {
		fontSize: toDips(28),
		fontWeight: '500',
		color: '#333333',
	},
	infoVal: {
		fontSize: toDips(28),
		fontWeight: '500',
		color: '#DD4124',
		marginTop: toDips(12),
	},
	infoLine: {
		width: toDips(1),
		height: toDips(59),
		backgroundColor: '#D7D7D7',
	},
});
