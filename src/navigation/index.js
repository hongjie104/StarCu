'use strict';

import { Platform, YellowBox } from 'react-native'
import { createBottomTabNavigator, createStackNavigator, StackNavigator } from 'react-navigation';

// import TestScene1 from '../scene/test/TestScene1';
// import TestScene2 from '../scene/test/TestScene2';
// import TestScene3 from '../scene/test/TestScene3';
import MainScene from '../scene/main';
import MissionDetailScene from '../scene/main/MissionDetail';
import OrderScene from '../scene/order';
import MsgScene from '../scene/msg';
import MyScene from '../scene/my';
import LoginScene from '../scene/login';

import StackViewStyleInterpolator from "react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator";

YellowBox.ignoreWarnings([
	'Module CDVFileTransfer',
	'Module ZipPlugin',
	'Class CDVPlugin',
]);

const stackNavigatorConfig = {
	// initialRouteName: 'test1',
	// initialRouteName: 'main',
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

const TabNavigation = createBottomTabNavigator({
	homeTab: createStackNavigator({ MainScene }, stackNavigatorConfig),
	orderTab: createStackNavigator({ OrderScene }, stackNavigatorConfig),
	msgTab: createStackNavigator({ MsgScene }, stackNavigatorConfig),
	myTab: createStackNavigator({ MyScene }, stackNavigatorConfig),
}, {
	// animationEnabled: false,
	// tabBarPosition: 'bottom',
	// swipeEnabled: false,
	// backBehavior: 'none',
	navigationOptions: ({ navigation }) => ({
		// tabBarIcon: ({ focused, tintColor }) => {
		// 	const { routeName } = navigation.state;
		// 	let iconName;
		// 	if (routeName === 'Home') {
		// 		iconName = `ios-information-circle${focused ? '' : '-outline'}`;
		// 	} else if (routeName === 'Settings') {
		// 		iconName = `ios-options${focused ? '' : '-outline'}`;
		// 	}

		// 	// You can return any component that you like here! We usually use an
		// 	// icon component from react-native-vector-icons
		// 	return <Ionicons name={iconName} size={25} color={tintColor} />;
		// },
		headerStyle: {
			backgroundColor: '#DD4124',
			shadowOpacity: 0,
			elevation: 0,
		},
		headerTintColor: 'white',
	}),
	tabBarOptions: {
		activeTintColor: 'tomato',
		inactiveTintColor: 'gray',
	},
});

export default TabNavigation;


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