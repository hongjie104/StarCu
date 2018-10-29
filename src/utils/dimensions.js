'use strict';

import {
	Platform,
	PixelRatio
} from 'react-native';

const { height, width } = require('Dimensions').get('window');

// ui设计图的宽度是750
const UIPixelRatio = width / 750;

/*
 设备的像素密度，例如：
 PixelRatio.get() === 1          mdpi Android 设备 (160 dpi)
 PixelRatio.get() === 1.5        hdpi Android 设备 (240 dpi)
 PixelRatio.get() === 2          iPhone 4, 4S,iPhone 5, 5c, 5s,iPhone 6,xhdpi Android 设备 (320 dpi)
 PixelRatio.get() === 3          iPhone 6 plus , xxhdpi Android 设备 (480 dpi)
 PixelRatio.get() === 3.5        Nexus 6       */

// iphone6的像素密度
const defaultPixel = 2;
// px转换成dp
const w2 = 750 / defaultPixel;
const h2 = 1334 / defaultPixel;
// 获取缩放比例
const scale = Math.min(height / h2, width / w2);
/**
 * 获取屏幕宽度
 * @return {[type]} [description]
 */
export function screenWidth() {
	return width;
}

/**
 * 获取屏幕高度
 * @return {[type]} [description]
 */
export function screenHeight() {
	return height;
}

/**
 * 转成像素单位
 * @param  {[type]} dp [description]
 * @return {[type]}    [description]
 */
export function toPixels(dp) {
	return PixelRatio.getPixelSizeForLayoutSize(dp);
}

/**
 * 转成dp
 * @param  {[type]} px [description]
 * @return {[type]}    [description]
 */
export function toDips(px) {
	return px * UIPixelRatio;
}

export function getPixelRatio() {
	return PixelRatio.get();
}

/**
 * 获取字体大小
 * @param  {[type]} px 参考图上的像素值
 * @return {[type]}    字体大小
 */
export function getFontSize(px) {
	// return toDips(px) * PixelRatio.get() / 3;
	return toDips(px) + (Platform.OS === 'ios' ? 2 : 4);
	
	// px = Math.round((px * scale + 0.5) * PixelRatio.get() / PixelRatio.getFontScale());
	// return px / defaultPixel;
}
