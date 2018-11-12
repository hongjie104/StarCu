// 参考 https://blog.csdn.net/qq_33935895/article/details/78775819

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
