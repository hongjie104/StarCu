import { NativeModules } from 'react-native';

const { MeiQiaModule } = NativeModules;

export function open() {
	MeiQiaModule.open();
}

export function setClientInfo(data, onSuccess, onFail) {
	MeiQiaModule.setClientInfo(data).then(onSuccess).catch(onFail);
}