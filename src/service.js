
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

// 根据订单找到对应的任务
export function getMissionByOrder(orderId) {
	return post(`${SERVER_HOST}/ShareWork/app/taskListByOrderId`, {
		token: global.token,
		orderId,
	});
}

// 接受订单
export function takeOrder(orderId) {
	return post(`${SERVER_HOST}/ShareWork/app/getOrders`, {
		token: global.token,
		orderId,
	});
}

// 获取任务详情
export function getMissionInfo(missionId) {
	return post(`${SERVER_HOST}/ShareWork/app/taskInfo`, {
		token: global.token,
		taskId: missionId,
	});
}

// 保存理货信息
export function updateMission(missionId, beforeTally, beforeTallyLeft, afterTally, afterTallyLeft, skuDataJson) {
	return post(`${SERVER_HOST}/ShareWork/app/task/save`, {
		token: global.token,
		taskId: missionId,
		dataJson: skuDataJson,
		beforeTally,
		beforeTallyLeft,
		afterTally,
		afterTallyLeft,
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

// 标记消息为已读
export function setMsgReaded(messageIds) {
	return post(`${SERVER_HOST}/ShareWork/app/message/read`, {
		token: global.token,
		messageIds,
	});
}

// 我的
export function getMine() {
	return post(`${SERVER_HOST}/ShareWork/app/mine`, {
		token: global.token,
	});
}

// 对账流水
export function getBill() {
	return post(`${SERVER_HOST}/ShareWork/app/financial/bill`, {
		token: global.token,
	});
}

// 获取账户信息
export function getAccountInfo() {
	return post(`${SERVER_HOST}/ShareWork/app/account/info`, {
		token: global.token,
	});
}

// 获取个人信息
export function getMyInfo() {
	return post(`${SERVER_HOST}/ShareWork/app/userinfo/get`, {
		token: global.token,
	});
}

export function setMyInfo(myInfo) {
	return post(`${SERVER_HOST}/ShareWork/app/userinfo/update`, {
		...myInfo,
		token: global.token,
	});
}

// 获取城市列表
export function getCityArr() {
	return post(`${SERVER_HOST}/ShareWork/app/cityList`, {
		token: global.token,
		key: SERVER_KEY,
	});
}

// 获取门店列表
export function getStoreArr(cityId) {
	return post(`${SERVER_HOST}/ShareWork/app/storeList`, {
		token: global.token,
		cityId,
		key: SERVER_KEY,
	});
}

// 获取银行列表
export function getBankList() {
	return post(`${SERVER_HOST}/ShareWork/app/bankList`, {
		token: global.token,
	});
}

// 获取银行卡信息
export function getBank() {
	return post(`${SERVER_HOST}/ShareWork/app/bankInfo/get`, {
		token: global.token,
	});
}

// 修改银行卡信息
export function updateBank(data, code) {
	return post(`${SERVER_HOST}/ShareWork/app/bankInfo/update`, {
		token: global.token,
		...data,
		code,
	});
}

// 获取修改银行卡信息的验证码
export function getBankCode() {
	return post(`${SERVER_HOST}/ShareWork/app/bankInfo/code`, {
		token: global.token,
		phoneNo: global.phone,
	});
}

// 获取提现信息
export function getReflect() {
	return post(`${SERVER_HOST}/ShareWork/app/reflect/get`, {
		token: global.token,
	});
}

// 提现
export function reflect(amount, reflectKey) {
	return post(`${SERVER_HOST}/ShareWork/app/reflect/save`, {
		token: global.token,
		amount,
		reflectKey,
	});
}
