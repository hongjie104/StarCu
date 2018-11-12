import { NetInfo } from 'react-native';
import qs from 'qs';
// import * as utils from './utils';
import { __TEST__ } from '../config';

const TIME_OUT = 12000;

let isConnected = true;

function handleConnectivityChange(_isConnected) {
	isConnected = _isConnected;
}

NetInfo.isConnected.addEventListener('change', handleConnectivityChange);
NetInfo.isConnected.fetch().done((_isConnected) => { isConnected = _isConnected; });

function timeout(promise, ms) {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => reject('网络似乎不通畅，请稍后再试'), ms);
		promise.then((response) => {
			clearTimeout(timer);
			resolve(response);
		}).catch(reject);
	});
}

/**
 * 发送post请求
 * @param  {[string]}   url             api
 * @param  {[json]} data                数据
 */
export function post(url, data) {
	if (__TEST__) {
		return get(`${url}?${qs.stringify(data || {})}`);
	}
	return new Promise((resolve, reject) => {
		if (!isConnected) {
			// utils.toast('网络链接已断开');
			reject('net is not Connected');
			return;
		}
		console.log('[post] url => ' + url);
		console.log('[post] data => ', data);
		timeout(fetch(encodeURI(url), {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		}), TIME_OUT)
			.then(response => response.text())
			.then((responseText) => {
				const jsonData = JSON.parse(responseText);
				console.log('[post] result => ', jsonData);
				if (jsonData.errorCode === '0') {
					resolve(jsonData.body);
				} else {
					reject(jsonData.errorMsg);
				}
			})
			.catch(e => reject(e.toString()));
	});
}

/**
 * 发送get请求
 * @param  {[string]} url
 */
export function get(url) {
	return new Promise((resolve, reject) => {
		if (!isConnected) {
			// utils.toast('网络链接已断开');
			reject('net is not Connected');
			return;
		}
		console.log('[get] url => ' + url);

		timeout(fetch(encodeURI(url)), TIME_OUT)
			.then(response => response.text())
			.then((responseText) => {
				// console.warn(responseText);
				const jsonData = JSON.parse(responseText);
				console.log('[get] result => ', jsonData);
				if (jsonData.errorCode === '0') {
					resolve(jsonData.body);
				} else {
					reject(jsonData.errorMsg);
				}
			})
			.catch(e => reject(e.toString()));
	});
}
