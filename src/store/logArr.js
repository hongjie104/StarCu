'use strict';

import { observable, action } from 'mobx';

global.ERROR = 'error';

global.WARN = 'warn';

global.DEBUG = 'debug';

global.INFO = 'info';

/**
 * log
 */
class LogArr {

	// {level, log}
	@observable arr = [];

	@action
	push(log) {
		this.arr.push(log);
	}

	@action
	clear() {
		this.arr.replace([]);
	}

}

export default new LogArr();