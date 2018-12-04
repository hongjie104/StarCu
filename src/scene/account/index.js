'use strict';

import React, { PureComponent } from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableOpacity,
} from 'react-native';
import IncomeIntroduce from './IntroduceModal';
import WithdrawIntroduce from './IntroduceModal';
import { toDips, getFontSize } from '../../utils/dimensions';
import { getAccountInfo } from '../../service';
import toast from '../../utils/toast';

// 账户页面
export default class AccountScene extends PureComponent {
	
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: '账户总额',
	});

	constructor(props) {
		super(props);
		this.state = {
			// 可提现金额
			withdrawableAmount: '0.00',
			// 总收入
			totalAmount: '0.00',
			// 扣款金额
			deductionAmount: '0.00',
			// 待入账金额
			toBeCreditedAmount: '0.00',
		};
	}

	componentWillMount() {
		getAccountInfo().then(result => {
			this.setState({
				...result.datas,
			});
		}).catch(e => {
			toast(e);
		});
	}

	render() {
		const {
			// 可提现金额
			withdrawableAmount,
			// 总收入
			totalAmount,
			// 扣款金额
			deductionAmount,
			// 待入账金额
			toBeCreditedAmount,
		} = this.state;
		const { navigate } = this.props.navigation;
		return (
			<View style={styles.container}>
				<View style={styles.topContainer}>
					<Image style={styles.moneyIcon} source={require('../../imgs/qd.png')} />
					<Text style={styles.title}>
						当前账户总额
					</Text>
					<Text style={styles.numMoneyTxt}>
						¥2000.00
					</Text>
				</View>
				<View style={styles.infoContainer}>
					<View style={styles.infoCell}>
						<Text style={styles.infoKey}>
							累计收入
						</Text>
						<Text style={styles.infoVal}>
							¥{ totalAmount }
						</Text>
					</View>
					<View style={styles.infoCell}>
						<View style={styles.infoKeyRow}>
							<Text style={styles.infoKey}>
								可提现
							</Text>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									this._withdrawIntroduce.show();
								}}
							>
								<Image style={styles.questionImg} source={require('../../imgs/wh.png')} />
							</TouchableOpacity>
						</View>
						<Text style={styles.infoVal}>
							¥{ withdrawableAmount }
						</Text>
					</View>
					<View style={styles.infoCell}>
						<Text style={styles.infoKey}>
							累计扣款
						</Text>
						<Text style={styles.infoVal}>
							¥{ deductionAmount }
						</Text>
					</View>
					<View style={styles.infoCell}>
						<View style={styles.infoKeyRow}>
							<Text style={styles.infoKey}>
								待入账
							</Text>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									this._incomeIntroduce.show();
								}}
							>
								<Image style={styles.questionImg} source={require('../../imgs/wh.png')} />
							</TouchableOpacity>
						</View>
						<Text style={styles.infoVal}>
							¥{ toBeCreditedAmount }
						</Text>
					</View>
				</View>
				{
					// 其他项目
				}
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						navigate({
							routeName: 'AccountDetailScene',
						});
					}}
					style={[styles.itemContainer, { marginTop: toDips(24), borderTopWidth: 1 }]}
				>
					<View style={styles.itemLeftContainer}>
						<Image style={styles.itemImg} source={require('../../imgs/dzls.png')} />
						<Text style={styles.itemTxt}>
							对账流水
						</Text>
					</View>
					<Image style={styles.arrowImg} source={require('../../imgs/jt.png')} />
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						navigate({
							routeName: 'HelperScene',
							params: {
								url: 'http://101.132.113.94/accountCenter.html',
								title: '常见问题',
							},
						});
					}}
					style={styles.itemContainer}
				>
					<View style={styles.itemLeftContainer}>
						<Image style={styles.itemImg} source={require('../../imgs/cjwt.png')} />
						<Text style={styles.itemTxt}>
							常见问题
						</Text>
					</View>
					<Image style={styles.arrowImg} source={require('../../imgs/jt.png')} />
				</TouchableOpacity>
				{
					// 提现按钮
				}
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						navigate({
							routeName: 'WithdrawScene',
						});
					}}
					style={styles.submitBtn}
				>
					<Text style={styles.submitBtnTxt}>
						提现
					</Text>
				</TouchableOpacity>
				<IncomeIntroduce
					ref={c => this._incomeIntroduce = c}
					title='待入账金额'
					content='任务完成后，钱款自动转入待入账金额。完成的任务通过发布方审核通过后，待入账金额即转为可提现金额，可立即提现到银行卡。'
				/>
				<WithdrawIntroduce
					ref={c => this._withdrawIntroduce = c}
					title='可提现金额'
					content='钱包账户中实际可提现的金额'
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FBFBFB',
	},
	topContainer: {
		height: toDips(279),
		backgroundColor: '#DD4124',
		alignItems: 'center',
	},
	moneyIcon: {
		width: toDips(59),
		height: toDips(70),
		marginTop: toDips(30),
	},
	title: {
		fontSize: getFontSize(28),
		// fontWeight: '500',
		color: 'white',
		opacity: 0.8,
		marginTop: toDips(28),
	},
	numMoneyTxt: {
		fontSize: getFontSize(48),
		// fontWeight: '500',
		color: 'white',
		marginTop: toDips(22),
	},
	infoContainer: {
		flexDirection: 'row',
		height: toDips(134),
		backgroundColor: 'white',
		borderColor: '#DCDCDC',
		borderTopWidth: 1,
		borderBottomWidth: 1,
	},
	infoCell: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	infoKeyRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	infoKey: {
		fontSize: getFontSize(28),
		// fontWeight: '500',
		color: '#333',
	},
	infoVal: {
		fontSize: getFontSize(28),
		// fontWeight: '500',
		color: '#DD4124',
		marginTop: toDips(18),
	},
	questionImg: {
		width: toDips(29),
		height: toDips(29),
		marginLeft: toDips(16),
	},
	itemContainer: {
		height: toDips(110),
		backgroundColor: 'white',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderColor: '#E0E0E0',
		borderBottomWidth: 1,
	},
	itemLeftContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	itemImg: {
		width: toDips(60),
		height: toDips(60),
		marginLeft: toDips(29),
	},
	itemTxt: {
		fontSize: getFontSize(30),
		// fontWeight: '500',
		color: '#3E3E3E',
		marginLeft: toDips(32),
	},
	arrowImg: {
		width: toDips(18),
		height: toDips(34),
		marginRight: toDips(32),
	},
	submitBtn: {
		alignSelf: 'center',
		width: toDips(391),
		height: toDips(82),
		backgroundColor: '#DD4124',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: toDips(41),
		marginTop: toDips(96),
	},
	submitBtnTxt: {
		fontSize: getFontSize(32),
		// fontWeight: '500',
		color: 'white',
	},
});
