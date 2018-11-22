'use strict';

import React, { Component } from 'react';
import {
	View,
	TouchableWithoutFeedback
} from 'react-native';

const dismissKeyboard = require('dismissKeyboard');

export default (WrappedComponent) => class AutoHideKeyboard extends Component {
    render() {
        return (
            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={dismissKeyboard}>
                <View style={{ flex: 1 }}>
                    <WrappedComponent { ...this.props } />
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
