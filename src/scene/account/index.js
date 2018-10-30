'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View
} from 'react-native';

// 账户页面
export default class AccountScene extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '账户总额',
	});

	constructor(props) {
		super(props);
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		return (
			<View style={styles.container}>
				
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
