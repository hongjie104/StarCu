'use strict';

import DeviceInfo from 'react-native-device-info';
import {
	Platform
} from 'react-native';

export function isIOS() {
	return Platform.OS === "ios";
}

/**
 * Gets the application name
 */
export function getApplicationName() {
	return DeviceInfo.getApplicationName();
}

/**
 * Gets the battery level of the device as a float comprised between 0 and 1.
 * @return {Promise<number>}
 */
export function getBatteryLevel() {
	return DeviceInfo.getBatteryLevel()
}

/**
 * Gets the device brand.
 * @return {string}
 */
export function getBrand() {
	return DeviceInfo.getBrand();
}

/**
 * Gets the application build number
 * @return {string}
 */
export function getBuildNumber() {
	return DeviceInfo.getBuildNumber();
}

/**
 * Gets the application bundle identifier.
 * "com.learnium.mobile"
 * @return {string}
 */
export function getBundleId() {
	return DeviceInfo.getBundleId();
}

/**
 * Gets the carrier name (network operator)
 * @return {string}
 */
export function getCarrier() {
	return DeviceInfo.getCarrier();
}

/**
 * Gets the device country based on the locale information
 * @return {string}
 */
export function getDeviceCountry() {
	return DeviceInfo.getDeviceCountry();
}

/**
 * Gets the device ID.
 * iOS: "iPhone7,2"
 * Android: "goldfish"
 * @return {string}
 */
export function getDeviceId() {
	return DeviceInfo.getDeviceId();
}

/**
 * Gets the device locale.
 * iOS: "en"
 * Android: "en-US"
 * @return {string}
 */
export function getDeviceLocale() {
	return DeviceInfo.getDeviceLocale();
}

/**
 * Gets the device name
 * @return {string}
 */
export function getDeviceName() {
	return DeviceInfo.getDeviceName();
}

/**
 * Gets the device font scale. 
 * The font scale is the ratio of the current system font to the "normal" font size, 
 * so if normal text is 10pt and the system font is currently 15pt, 
 * the font scale would be 1.5 This can be used to determine if accessability settings has been changed for the device; 
 * you may want to re-layout certain views if the font scale is significantly larger ( > 2.0 )
 * @return {number}
 */
export function getFontScale() {
	return DeviceInfo.getFontScale();
}

/**
 * Gets available storage size, in bytes.
 * @return {number}
 */
export function getFreeDiskStorage() {
	return DeviceInfo.getFreeDiskStorage();
}

/**
 * Gets the device current IP address.
 * android only
 * @return {Promise<string>}
 */
export function getIPAddress() {
	return DeviceInfo.getIPAddress();
}





/**
 * @return {string}
 */
export function getManufacturer() {
	return DeviceInfo.getManufacturer();
}

/**
 * @return {string}
 */
export function getModel() {
	return DeviceInfo.getModel();
}

/**
 * @return {string}
 */
export function getReadableVersion() {
	return DeviceInfo.getReadableVersion();
}

/**
 * @return {string}
 */
export function getSystemName() {
	return DeviceInfo.getSystemName();
}

/**
 * @return {string}
 */
export function getSystemVersion() {
	return DeviceInfo.getSystemVersion();
}

/**
 * @return {string}
 */
export function getTimezone() {
	return DeviceInfo.getTimezone();
}

/**
 * @return {number}
 */
export function getTotalDiskCapacity() {
	return DeviceInfo.getTotalDiskCapacity();
}

/**
 * @return {number}
 */
export function getTotalMemory() {
	return DeviceInfo.getTotalMemory();
}

/**
 * @return {string}
 */
export function getUniqueID() {
	return DeviceInfo.getUniqueID();
}

/**
 * @return {string}
 */
export function getUserAgent() {
	return DeviceInfo.getUserAgent();
}

/**
 * @return {string}
 */
export function getVersion() {
	return DeviceInfo.getVersion();
}

/**
 * @return {boolean}
 */
export function is24Hour() {
	return DeviceInfo.is24Hour();
}

/**
 * @return {boolean}
 */
export function isEmulator() {
	return DeviceInfo.isEmulator();
}

/**
 * Tells if a PIN number or a fingerprint was set for the device
 * @return {(callback)boolean}
 */
export function isPinOrFingerprintSet() {
	return DeviceInfo.isPinOrFingerprintSet()(isPinOrFingerprintSet => {
		if (isPinOrFingerprintSet) {

		} else {

		}
	});
}

/**
 * Tells if the device is a tablet
 * @return {boolean}
 */
export function isTablet() {
	return DeviceInfo.isTablet();
}
