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
		loadDataFromLocal('token', data => {
			this.loadUid(data);
		}, err => {
			this.loadUid();
		});
	}

	loadUid(token = null) {
		loadDataFromLocal('uid', data => {
			this.loadPhone(token, data);
		}, err => {
			this.loadPhone(token);
		});
	}

	loadPhone(token = null, uid = null) {
		loadDataFromLocal('phone', data => {
			this.checkingLocalDataDone(token, uid, data);
		}, err => {
			this.checkingLocalDataDone(token, uid);
		});
	}

	checkingLocalDataDone(token = null, uid = null, phone = null) {
		global.token = token;
		global.uid = uid;
		global.phone = phone;
		AppNavigation = createAppNavigation(token);
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


// c6f534c6a19b43b2fc04036748c8d782b2a7d32b