// 参考 https://blog.csdn.net/qq_33935895/article/details/78775819
// https://github.com/900eTrip/react-native-qiniu

import { NativeModules } from 'react-native';
import Qiniu, { Auth, ImgOps, Conf, Rs, Rpc } from 'react-native-qiniu';
import ImageResizer from 'react-native-image-resizer';

Conf.ACCESS_KEY = "DgkbV9lWhgYZh33A_Xr76zZJz6HbEMLP5VDAAF0h";
Conf.SECRET_KEY = "qYSTBNr7g3llQ6UwujmNA9j6J7t6BFQuRc-hFTnW";
const scope = 'xingcu';


const { ImageModule } = NativeModules;


// 上传
export function upload(imgUri, imageName) {
	return new Promise((resolve, reject) => {
		ImageResizer.createResizedImage(imgUri, 800, 800, 'JPEG', 100).then(({ uri }) => {
			// response.uri is the URI of the new image that can now be displayed, uploaded...
			// response.path is the path of the new image
			// response.name is the name of the new image with the extension
			// response.size is the size of the new image
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
			resolve(Rpc.uploadFile(params, policy));
		}).catch((err) => {
			// Oops, something went wrong. Check that the filename is correct and
			// inspect err to get more details.
		});
		/*
		ImageModule.composeImage(uri, 800, 800, newUri => {
			// 上传参数
			const params = {
				uri: newUri,
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
			resolve(Rpc.uploadFile(params, policy));
		});
		*/
	});	
}

