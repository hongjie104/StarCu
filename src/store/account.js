'use strict';

import { observable, action } from 'mobx';

/**
 * 账号信息
 */
class Account {

    @observable
    name = 'test name11';

    @action
    setName(val) {
    	this.name = val;
    }
}

export default new Account();
