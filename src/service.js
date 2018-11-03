
import { SERVER_HOST, SERVER_KEY } from './config';
import { get, post } from './utils/net';

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
