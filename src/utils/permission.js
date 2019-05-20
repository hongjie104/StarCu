'use strict';

import { PermissionsAndroid, Platform } from 'react-native';

// 获取相机权限
export async function requestCameraPermission() {
    if (Platform.OS == 'ios') return true;
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA, {
                'title': '获取相机权限',
                'message': '没有相机权限我不能工作，请授权相机Ï权限',
            }
        )
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        return false;
    }
}
