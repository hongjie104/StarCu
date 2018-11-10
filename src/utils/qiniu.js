// import * as qiniu from 'qiniu-js';

// export function upload(file, fileName, token, onNext, onError, onComplete) {
// 	// 先压缩
// 	qiniu.compressImage(file, { quality: 0.92, noCompressIfLarger: true, /* maxWidth: 1000, maxHeight: 618 */ }).then(data => {
// 		// qiniu.upload(file: blob, key: string, token: string, putExtra: object, config: object): observable

// 		// upload的putExtra
// 		const putExtra = {
// 			// fname: string，文件原文件名
// 			fname: fileName,
// 			// params: object，用来放置自定义变量
// 			params: {},
// 			// mimeType: null || array，用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
// 			mimeType: null,
// 		};
// 		// upload的config:
// 		const uploadConfig = {
// 			// useCdnDomain: 表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
// 			useCdnDomain: false,
// 			// disableStatisticsReport: 是否禁用日志报告，为布尔值，默认为 false。
// 			disableStatisticsReport: false,
// 			// uphost: 上传 host，类型为 string， 如果设定该参数则优先使用该参数作为上传地址，默认为 null。
// 			uphost: null,
// 			// region: 选择上传域名区域；当为 null 或 undefined 时，自动分析上传域名区域。
// 			region: null,
// 			// retryCount: 上传自动重试次数（整体重试次数，而不是某个分片的重试次数）；默认 3 次（即上传失败后最多重试两次）；目前仅在上传过程中产生 599 内部错误时生效，但是未来很可能会扩展为支持更多的情况。
// 			retryCount: 3,
// 			// concurrentRequestLimit: 分片上传的并发请求量，number，默认为3；因为浏览器本身也会限制最大并发量，所以最大并发量与浏览器有关。
// 			concurrentRequestLimit: 3,
// 			// checkByMD5: 是否开启 MD5 校验，为布尔值；在断点续传时，开启 MD5 校验会将已上传的分片与当前分片进行 MD5 值比对，若不一致，则重传该分片，避免使用错误的分片。读取分片内容并计算 MD5 需要花费一定的时间，因此会稍微增加断点续传时的耗时，默认为 false，不开启。
// 			checkByMD5: false,
// 			// forceDirect: 是否上传全部采用直传方式，为布尔值；为 true 时则上传方式全部为直传 form 方式，禁用断点续传，默认 false。
// 			forceDirect: false,
// 		};
// 		const observable = qiniu.upload(data.dist, fileName, token, putExtra, uploadConfig);
// 		// 上传开始
// 		observable.subscribe({
// 			next(res){
				
// 			},
// 			error(err){
				
// 			},
// 			complete(res){
				
// 			},
// 		});
// 	});
// }