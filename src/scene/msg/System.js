'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
} from 'react-native';
import Order from './Order';

export default class SystemMsgList extends Order {

	constructor(props) {
		super(props);
		// this.state = {
		// 	msgList: [
		// 		{
		// 			key: '1',
		// 			name: '尊敬的185****2123',
		// 			des: '今日任务共10项，请及时处理待完成任务，祝您度过愉快的一天',
		// 			time: '2018-06-14 15:10',
		// 			status: 1,
		// 		},
		// 		{
		// 			key: '2',
		// 			name: '订单名称',name: '尊敬的185****2123',
		// 			des: '今日任务共10项，请及时处理待完成任务，祝您度过愉快的一天',
		// 			time: '2018-06-14 15:10',
		// 			status: 1,status: 1,
		// 		},
		// 		{
		// 			key: '3',
		// 			name: '尊敬的185****2123',
		// 			des: '今日任务共10项，请及时处理待完成任务，祝您度过愉快的一天',
		// 			time: '2018-06-14 15:10',
		// 			status: 1,
		// 		},
		// 		{
		// 			key: '4',
		// 			name: '尊敬的185****2123',
		// 			des: '今日任务共10项，请及时处理待完成任务，祝您度过愉快的一天',
		// 			time: '2018-06-14 15:10',
		// 			status: 1,
		// 		},
		// 		{
		// 			key: '5',
		// 			name: '尊敬的185****2123',
		// 			des: '今日任务共10项，请及时处理待完成任务，祝您度过愉快的一天',
		// 			time: '2018-06-14 15:10',
		// 			status: 1,
		// 		},
		// 		{
		// 			key: '6',
		// 			name: '尊敬的185****2123',
		// 			des: '今日任务共10项，请及时处理待完成任务，祝您度过愉快的一天',
		// 			time: '2018-06-14 15:10',
		// 			status: 1,
		// 		},
		// 	],
		// };
	}

	getItemImg() {
		return require('../../imgs/xtxx.png');
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
