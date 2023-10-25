// pages/formresult/index.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		iconImg: '../../images/index/icon-05.png',
		txt: '记录成功'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {

	},

	bindGoto() {
		wx.reLaunch({
			url: '/pages/index/index'
		})
	},
})