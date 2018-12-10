'use strict';

import qs from 'qs';
import toast from './toast';
import { get } from './net';

// 经度：positionData.longitude
// 纬度：positionData.latitude
// 最后一步 百度地图逆地理编码转
// lat<纬度>,lng<经度>
function getAddress(initialPosition) {
	return new Promise((resolve, reject) => {
		const baiduLocationConfig = {
			// callback: 'renderReverse',
			ak: '3nHjylGdT3z5jSldf2o2E1qyF85YDLZ4',
			pois: 1,
			output: 'json',
			latest_admin: 1,
			language_auto: 1,
			extensions_town: true,
			extensions_road: true,
			radius: 1000,
		};
		const baiduLocationURL = 'https://api.map.baidu.com/geocoder/v2/'; //GET请求
		// callback=renderReverse&location=35.658651,139.745415&output=json&pois=1&ak=您的ak

		const { longitude, latitude } = initialPosition.coords;
		const location = latitude + ',' + longitude;
		const baiduUrl = baiduLocationURL + '?' + qs.stringify({ ...baiduLocationConfig }) + '&location=' + location;
		// console.warn(baiduUrl);

		fetch(baiduUrl)
			.then(response => response.text())
			.then((responseText) => {
				const jsonData = JSON.parse(responseText);
				// const { province, city } = jsonData.result.addressComponent;
				resolve(jsonData);
			}).catch((err) => {
				console.warn('获取地址信息出错', err);
				reject(err);
			});		
	});
}


export function getLocation() {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(initialPosition => {
			// { coords: 
			// { altitudeAccuracy: -1,
			// accuracy: 5,
			// heading: -1,
			// longitude: -122.406417,
			// altitude: 0,
			// latitude: 37.785834,
			// speed: -1 },
			// timestamp: 1544431670664.213 }
			getAddress(initialPosition).then(result => {
				resolve(result);
			}).catch(e => {
				reject(e);
			});
		}, (error) => {
			reject(error.message);
			console.warn(error.message);
		}, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
	});
}
