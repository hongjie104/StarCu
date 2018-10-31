'use strict';

import React, { PureComponent } from 'react';
import {
	BackHandler,
	View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import createAppNavigation from './src/navigation';
import toast from './src/utils/toast';
import * as deviceInfo from './src/utils/deviceInfo';
import { loadDataFromLocal } from './src/utils/storage';

let AppNavigation = null;

export default class App extends PureComponent {
	
	constructor(props) {
		super(props);

		this.state = {
			checkingLocalData: true,
		};
		// 上一次按下android返回键的时间
		this._lastPressBackTime = 0;
	}

	componentDidMount() {
		// 读取本地信息，判断是否已登录
		loadDataFromLocal('userInfo', data => {
			this.checkingLocalDataDone();
		}, err => {
			this.checkingLocalDataDone();
		});
	}

	checkingLocalDataDone() {
		AppNavigation = createAppNavigation(false);
		if (!deviceInfo.isIOS()) {
            const defaultStateAction = AppNavigation.router.getStateForAction;
            AppNavigation.router.getStateForAction = (action, state) => {
                if(state && action.type === NavigationActions.BACK && state.routes.length === 1) {
                    if (this._lastPressBackTime + 2000 < Date.now()) {
                        toast('再按一次退出', 'bottom');
                        this._lastPressBackTime = Date.now();
                        const routes = [...state.routes];
                        return {
                            ...state,
                            ...state.routes,
                            index: routes.length - 1
                        };
                    }
                } 
                return defaultStateAction(action, state);
            };
        }
		this.setState({
			checkingLocalData: false,
		});
	}

	render() {
		if (this.state.checkingLocalData){
			return <View style={{flex: 1}}></View>
		}
		return (
			<AppNavigation ref={c => this._navigation = c} />
		);
	}
}