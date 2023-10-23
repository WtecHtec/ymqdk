// pages/feedback/index.js
import { getMutliLevelProperty } from "../../utils/util"
import { version } from "../../config"
import { subitFeebBack } from "../server/index"
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
		} else {
      this._subitFeebBack(form.fkcontent.value, `${form.score.value}`)
    }
	},

	checkForm(form) { 
		let status = true
		Object.keys(form).forEach(key => {
			if (!form[key].value && form[key].value !== 0) status = false;
		})
		return status
	},

  async _subitFeebBack(desc, score) {
    const [err, res] = await subitFeebBack(desc, score)
    if (!err && res ) {
      if (res.code === 200) {
        wx.showToast({
          title: '反馈成功',
          icon: 'none',
          duration: 2000
        })
      } else if (res.code === 202) {
        wx.showToast({
          title: '24小时内，只能反馈2条',
          icon: 'none',
          duration: 2000
        })
      }
      return
    }
    wx.showToast({
      title: '反馈失败',
      icon: 'none',
      duration: 2000
    })
  }







})