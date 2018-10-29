'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
} from 'react-native';

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
				<Text style={{}}>
					我的面板
				</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
