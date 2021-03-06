'use strict';

import React, { Component, PropTypes } from 'react';
import {
	StyleSheet,
	View,
	ActivityIndicator,
	Text,
} from 'react-native';

const ColorPropType = require('ColorPropType');

export default class Spinner extends Component {

	static defaultProps = {
		color: '#f95347',
		size: 'large'
	};

	constructor(props) {
		super(props);
	}

	render() {
		const { color, size, tip } = this.props;
		return (
			<View style={styles.container}>
				<ActivityIndicator
					animating={true}
					color={color}
					size={size}
				/>
				<Text>
					{ tip || '' }
				</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent'
	}
});