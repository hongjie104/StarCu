'use strict';

const timeStrings = {
	seconds: "1分钟前",
	minute: "1分钟前",
	minutes: "%d分钟前",
	hour: "1小时前",
	hours: "%d小时前",
	day: "1天前",
	days: "%d天前",
	month: "1个月前",
	months: "%d月前",
	year: "1年前",
	years: "%d年前"
};

export function timeAgo(timestamp) {
	let seconds = Math.floor((new Date().getTime() - timestamp) / 1000);
	let minutes = seconds / 60;
	let hours = minutes / 60;
	let days = hours / 24;
	let years = days / 365;

	function substitute (string, number) {
		return string.replace(/%d/i, number);
	}

	let words = seconds < 45 && substitute(timeStrings.seconds, Math.round(seconds)) ||
		seconds < 90 && substitute(timeStrings.minute, 1) ||
		minutes < 45 && substitute(timeStrings.minutes, Math.round(minutes)) ||
		minutes < 90 && substitute(timeStrings.hour, 1) ||
		hours < 24 && substitute(timeStrings.hours, Math.round(hours)) ||
		hours < 48 && substitute(timeStrings.day, 1) ||
		days < 30 && substitute(timeStrings.days, Math.floor(days)) ||
		days < 60 && substitute(timeStrings.month, 1) ||
		days < 365 && substitute(timeStrings.months, Math.floor(days / 30)) ||
		years < 2 && substitute(timeStrings.year, 1) ||
		substitute(timeStrings.years, Math.floor(years));

	return words;
}

export function formatDateTime(date: Date = new Date(), fmt: String = 'yyyy-MM-dd hh:mm:ss'/*, judgeDoday: Boolean = true*/) {
	const o = {
		// 月份
		"M+": date.getMonth() + 1,
		// 日
		"d+": date.getDate(),
		// 小时
		"h+": date.getHours(),
		// 分
		"m+": date.getMinutes(),
		// 秒
		"s+": date.getSeconds(),
		// 季度
		// "q+": Math.floor((date.getMonth() + 3) / 3),
		// 毫秒
		"S": date.getMilliseconds()
	};
	// if (judgeDoday && fmt.indexOf(' ') !== -1) {
	// 	const now = new Date();
	// 	if (now.getDate() === o['d+'] && now.getMonth() + 1 === o['M+'] && now.getFullYear() === date.getFullYear()) {
	// 		fmt = fmt.split(' ')[1];
	// 	} else {
	// 		fmt = fmt.split(' ')[0];
	// 	}
	// }
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (let k in o) {
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	}
	return fmt;
}
