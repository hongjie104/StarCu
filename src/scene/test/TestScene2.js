'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View
} from 'react-native';

import { observer, inject } from 'mobx-react/native';
import toast from '../../utils/toast';

@inject('account')
export default class TestScene2 extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		headerTitle: 'aaa',
	});

	constructor(props) {
		super(props);
	}

	render() {
		const { navigate, goBack, state } = this.props.navigation;
		return (
			<View style={styles.container}>
				<Text style={{ marginTop: 200 }} onPress={() => {
					this.props.account.setName('Eddie'); 
					// goBack();
					toast('aa');
					console.log(state);
					navigate('test3');
				}}>
					this is TestScene2
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