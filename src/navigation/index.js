'use strict';

import React from 'react';
import { Platform, YellowBox, Image, Text } from 'react-native'
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { toDips, getFontSize } from '../utils/dimensions';

import MainScene from '../scene/main';
import MissionDetailScene from '../scene/main/MissionDetail';
import MissionIntroduceScene from '../scene/main/MissionIntroduce';
import OrderScene from '../scene/order';
import MsgScene from '../scene/msg';
import MyScene from '../scene/my';
import AccountScene from '../scene/account';
import WithdrawScene from '../scene/withdraw';
import AccountDetailScene from '../scene/accountDetail';
import BankCardScene from '../scene/bankCard';
import PhoneCheckerScene from '../scene/bankCard/PhoneChecker';
import UserInfoScene from '../scene/userInfo';
import RegisterScene from '../scene/register';
import LoginScene from '../scene/login';
import HelperScene from '../scene/helper';
import ProtocolScene from '../scene/protocol';

import StackViewStyleInterpolator from "react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator";

YellowBox.ignoreWarnings([
	'Module CDVFileTransfer',
	'Module ZipPlugin',
	'Class CDVPlugin',
]);

const TabNavigation = createBottomTabNavigator({
	homeTab: MainScene,
	orderTab: OrderScene,
	msgTab: MsgScene,
	myTab: MyScene,
});

TabNavigation.navigationOptions = ({ navigation }) => {
	const component = TabNavigation.router.getComponentForState(navigation.state);
	if (typeof component.onShow === 'function') {
		component.onShow();
	}
	let options = null;
	if (typeof component.navigationOptions === 'function') {
		options = component.navigationOptions({ navigation });
	} else {
		options = component.navigationOptions;
	}
	return options || {};
};

// export default StackNavigator;
export default function createAppNavigation(isLogedIn) {
	return createStackNavigator({
		main: TabNavigation,
		RegisterScene,
		LoginScene,
		MissionIntroduceScene,
		MissionDetailScene,
		AccountScene,
		// 提现
		WithdrawScene,
		// 对账流水
		AccountDetailScene,
		// 银行卡
		BankCardScene,
		// 验证手机号码
		PhoneCheckerScene,
		UserInfoScene,
		HelperScene,
		ProtocolScene,
	}, {
		initialRouteName: isLogedIn ? 'main' : 'LoginScene',
		// mode: 'card',
		// headerMode: 'none',
		// headerTintColor: '#DD4124',
		navigationOptions: {
			gesturesEnabled: true,
			headerStyle: {
				backgroundColor: '#DD4124',
				shadowOpacity: 0,
				elevation: 0,
				borderBottomWidth: 0,
			},
			headerTitleStyle: Platform.select({
				ios: null,
				android: {
					textAlign: 'center',
					alignSelf: 'center',
					flex: 1,
				},
			}),
			headerTitleContainerStyle: Platform.select({
				ios: null,
				android: {
					left: 56,
					right: 56,
				},
			}),
			headerTintColor: 'white',
		},
		transitionConfig: (transitionProps, prevTransitionProps, isModal) => {
			const { scenes } = transitionProps;
			const { params } = scenes[scenes.length - 1].route;
			if (params && params.mode === 'modal') {
				return {
					screenInterpolator: Platform.select({
						ios: StackViewStyleInterpolator.forVertical,
						android: StackViewStyleInterpolator.forFadeFromBottomAndroid,
					}),
				};
			}
			return {
				screenInterpolator: StackViewStyleInterpolator.forHorizontal,
			};
		},
	});
};
