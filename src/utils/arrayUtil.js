'use strict';

/**
 * 去重
 * @param  {[type]} array [description]
 * @return {[type]}       [description]
 */
export function dedupe(array) {
	return Array.from(new Set(array));
}
