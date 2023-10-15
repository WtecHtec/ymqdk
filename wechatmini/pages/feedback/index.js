// pages/feedback/index.js
import { getMutliLevelProperty } from "../../utils/util"
import { version } from "../../config"
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		form: {
			score: {
				value: 0
			},
			fkcontent: {
				value: ''
			},
		},
		version: version,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {

	},
	bindFormItemData({ detail, currentTarget }) {
		const value = getMutliLevelProperty(detail, 'value', -1)
		const key = getMutliLevelProperty(currentTarget, 'dataset.key', '')
		if (!value || !key) return
		const update = {}
		update[`form.${key}.value`] = value
		this.setData({
			...update,
		})
	},

	bindFk() {
		const { form } = this.data;
		console.log(form)
		if (!this.checkForm(form)) {
			wx.showToast({
				title: '请完成信息填写!',
				icon: 'none',
				duration: 2000
			})
			return;
		}
	},

	checkForm(form) {
		let status = true
		Object.keys(form).forEach(key => {
			if (!form[key].value && form[key].value !== 0) status = false;
		})
		return status
	},







})