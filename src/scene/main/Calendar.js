'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Image,
	Platform,
	ScrollView,
} from 'react-native';
import picker from 'react-native-picker';
import MissionItem from '../../component/MissionItem';
import { toDips, getFontSize } from '../../utils/dimensions';
import toast from '../../utils/toast';
import { getMissionCalendar } from '../../service';
import { formatDateTime } from '../../utils/datetime';

export default class Calendar extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			curYear: 2018,
			curMonth: 10,
			curDate: 1,
			nowYear: 2018,
			nowMonth: 10,
			nowDate: 30,
			// 日期数组，是个二维的
			dateArr: [],
			// 当前选中的日期下的任务列表
			selectedMissionDataArr: [],
		};
	}

	componentDidMount() {
		const now = new Date();
		const minYear = now.getFullYear() - 5;
		const maxYear = now.getFullYear() + 5;
		const yearArr = []
		for (let i = minYear; i < maxYear; i++) {
			yearArr.push(i);
		}
		picker.init({
			pickerData: [yearArr, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
			selectedValue: [now.getFullYear(), now.getMonth() + 1],
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '日期选择',
			pickerBg: [255, 255, 255, 1],
			onPickerConfirm: data => {
				this.updateDate(new Date(data[0], data[1] - 1, 1));
			},
		});
		this.setState({
			nowYear: now.getFullYear(),
			nowMonth: now.getMonth() + 1,
			nowDate: now.getDate(),
		}, () => {
			this.updateDate();
		});
	}

	componentWillUnmount() {
		picker.hide();
	}

	getMissionData(year, month, date, missionArr) {
		for (var i = 0; i < missionArr.length; i++) {
			if (missionArr[i].year === year) {
				if (missionArr[i].month === month) {
					if (missionArr[i].date === date) {
						return missionArr[i].missionArr;
					}
				}
			}
		}
	}

	updateDate(now = new Date()) {
		const curYear = now.getFullYear();
		const curMonth = now.getMonth() + 1;
		const curDate = now.getDate();

		let tmpDate = new Date(curYear, curMonth - 1, 1);
		const firstDateTime = tmpDate.getTime();
		// 算出当月1号是星期几
		const weekFirstDate = tmpDate.getDay();
		// 算出当月的天数
		tmpDate.setMonth(tmpDate.getMonth() + 1);
		tmpDate.setDate(0);
		const days = tmpDate.getDate();

		// 获取数据
		getMissionCalendar(formatDateTime(new Date(firstDateTime), 'yyyy-MM-dd'), formatDateTime(tmpDate, 'yyyy-MM-dd')).then(result => {
			const { taskCalendar } = result.datas;
			const missionArr = taskCalendar.map(missionData => {				
				const dateArr = missionData.date.split('-');
				return {
					year: parseInt(dateArr[0]),
					month: parseInt(dateArr[1]),
					date: parseInt(dateArr[2]),
					// status 状态（0：无任务  1：已完成  2：未完成)
					missionArr: missionData.taskList,
				};
			});
			const dateArr = [];
			let dateRow = [];
			let dayCounter = 1;
			// 第一周
			for (let i = 0; i < 7; i++) {
				if (i < weekFirstDate) {
					// 上个月的日期
					tmpDate = new Date(curYear, curMonth - 1, i - weekFirstDate + 1);
					dateRow[i] = {
						date: tmpDate.getDate(),
						month: tmpDate.getMonth() + 1,
						year: tmpDate.getFullYear(),
						misssionData: this.getMissionData(tmpDate.getFullYear(), tmpDate.getMonth() + 1, tmpDate.getDate(), missionArr),
					};
				} else {
					dateRow[i] = {
						date: dayCounter,
						month: curMonth,
						year: curYear,
						misssionData: this.getMissionData(curYear, curMonth, dayCounter++, missionArr),
					};
				}
			}
			dateArr[0] = dateRow;
			// 第N周（N > 1）
			while (dayCounter <= days) {
				dateRow = [];
				for (let i = 0; i < 7; i++) {
					if (dayCounter <= days) {
						dateRow[i] = {
							date: dayCounter,
							month: curMonth,
							year: curYear,
							misssionData: this.getMissionData(curYear, curMonth, dayCounter++, missionArr),
						};
					} else {
						// 下个月的日期
						tmpDate = new Date(curYear, curMonth - 1, dayCounter++);
						dateRow[i] = {
							date: tmpDate.getDate(),
							month: tmpDate.getMonth() + 1,
							year: tmpDate.getFullYear(),
							misssionData: this.getMissionData(tmpDate.getFullYear(), tmpDate.getMonth() + 1, tmpDate.getDate(), missionArr),
						};
					}
				}
				dateArr.push(dateRow);   
			}
			this.setState({
				curYear,
				curMonth,
				curDate,
				dateArr,
			});
		}).catch(e => {
			toast(e);
		});
	}

	onShowDatePicker() {
		if (!picker.isPickerShow()) {
			picker.show();
		}
	}

	onDatePress(missionDataArr) {
		this.setState({
			selectedMissionDataArr: missionDataArr || [],
		});
	}

	render() {
		const {
			curDate,
			curMonth,
			curYear,
			nowDate,
			nowMonth,
			nowYear,
			dateArr,
			selectedMissionDataArr,
		} = this.state;
		return (
			<View style={styles.container}>
				{
					Platform.OS !== 'ios' && (<View style={styles.androidPatch} />)
				}
				<View style={styles.calendarContainer}>
					{
						// 年月选择容器
					}
					<View style={styles.yearAndMonthSelector}>
						{
							// 年选择器
						}
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => {
								this.onShowDatePicker();
							}}
							style={styles.selector}
						>
							<Text style={styles.selectorTxt}>
								{ curYear }年
							</Text>
							{
								// <Image style={styles.arrowDownImg} source={require('../../imgs/xl.png')} />
							}
						</TouchableOpacity>
						{
							// 月选择器
						}
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => {
								this.onShowDatePicker();
							}}
							style={[styles.selector, { marginLeft: toDips(74) }]}
						>
							{
								// <Image style={styles.arrowSelectorImg} source={require('../../imgs/z.png')} />
							}
							<Text style={styles.selectorTxt}>
								{ curMonth }月
							</Text>
							{
								// <Image style={styles.arrowSelectorImg} source={require('../../imgs/y.png')} />
							}
						</TouchableOpacity>
						{
							// 查看按钮
						}
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => {
								this.onShowDatePicker();
							}}
							style={styles.lookUpBtn}
						>
							<Text style={styles.lookUpBtnTxt}>
								选择
							</Text>
						</TouchableOpacity>
					</View>
					{
						// 日历内容
					}
					<View style={styles.calendarContentContainer}>
						{
							// 星期
						}
						<View style={styles.calendarContentRow}>
							<Text style={styles.calendarWeekTxt}>日</Text>
							<Text style={styles.calendarWeekTxt}>一</Text>
							<Text style={styles.calendarWeekTxt}>二</Text>
							<Text style={styles.calendarWeekTxt}>三</Text>
							<Text style={styles.calendarWeekTxt}>四</Text>
							<Text style={styles.calendarWeekTxt}>五</Text>
							<Text style={styles.calendarWeekTxt}>六</Text>
						</View>
						{
							// 日期
							dateArr.map((dateRow, i) => {
								return (
									<View key={`dateRow${i}`} style={styles.calendarContentDateRow}>
										{
											dateRow.map((dateData, j) => (
												<View
													key={`date${j}`}
													style={[
														styles.calendarDateContainer,
														dateData.misssionData && dateData.misssionData.length > 0 ? (
															nowYear > dateData.year ? styles.calendarPassDateContainer : (
																nowYear < dateData.year ? styles.calendarFutureDateContainer : (
																	nowMonth > dateData.month ? styles.calendarPassDateContainer : (
																		nowMonth < dateData.month ? styles.calendarFutureDateContainer : (
																			nowDate > dateData.date ? styles.calendarPassDateContainer : (
																				nowDate < dateData.date ? styles.calendarFutureDateContainer : (
																					styles.calendarCurDateContainer
																				)
																			)		
																		)
																	)
																)
															)
														) : null,
													]}
												>
													<Text
														style={[
															styles.calendarDateTxt,
															curMonth !== dateData.month ? styles.calendarDateTxtNotThisMonth : null,
														]}
														onPress={() => {
															this.onDatePress(dateData.misssionData);
														}}
													>
														{ dateData.date }
													</Text>
												</View>
											))
										}
									</View>
								);
							})
						}
					</View>
					{
						// 分割线
					}
					<View style={styles.calendarLine} />
					{
						// 标识说明
					}
					<View style={styles.infoContainer}>
						<View style={styles.infoIcon} />
						<Text style={styles.infoTxt}>
							过去
						</Text>
						<View style={[styles.infoIcon, { marginLeft: toDips(40), backgroundColor: '#F06292' }]} />
						<Text style={styles.infoTxt}>
							现在
						</Text>
						<View style={[styles.infoIcon, { marginLeft: toDips(40), backgroundColor: '#FFC108' }]} />
						<Text style={styles.infoTxt}>
							未来
						</Text>
					</View>
				</View>
				<ScrollView style={styles.container}>
					{
						selectedMissionDataArr.map((m, i) => (
							<MissionItem key={i} item={m} type={0} navigation={this.props.navigation} />
						))
					}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	androidPatch: {
		height: toDips(36),
		backgroundColor: '#DD4124',
	},
	calendarContainer: {
		width: toDips(706),
		borderColor: '#D1D1D1',
		borderWidth: 1,
		borderRadius: toDips(9),
		alignSelf: 'center',
		marginTop: toDips(30),
	},
	yearAndMonthSelector: {
		flexDirection: 'row',
		marginTop: toDips(32),
	},
	selector: {
		flexDirection: 'row',
		width: toDips(168),
		height: toDips(57),
		borderColor: '#AAA',
		borderWidth: 1,
		borderRadius: toDips(7),
		marginLeft: toDips(56),
		alignItems: 'center',
		justifyContent: 'center',
	},
	selectorTxt: {
		fontSize: getFontSize(26),
		// fontWeight: '500',
		color: '#333',
	},
	arrowDownImg: {
		width: toDips(22),
		height: toDips(13),
		marginLeft: toDips(20),
	},
	arrowSelectorImg: {
		width: toDips(12),
		height: toDips(20),
		marginLeft: toDips(14),
		marginRight: toDips(14),
	},
	lookUpBtn: {
		width: toDips(121),
		height: toDips(57),
		backgroundColor: '#DD4124',
		borderRadius: toDips(7),
		marginLeft: toDips(57),
		justifyContent: 'center',
		alignItems: 'center',
	},
	lookUpBtnTxt: {
		fontSize: getFontSize(26),
		// fontWeight: '500',
		color: '#FFF',
	},
	calendarContentContainer: {
		width: toDips(599),
		alignSelf: 'center',
		marginTop: toDips(41),
	},
	calendarContentRow: {
		flexDirection: 'row',
	},
	calendarContentDateRow: {
		flexDirection: 'row',
		marginTop: toDips(34),
	},
	calendarWeekTxt: {
		fontSize: getFontSize(22),
		fontWeight: '400',
		color: 'black',
		width: toDips(71),
		marginRight: toDips(17),
		textAlign: 'center',
	},
	calendarDateContainer: {
		width: toDips(71),
		height: toDips(71),
		marginRight: toDips(17),
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: toDips(35.5),
		backgroundColor: 'transparent',
	},
	calendarFutureDateContainer: {
		backgroundColor: '#FFC108',
	},
	calendarPassDateContainer: {
		backgroundColor: '#BCBCBC',
	},
	calendarCurDateContainer: {
		backgroundColor: '#F06292',
	},
	calendarDateTxt: {
		fontSize: getFontSize(32),
		color: 'black',
		fontWeight: '400',
	},
	// 不是当前月的日期
	calendarDateTxtNotThisMonth: {
		color: 'rgba(0,0,0,0.7)',
	},
	calendarLine: {
		width: toDips(633),
		height: 1,
		backgroundColor: '#E4E4E4',
		alignSelf: 'center',
		marginTop: toDips(22),
	},
	infoContainer: {
		flexDirection: 'row',
		marginTop: toDips(33),
		marginBottom: toDips(38),
	},
	infoIcon: {
		width: toDips(24),
		height: toDips(24),
		backgroundColor: '#BCBCBC',
		borderRadius: toDips(12),
		marginLeft: toDips(35),
	},
	infoTxt: {
		fontSize: getFontSize(22),
		// fontWeight: '500',
		color: '#333',
		marginLeft: toDips(18),
	},
});
