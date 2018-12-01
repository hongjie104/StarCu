'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	ScrollView,
} from 'react-native';
import { toDips, getFontSize } from '../../utils/dimensions';
import { getBill } from '../../service';
import toast from '../../utils/toast';
import Spinner from '../../component/Spinner';

// 对账流水
export default class AccountDetail extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '对账流水',
	});

	constructor(props) {
		super(props);
		this.state = {
			/*
				date 日期
				amount 金额
				proName 项目名称
				billNo 流水号
				typeDes 类型
			 */
			billArr: [],
			loading: true,
		};
	}

	componentWillMount() {
		getBill().then(result => {
			this.setState({
				billArr: result.datas.bills,
				loading: false,
			});
		}).catch(e => {
			toast(e);
		})
	}

	render() {
		const { billArr, loading } = this.state;
		console.warn(billArr);
		if (loading) {
			return <Spinner />;
		}
		return (
			<View style={styles.container}>
				{
					billArr.length === 0 && (
						<Image style={styles.emptyImg} source={require('../../imgs/empty.png')} />
					)
				}
				<ScrollView style={styles.container}>
					{
						billArr.map((bill, i) => (
							<View style={styles.itemContainer} key={i}>
								<View style={styles.itemTitle}>
									<Text style={styles.titleTxt}>
										流水号：{ bill.billNo }
									</Text>
									<Text style={styles.titleTxt}>
										{
											bill.state === '0' ? '审核中' : (bill.state === '1' ? '审核通过' : '审核失败')
										}
									</Text>
								</View>
								<Text style={styles.contentTxt}>
									收入：{ bill.amount }元
								</Text>
								{
									bill.salesDeduction && (
										<Text style={styles.contentTxt}>
											扣款：{ bill.salesDeduction }元
										</Text>
									)
								}
								<Text style={styles.contentTxt}>
									项目名称：{ bill.proName }
								</Text>
								<Text style={styles.contentTxt}>
									发生日期：{ bill.date }
								</Text>
							</View>
						))
					}
				</ScrollView>
				{
					// <View style={styles.itemContainer}>
					// 	<View style={styles.itemTitle}>
					// 		<Text style={styles.titleTxt}>
					// 			流水号：2018010199912
					// 		</Text>
					// 		<Text style={styles.titleTxt}>
					// 			收入：200元
					// 		</Text>
					// 	</View>
					// 	<Text style={styles.contentTxt}>
					// 		任务号：1021112011223
					// 	</Text>
					// 	<Text style={styles.contentTxt}>
					// 		项目名称：清风项目
					// 	</Text>
					// 	<Text style={styles.contentTxt}>
					// 		执行门店：南平门店
					// 	</Text>
					// 	<Text style={styles.contentTxt}>
					// 		发生日期：2018/01/01  15:10
					// 	</Text>
					// </View>
					// <View style={styles.itemContainer}>
					// 	<View style={styles.itemTitle}>
					// 		<Text style={styles.titleTxt}>
					// 			流水号：2018010199912
					// 		</Text>
					// 		<Text style={styles.titleTxt}>
					// 			收入：200元
					// 		</Text>
					// 	</View>
					// 	<Text style={styles.contentTxt}>
					// 		提现：100.00
					// 	</Text>
					// 	<Text style={styles.contentTxt}>
					// 		发生日期：2018/01/01  15:10
					// 	</Text>
					// </View>
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FBFBFB',
	},
	itemContainer: {
		backgroundColor: 'white',
		width: toDips(750),
		padding: toDips(32),		
		borderColor: '#DCDCDC',
		borderBottomWidth: 1,
	},
	itemTitle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	titleTxt: {
		fontSize: getFontSize(30),
		// fontWeight: '500',
		color: '#333',
	},
	contentTxt: {
		fontSize: getFontSize(30),
		// fontWeight: '500',
		color: '#999',
		marginTop: toDips(27),
	},
	emptyImg: {
		width: toDips(283),
		height: toDips(292),
		marginLeft: toDips(267),
		marginTop: toDips(250),
	},
});
