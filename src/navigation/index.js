'use strict';

import React from 'react';
import { Platform, YellowBox, Image, Text } from 'react-native'
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { toDips, getFontSize } from '../utils/dimensions';

import MainScene from '../scene/main';
import MissionDetailScene from '../scene/main/MissionDetail';
import OrderScene from '../scene/order';
import MsgScene from '../scene/msg';
import MyScene from '../scene/my';
import AccountScene from '../scene/account';
import LoginScene from '../scene/login';

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
	let options = null;
	if (typeof component.navigationOptions === 'function') {
		options = component.navigationOptions({ navigation });
	} else {
		options = component.navigationOptions;
	}
	if (!options) { options = {}; }
	return {
		...options,
		tabBarLabel: ({focused, route: { routeName }}) => {
			/*
			{
				route: {
					isTransitioning: false,
					index: 0,
					routes: [ { routeName: 'MyScene', key: 'id-1540893304900-3' } ],
					key: 'myTab',
					routeName: 'myTab',
					params: undefined
				},
				focused: false,
				tintColor: 'gray'
			}
			 */
			if (routeName === 'homeTab') {
				return <Text style={[{ fontSize: getFontSize(26), fontWeight: '500' }, focused ? { color: '#DD4124' } : { color: '#878787' }]}>任务</Text>
			} else if (routeName === 'orderTab') {
				return <Text style={[{ fontSize: getFontSize(26), fontWeight: '500' }, focused ? { color: '#DD4124' } : { color: '#878787' }]}>订单</Text>
			} else if (routeName === 'msgTab') {
				return <Text style={[{ fontSize: getFontSize(26), fontWeight: '500' }, focused ? { color: '#DD4124' } : { color: '#878787' }]}>消息</Text>
			} else {
				return <Text style={[{ fontSize: getFontSize(26), fontWeight: '500' }, focused ? { color: '#DD4124' } : { color: '#878787' }]}>我的</Text>
			}
		},
	};
};

const stackNavigatorConfig = {
	initialRouteName: 'main',
	// mode: 'card',
	// headerMode: 'none',
	// headerTintColor: '#DD4124',
	navigationOptions: {
		headerStyle: {
			backgroundColor: '#DD4124',
			shadowOpacity: 0,
			elevation: 0,
			borderBottomWidth: 0,
		},
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
};

const StackNavigator = createStackNavigator({
	main: TabNavigation,
	MissionDetailScene,
	AccountScene,
}, stackNavigatorConfig);

export default StackNavigator;


/*
1、StackNavigator属性介绍
navigationOptions：配置StackNavigator的一些属性。
title：标题，如果设置了这个导航栏和标签栏的title就会变成一样的，不推荐使用
header：可以设置一些导航的属性，如果隐藏顶部导航栏只要将这个属性设置为null
headerTitle：设置导航栏标题，推荐
headerBackTitle：设置跳转页面左侧返回箭头后面的文字，默认是上一个页面的标题。可以自定义，也可以设置为null
headerTruncatedBackTitle：设置当上个页面标题不符合返回箭头后的文字时，默认改成"返回"
headerRight：设置导航条右侧。可以是按钮或者其他视图控件
headerLeft：设置导航条左侧。可以是按钮或者其他视图控件
headerStyle：设置导航条的样式。背景色，宽高等
headerTitleStyle：设置导航栏文字样式
headerBackTitleStyle：设置导航栏‘返回'文字样式
headerTintColor：设置导航栏颜色
headerPressColorAndroid：安卓独有的设置颜色纹理，需要安卓版本大于5.0
gesturesEnabled：是否支持滑动返回手势，iOS默认支持，安卓默认关闭
screen：对应界面名称，需要填入import之后的页面 
mode：定义跳转风格 
	card：使用iOS和安卓默认的风格 
	modal：iOS独有的使屏幕从底部画出。类似iOS的present效果 
headerMode：返回上级页面时动画效果 
	float：iOS默认的效果 
	screen：滑动过程中，整个页面都会返回 
	none：无动画 
cardStyle：自定义设置跳转效果
transitionConfig： 自定义设置滑动返回的配置
onTransitionStart：当转换动画即将开始时被调用的功能
onTransitionEnd：当转换动画完成，将被调用的功能 
path：路由中设置的路径的覆盖映射配置 
initialRouteName：设置默认的页面组件，必须是上面已注册的页面组件 
initialRouteParams：初始路由参数
注：大家可能对于path不太理解。path属性适用于其他app或浏览器使用url打开本app并进入指定页面。path属性用于声明一个界面路径，例如：【/pages/Home】。此时我们可以在手机浏览器中输入：app名称://pages/Home来启动该App，并进入Home界面。
 */