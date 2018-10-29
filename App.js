'use strict';

import React, { PureComponent } from 'react';
import {
    BackHandler
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import AppNavigation from './src/navigation';
import toast from './src/utils/toast';
import * as deviceInfo from './src/utils/deviceInfo';

export default class App extends PureComponent {
    
    constructor(props) {
        super(props);

        // 上一次按下android返回键的时间
        this._lastPressBackTime = 0;
    }

    componentDidMount() {
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
    }

    render() {
        return (
            <AppNavigation ref={c => this._navigation = c} />
        );
    }
}