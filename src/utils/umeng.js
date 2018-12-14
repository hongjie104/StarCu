import { NativeModules } from 'react-native';

const { UMengModule } = NativeModules;

export function onEvent(eventId) {
	UMengModule.onEvent(eventId);
}

export function onEventWithLabel(eventId, eventLabel) {
	UMengModule.onEvent(eventId, eventLabel);
}