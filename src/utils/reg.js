'use strict';

/**
 * 检查是不是手机号
 */
export function isPhone(phone) {
	return RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$/).test(phone);
}

export function isEmail(mail) {
	return RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(mail);
}

/**
 * 检查身份证号的合法性
 */
export function isCardno(cardno) {
	return RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(cardno);
}

export function isPasswordLegal(password) {
	return RegExp(/^[0-9a-zA-Z-_~!@#$%^&*]+$/).test(password);
}