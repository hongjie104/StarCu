'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	WebView,
	Text,
} from 'react-native';

export default class Helper extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		headerTitle: <Text style={{ color: 'white', fontSize: 16 }}>{navigation.state.params.title || 'null'}</Text>,
	});

	constructor(props) {
		super(props);
	}

	render() {
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
