'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Modal,
	Text,
	PanResponder,
} from 'react-native';
import { toDips, getFontSize } from '../../utils/dimensions';

// 说明弹窗
export default class IntroduceModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
			visible: false,
		};
	}

	componentWillMount() {
		this._panResponder = PanResponder.create({
			// 要求成为响应者：
			onStartShouldSetPanResponder: (evt, gestureState) => true,
			onStartShouldSetPanResponderCapture: (evt, gestureState) => true,

			onPanResponderTerminationRequest: (evt, gestureState) => true,
			onPanResponderRelease: (evt, gestureState) => {
				// 用户放开了所有的触摸点，且此时视图已经成为了响应者。
				// 一般来说这意味着一个手势操作已经成功完成。
				this.hide();
			},
			onPanResponderTerminate: (evt, gestureState) => {
				// 另一个组件已经成为了新的响应者，所以当前手势将被取消。
				this.hide();
			},
		});
	}

	show() {
		if (!this.state.visible) {
			this.setState({
				visible: true,
			});
		}
	}

	hide() {
		if (this.state.visible) {
			this.setState({
				visible: false,
			});
		}
	}

	render() {
		const { visible } = this.state;
		const { title, content } = this.props;
		return (
			<Modal
				animationType="fade"
				transparent={true}
				visible={visible}
				onRequestClose={() => {
					alert("Modal has been closed.");
				}}
			>
				<View style={styles.container} {...this._panResponder.panHandlers}>
					<View style={styles.modal}>
						<Text style={styles.titleTxt}>
							{ title }
						</Text>
						<View style={styles.line} />
						<Text style={styles.content}>
							{ content }
						</Text>
						<View style={styles.okBtn}>
							<Text style={styles.okBtnTxt}>
								好的
							</Text>
						</View>
					</View>
				</View>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modal: {
		width: toDips(513),
		backgroundColor: 'white',
		borderRadius: toDips(12),
		alignItems: 'center',
	},
	titleTxt: {
		fontSize: getFontSize(30),
		fontWeight: '500',
		color: 'black',
		marginTop: toDips(26),
	},
	line: {
		width: toDips(513),
		height: 1,
		backgroundColor: '#D9D9D9',
		marginTop: toDips(22),
	},
	content: {
		width: toDips(456),
		fontSize: getFontSize(30),
		fontWeight: '500',
		color: 'black',
		marginTop: toDips(37),
		lineHeight: toDips(40),
	},
	okBtn: {
		width: toDips(223),
		height: toDips(60),
		backgroundColor: '#DD4124',
		borderRadius: toDips(30),
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: toDips(57),
		marginBottom: toDips(43),
	},
	okBtnTxt: {
		fontSize: getFontSize(28),
		fontWeight: '500',
		color: 'white',
	},
});
