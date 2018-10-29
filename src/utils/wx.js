'use strict';

import * as WeChat from 'react-native-wechat';
import * as net from './net';

WeChat.registerApp('wxfa94edb3518b3a6f');

export function login() {
	return new Promise((resolve, reject) => {
		WeChat.sendAuthRequest('snsapi_userinfo', new Date().toString()).then((data) => {
			// appid: "wx9c1bb3ba9acc75ff"
			// code: "041cd9c6e6fe8e3e501ece775cd3005c"
			// country: "CN"
			// errCode: 0
			// errStr: "成功"
			// lang: "zh_CN"
			// state: "Thu Mar 03 14:44:51 格林尼治标准时间+0800 2016"
			// transaction: null
			// type: "SendAuth.Resp"
			// url: "wx9c1bb3ba9acc75ff://oauth?code=041cd9c6e6fe8e3e501ece775cd3005c&state=Thu+Mar+03+14%3A44%3A51+%E6%A0%BC%E6%9E%97%E5%B0%BC%E6%B2%BB%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4%2B0800+2016"
			const { appid, code, errCode } = data;
			// 先获取token
			// 图个轻松的secret
			const secret = "6c835783d793f9994713093a221bbd37";
			net.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`, (data) => {
				/*
				参数            说明
				access_token	接口调用凭证
				expires_in      access_token接口调用凭证超时时间，单位（秒）
				refresh_token   用户刷新access_token
				openid          授权用户唯一标识
				scope           用户授权的作用域，使用逗号（,）分隔
				unionid	        当且仅当该移动应用已获得该用户的userinfo授权时，才会出现该字段
				 */
				/*
				{
					"access_token":"OezXcEiiBSKSxW0eoylIeJ480gqsw4Fz329eAV7V4Mgqs3B7V-NpsKitLL36QARzwq19HCeSxNC2oO1O8mkuogXQ8k0RID8wTicOncwVlap92Ypn8cEKNzXh1DgKId53",
					"expires_in":7200,
					"refresh_token":"OezXcEiiBSKSxW0eoylIeJ480gqsw4Fz329eAV7V4Mgqs3B7V-NpsKitLL36QARzgH4Et9xSIKBpTMaMZDSi6BlOulIOmknvgjAT6WAa3MKr25hCOOybjGCU9kzomdWOFrW8eTZDqsFIVZFj8GHcqQ",
					"openid":"odWvgs1H2aZmdCNKcjzEfpCWOkok",
					"scope":"snsapi_userinfo",
					"unionid":"oxTU3w3vGnrPCZ8_J280Ji9BnvIQ"
				}
				 */
				
				// 再获取用户信息
				net.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${data.access_token}&openid=${data.openid}`, (data) => {
					// {
					//     "openid":"odWvgs1H2aZmdCNKcjzEfpCWOkok",
					//     "nickname":"鸿杰",
					//     "sex":1,
					//     "language":"zh_CN",
					//     "city":"Baoshan",
					//     "province":"Shanghai",
					//     "country":"CN",
					//     "headimgurl":"http://wx.qlogo.cn/mmopen/ajNVdqHZLLB1tibkShzH8H1DEpuT9bbzd8D0h7QjqzVfnm8WvJxicJcSDZG97AXYPyksOSlG5C6cMRxiaVjF8NY9A/0",
					//     "privilege":[

					//     ],
					//     "unionid":"oxTU3w3vGnrPCZ8_J280Ji9BnvIQ"
					// }
					resolve(data);
				});
			});
		}).catch(e => {
			reject(e);
		});
	});
}
