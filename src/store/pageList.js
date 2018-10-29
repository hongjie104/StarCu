'use strict';

import { observable, computed, runInAction } from 'mobx';

export default class PageList {

	constructor() {
		const t = setImmediate(() => {
			this.refresh();
			clearImmediate(t);
		});
	}

	// defaults to true, waiting first refresh.
	@observable
	isFetching = true;

	@observable
	isRefreshing = false;

	@observable
	data = [];

	// count is -1 when we don't know the count.
	@observable
	count = -1;

	@computed
	get isOver() {
		return this.count >= 0 && this.data.length >= this.count;
	}

	refresh = () => {
		this.isRefreshing = true;
		return this.fetch(true);
	}

	fetchMore = () => {
		return this.fetch();
	}

	async fetch(refresh = false) {
		if ((!refresh && this.isFetching) || this.isOver) {
			return;
		}
		const skip = refresh ? 0 : this.data.length;
		this.isFetching = true;

		const { count, results } = await this.fetchData(skip);

		runInAction(() => {
			this.count = count;
			if (refresh) {
				// 完全刷新
				this.data.replace(results);
				// console.log(results);
			} else if (skip === this.data.length) {
				// 检查skip防止重入
				this.data.splice(this.data.length, 0, ...results);
				// console.log(this.data.slice());
			}
			this.isFetching = false;
			this.isRefreshing = false;
		});
	}

	fetchData() {
		console.warn('fetchData() should be overrided!');
		return {
			count: 1000,
			results: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		};
	}
}