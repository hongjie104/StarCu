'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text
} from 'react-native';

import { observer, inject } from 'mobx-react/native';
import toast from '../../utils/toast';
// import * as talkingData from '../../utils/talkingData';
// import * as wx from '../../utils/wx';
// import Egg from 'react-native-egg';
// import * as WeChat from 'react-native-wechat';
import List from '../../components/List';
// import LrcLabel from '../../components/LrcLabel';

@inject('account')
@inject('logArr')
@observer
export default class TestScene1 extends Component {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: 'test1',
	});

	constructor(props) {
		super(props);
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		const { logArr, account } = this.props;
		return (
			<View style={styles.container}>
				<Text style={{ }} onPress={() => {
					// this.props.account.name = '123';
					// goBack();
					navigate('test2', { isModal: true });
					
					logArr.push({
						level: global.ERROR,
						log: 'this is errorthis is errorthis is errorthis is errorthis is error'
					});

					// logArr.push({
					// 	level: global.ERROR,
					// 	log: 'this is errorthis is errorthis is errorthis is errorthis is error'
					// });
					// logArr.push({
					// 	level: global.WARN,
					// 	log: 'this is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warnthis is warn'
					// });
					// logArr.push({
					// 	level: global.DEBUG,
					// 	log: 'this is debug'
					// });
					// logArr.push({
					// 	level: global.INFO,
					// 	log: 'info'
					// });

					account.setName('aaa')
				}}>
					11current name is { account.name }
				</Text>
				{
					// <Text style={{ }} onPress={() => {
					// 	navigate('logScene');
					// }}>
					// 	go to logScene!
					// </Text>
				}
				{
					// <Egg
					// 	setps={'TTT'}
					// 	onCatch={() => {
					// 		toast('catch!!');
					// 	}}
					// >
					// 	<Text style={{}}>
					// 		test egg!!
					// 	</Text>
					// </Egg>
				}
				{
					// <Text style={{}} onPress={() => {
					// 	// talkingData.onEventWithLabel('testLabelAndParams', 'testLabel');
					// 	// talkingData.onLogin(talkingData.ACCOUNT_TYPE.QQ, '36', '32968210');
					// 	toast('ok');
					// }}>
					// 	talkingData event
					// </Text>
				}
				<Text style={{color: 'red', fontSize: 20}} onPress={() => {
					logArr.push({
						level: global.INFO,
						log: '先检测是否安装了微信'
					});
					// WeChat.isWXAppInstalled().then(resule => {
					// 	logArr.push({
					// 		level: global.INFO,
					// 		log: `检测结束 => ${resule.toString()}`
					// 	});
					// 	if (resule) {
					// 		wx.login().then(data => {
					// 			// {
					// 			//     "openid":"odWvgs1H2aZmdCNKcjzEfpCWOkok",
					// 			//     "nickname":"鸿杰",
					// 			//     "sex":1,
					// 			//     "language":"zh_CN",
					// 			//     "city":"Baoshan",
					// 			//     "province":"Shanghai",
					// 			//     "country":"CN",
					// 			//     "headimgurl":"http://wx.qlogo.cn/mmopen/ajNVdqHZLLB1tibkShzH8H1DEpuT9bbzd8D0h7QjqzVfnm8WvJxicJcSDZG97AXYPyksOSlG5C6cMRxiaVjF8NY9A/0",
					// 			//     "privilege":[
					// 			//     ],
					// 			//     "unionid":"oxTU3w3vGnrPCZ8_J280Ji9BnvIQ"
					// 			// }
					// 			logArr.push({
					// 				level: global.INFO,
					// 				log: `微信登录成功 => ${data.nickname}`
					// 			});
					// 		}).catch(e => {
					// 			logArr.push({
					// 				level: global.ERROR,
					// 				log: `微信登录失败 => ${e}`
					// 			});
					// 		});
					// 	} else {
					// 		logArr.push({
					// 			level: global.INFO,
					// 			log: '没有安装微信'
					// 		});
					// 	}
					// });
				}}>
					weChat login
				</Text>
				{
					<List />
				}
				{
					// 测试lrc组件
					// <LrcLabel />
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	}
});