import picker from 'react-native-picker';
import cityJsonArr from './city.json';

// const cityJsonArr = [];

function createCityData() {
	const data = [];
	const len = cityJsonArr.length;
	for (let i = 0; i < len; i++) {
		const city = [];
		for (let j = 0, cityLen = cityJsonArr[i]['city'].length; j < cityLen; j++) {
			const _city = {};
			_city[cityJsonArr[i]['city'][j]['name']] = cityJsonArr[i]['city'][j]['area'];
			city.push(_city);
		}

		const _data = {};
		_data[cityJsonArr[i]['name']] = city;
		data.push(_data);
	}
	return data;
}

picker.init({
	pickerData: createCityData(),
	// selectedValue: ['河北', '唐山', '古冶区'],
	pickerConfirmBtnText: '确定',
	pickerCancelBtnText: '取消',
	pickerTitleText: '城市选择',
	pickerBg: [255, 255, 255, 1],
	onPickerConfirm: pickedValue => {
		console.log('area', pickedValue);
	},
	onPickerCancel: pickedValue => {
		console.log('area', pickedValue);
	},
	onPickerSelect: pickedValue => {
		// picker.select(['山东', '青岛', '黄岛区'])
		console.log('area', pickedValue);
	}
});

export default picker;