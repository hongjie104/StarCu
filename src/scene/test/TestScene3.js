'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View
} from 'react-native';

export default class TestScene3 extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: ``,
	});

	constructor(props) {
		super(props);
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		return (
			<View style={styles.container}>
				<Text style={{ marginTop: 200 }} onPress={() => {
					goBack();
				}}>
					this is TestScene3
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