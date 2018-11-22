'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	WebView,
} from 'react-native';

export default class Helper extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '帮助中心',
	});

	constructor(props) {
		super(props);
	}

	render() {
		// const { navigate, goBack } = this.props.navigation;
		const { url } = this.props.navigation.state.params;
		return (
			<WebView
				source={{uri: url}}
				style={styles.container}
			/>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	}
});
