
import { SERVER_HOST, SERVER_KEY } from './config';
import { get, post } from './utils/net';
import { formatDateTime } from './utils/datetime';

// 获取注册的验证码
// phoneNo	string	是	手机号码
// key	string	是	key值
// invitationCode	string	是	邀请码
export function getReigsterCode(phoneNo, invitationCode) {
	return post(`${SERVER_HOST}/ShareWork/app/register/getCode`, {
		phoneNo,
		invitationCode,
		key: SERVER_KEY,
	});
}

// 注册
export function resiger(phone, code, invitationCode) {
	return post(`${SERVER_HOST}/ShareWork/app/register/save`, {
		phone,
		code,
		invitationCode,
		key: SERVER_KEY,
		fullName: '阿诺',
	});
}

// 获取登录的验证码
// phoneNo	string	是	手机号码
// key	string	是	key
export function getLoginCode(phone) {
	return post(`${SERVER_HOST}/ShareWork/app/login/code`, {
		phone,
		key: SERVER_KEY,
	});
}

// 登录
export function login(phone, code) {
	return post(`${SERVER_HOST}/ShareWork/app/loginByCode`, {
		phone,
		code,
		key: SERVER_KEY,
	});
}

// 获取今日任务
export function getTodayMission() {
	return post(`${SERVER_HOST}/ShareWork/app/taskList`, {
		token: global.token,
		date: formatDateTime(new Date(), 'yyyy-MM-dd'),
	});
}

// 获取日历任务
export function getMissionCalendar(beginDate, endDate) {
	return post(`${SERVER_HOST}/ShareWork/app/taskCalendar`, {
		token: global.token,
		beginDate,
		endDate,
	});
}

// 获取订单列表
export function getOrderArr() {
	return post(`${SERVER_HOST}/ShareWork/app/orderList`, {
		token: global.token,
	});
}

// 获取订单消息
export function getOrderMsg(page, pageSize) {
	return post(`${SERVER_HOST}/ShareWork/app/orderMessage`, {
		token: global.token,
		page,
		pageSize,
	});
}

// 获取系统消息
export function getSystemMsg(page, pageSize) {
	return post(`${SERVER_HOST}/ShareWork/app/systemMessage`, {
		token: global.token,
		page,
		pageSize,
	});
}

// 获取账户信息
export function getAccountInfo() {
	return post(`${SERVER_HOST}/ShareWork/app/account/info`, {
		token: global.token,
	});
}
