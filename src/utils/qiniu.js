// 参考 https://blog.csdn.net/qq_33935895/article/details/78775819
// https://github.com/900eTrip/react-native-qiniu

import Qiniu, { Auth, ImgOps, Conf, Rs, Rpc } from 'react-native-qiniu';

Conf.ACCESS_KEY = "DgkbV9lWhgYZh33A_Xr76zZJz6HbEMLP5VDAAF0h";
Conf.SECRET_KEY = "qYSTBNr7g3llQ6UwujmNA9j6J7t6BFQuRc-hFTnW";
const scope = 'xingcu';


// 上传
export function upload(uri, imageName) {
	// 上传参数
	const params = {
		uri,
		key: imageName,
	};
	//构建上传策略
	const policy = {
		scope,
		// returnBody 详见上传策略
		// returnBody: {
		// 	// 获取文件名
		// 	name: "$(fname)",
		// 	// 获取文件大小
		// 	size: "$(fsize)",
		// 	w: "$(imageInfo.width)",
		// 	h: "$(imageInfo.height)",
		// 	hash: "$(etag)",
		// },
	};
	//进行文件上传 
	// return promise
	return Rpc.uploadFile(params, policy);
}


// rpc.js
// import conf from './conf.js';
// import Auth from './auth';

// //发送管理和fop命令,总之就是不上传文件
// function post(uri, adminToken, content) {
//     var headers = {
//         'Content-Type': 'application/x-www-form-urlencoded',
//     };
//     let payload = {
//         headers: headers,
//         method: 'POST',
//         dataType: 'json',
//         timeout: conf.RPC_TIMEOUT,
//     };
//     if (typeof content === 'undefined') {
//         payload.headers['Content-Length'] = 0;
//     } else {
//         //carry data
//         payload.body = content;
//     }

//     if (adminToken) {
//         headers['Authorization'] = adminToken;
//     }

//     return fetch(uri, payload);
// }


// /**
//  * 直传文件
//  * formInput对象如何配置请参考七牛官方文档“直传文件”一节
//  */

// function uploadFile(dataParams, policy, callbackUpDate = function () { }, callBackMethod = function () { }) {
//     let params = getParams(dataParams, policy);
//     let uri = params.uri;
//     let data = params.data;
//     let oloaded = null;
//     let responseObj = {};
//     return new Promise((resolve, reject) => {
//         if (typeof uri != 'string' || uri == '' || typeof data.key == 'undefined') {
//             reject && reject(null);
//             return;
//         }
//         if (uri[0] == '/') {
//             uri = "file://" + uri;
//         }
//         //创建xhr并open
//         var xhr = new XMLHttpRequest();
//         xhr.onreadystatechange = function () {
//             responseObj.readyState = xhr.readyState; //状态0-4
//             responseObj.data = xhr.response;//返回值
//             responseObj.textData = xhr.responseText; //返回值Text
//             responseObj.status = xhr.status; //状态码
//             // responseObj.message = ""
//             switch (xhr.readyState) {
//                 case 0:
//                     callBackMethod(responseObj)
//                     break;
//                 case 1:
//                     callBackMethod(responseObj)
//                     break;
//                 case 2:
//                     callBackMethod(responseObj)
//                     break;
//                 case 3:
//                     callBackMethod(responseObj)
//                     break;
//                 case 4:
//                     if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
//                         if (xhr.status == 200) {
//                             callBackMethod(responseObj)
//                         }
//                     } else {
//                         callBackMethod(responseObj)
//                     }
//                     break;
//             }
//         };
//         xhr.open('POST', conf.UP_HOST);
//         xhr.onload = () => {
//             if (xhr.status !== 200) {
//                 reject && reject(responseObj);
//                 return;
//             }
//             resolve && resolve(JSON.parse(responseObj.data));
//         };
//         xhr.onerror = (evt) => {
//             reject && reject(evt);
//             return;
//         }; //请求失败
//         xhr.upload.onloadstart = () => {//上传开始执行方法
//             oloaded = 0;//设置上传开始时，以上传的文件大小为0
//             console("上传开始")
//         };
//         xhr.upload.onprogress = (evt) => {
//             oloaded = evt.loaded;//重新赋值已上传文件大小，用以下次计算
//             callbackUpDate(Math.round(oloaded / evt.total * 100), oloaded, evt.total)
//         };
//         xhr.upload.onloadend = (evt) => {
//             console("上传结束")
//         };
//         let formdata = creatFormData(params);
//         xhr.send(formdata);
//     });
// }

// //构造上传参数
// function getParams(data, policy) {
//     let putPolicy = new Auth.Policy(
//         policy
//     );
//     let uptoken = putPolicy.token();
//     data.token = uptoken;
//     let params = {};
//     params.uri = data.uri;
//     delete data.uri;
//     params.data = data;
//     return params;
// }

// /**
//  * 创建一个表单对象,用于上传参数
//  * @param {*} params
//  */
// function creatFormData(params) {
//     let formdata = new FormData();
//     let uri = params.uri;
//     let formInput = creatFormInput(uri);
//     let data = params.data;
//     console.log(data)
//     for (let key of Object.keys(data)) {
//         let value = data[key];
//         if (key.charAt(0) === "_") {
//             formdata.append("x:" + key.substring(1, key.length), value);
//         } else {
//             formdata.append(key, value);
//         }
//     }
//     formdata.append("file", { uri: uri, type: formInput.type, name: formInput.name });
//     console.log(formdata)
//     return formdata;
// }
// /**
//  * 构造表单对象中file对象
//  * @param {*} params
//  */
// function creatFormInput(uri) {
//     let formInput = {};
//     if (typeof formInput.type == 'undefined')
//         formInput.type = 'application/octet-stream';
//     if (typeof formInput.name == 'undefined') {
//         var filePath = uri.split("/");
//         if (filePath.length > 0)
//             formInput.name = filePath[filePath.length - 1];
//         else
//             formInput.name = "";
//     }
//     return formInput;
// }

// export default { uploadFile, post }



// auth.js
// import base64 from 'base-64';
// import CryptoJS from "crypto-js";
// import conf from "./conf.js";
// import parse from 'url-parse';

// function urlsafeBase64Encode(jsonFlags) {
//     var encoded = base64.encode(jsonFlags);
//     return base64ToUrlSafe(encoded);
// };

// function base64ToUrlSafe(v) {
//     return v.replace(/\//g, '_').replace(/\+/g, '-');
// };

// function hmacSha1(encodedFlags, secretKey) {
//     var encoded = CryptoJS.HmacSHA1(encodedFlags, secretKey).toString(CryptoJS.enc.Base64);
//     return encoded;
// };

// function generateAccessToken(url, body) {
//     var u = parse(url, true);

//     var path = u.pathname;
//     var access = path + '\n';

//     if (body) {
//         access += body;
//     }

//     var digest = hmacSha1(access, conf.SECRET_KEY);
//     var safeDigest = base64ToUrlSafe(digest);
//     let token = 'QBox ' + conf.ACCESS_KEY + ':' + safeDigest;
//     //console.log(token);
//     return token;
// };



// class Policy {
//     constructor(policy) {
//         if (typeof (policy) == "undefined") {
//         } else {
//             this.policy = policy;
//             if (typeof (policy.deadline) == "undefined" || policy.deadline == null) {
//                 this.policy.deadline = 3600 + Math.floor(Date.now() / 1000);
//             }
//         }
//     }

//     _parse2Str(putPolicy) {
//         let str = "{";
//         let keys = Object.keys(putPolicy);
//         keys.forEach((key, i) => {
//             let value = putPolicy[key];
//             if (typeof (value) == "object") {
//                 str = `${str}"${key}":`
//                 str = `${str}"{`
//                 Object.keys(value).forEach((key2) => {
//                     let value2 = value[key2];
//                     let re = /(\$\(.*?\))/g;
//                     if(re.test(value2)){
//                         str = `${str}\\\"${key2}\\\":${value2},`
//                     }else{
//                         str = `${str}\\\"${key2}\\\":"${value2}",`
//                     }

//                 })
//                 console.log(keys.length + "::" + i)
//                 if (i >= keys.length) {
//                     str = `${str.substring(0, str.length - 1)}}"`
//                 }else{
//                     str = `${str.substring(0, str.length - 1)}}",`
//                 }
//             }
//             else if (typeof (value) == "number") {
//                 str = `${str}"${key}":${value},`
//             }
//             else if (typeof (value) == "string") {
//                 str = `${str}"${key}":"${value}",`
//             }
//             else {
//                 str = `${str}"${key}":"${value}",`
//             }
//         })
//         str = `${str.substring(0, str.length - 1)}}`;
//         return str;
//     }


//     // _creatStr = (policy) => {
//     //   policy['deadline'] = this.expires + Math.floor(Date.now() / 1000);
//     //   let policyStr = JSON.stringify(policy);
//     // let re = /(\"\$\(.*?\)\")/g;
//     //   let newStr = policyStr.replace(re, (value) => {
//     //     return value.substring(1, value.length - 1);
//     //   })
//     //   return newStr;
//     // }

//     token = () => {
//         policStr = this._parse2Str(this.policy);
//         console.log("policStr", policStr);
//         var encodedPutPolicy = this._urlsafeBase64Encode(policStr);
//         console.log("encodedPutPolicy", encodedPutPolicy);
//         var sign = this._hmacSha1(encodedPutPolicy, conf.SECRET_KEY);
//         var encodedSign = this._base64ToUrlSafe(sign);
//         console.log("encodedSign", encodedSign);
//         var uploadToken = conf.ACCESS_KEY + ':' + encodedSign + ':' + encodedPutPolicy;
//         console.log("uploadToken", uploadToken);
//         return uploadToken;
//     }

//     _urlsafeBase64Encode = (jsonFlags) => {
//         var encoded = base64.encode(jsonFlags);
//         return base64ToUrlSafe(encoded);
//     };

//     _base64ToUrlSafe = (v) => {
//         return v.replace(/\//g, '_').replace(/\+/g, '-');
//     };

//     _hmacSha1 = (encodedFlags, secretKey) => {
//         var encoded = CryptoJS.HmacSHA1(encodedFlags, secretKey).toString(CryptoJS.enc.Base64);
//         return encoded;
//     };

// }

// class GetPolicy {
//     constructor(expires) {
//         this.expires = expires || 3600;
//     }

//     makeRequest(baseUrl) {
//         var deadline = this.expires + Math.floor(Date.now() / 1000);

//         if (baseUrl.indexOf('?') >= 0) {
//             baseUrl += '&e=';
//         } else {
//             baseUrl += '?e=';
//         }
//         baseUrl += deadline;

//         var signature = hmacSha1(baseUrl, conf.SECRET_KEY);
//         var encodedSign = base64ToUrlSafe(signature);
//         var downloadToken = conf.ACCESS_KEY + ':' + encodedSign;

//         return baseUrl + '&token=' + downloadToken;
//     }
// }

// export default { urlsafeBase64Encode, generateAccessToken, Policy, GetPolicy }