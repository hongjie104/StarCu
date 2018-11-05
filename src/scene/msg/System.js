'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
} from 'react-native';
import Order from './Order';
import { getSystemMsg } from '../../service';

export default class SystemMsgList extends Order {

	constructor(props) {
		super(props);
	}

	getItemImg() {
		return require('../../imgs/xtxx.png');
	}

	getGetMsgFun() {
		return getSystemMsg;
	}

	getMsgFromData(data) {
		return data.systemMessages;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
