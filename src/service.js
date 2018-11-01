
import { SERVER_HOST } from './config';
import { get, post } from './utils/net';

// export function fetchGoodsTypeArr() {
// 	get(`${SERVER_HOST}/api/goodsType`, data => {
// 		console.warn(data);
// 	});
// }

// export function getTopSeries() {
// 	return get(`${SERVER_HOST}/api/app/top_series`);
// }

export function resiger(phoneNo, code, invitationCode) {
	return post(`${SERVER_HOST}/ShareWork/app/register/save`, {
		phoneNo,
		code,
		invitationCode,
	});
}
