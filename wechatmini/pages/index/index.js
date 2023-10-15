// index.js
import { getWeatherByLocation } from "../server/index"
import { getMutliLevelProperty } from "../../utils/util"
// 获取应用实例
const app = getApp()

Page({
	data: {
		name: '深圳',
		high: '20',
		location: {
			latitude: 22.55329,
			longitude: 113.88308
		},
		seniverseKey: app.config.seniverseKey,
		isLogin: true || app.store.isLogin,
	},

	onLoad() {
		console.log(app)
		app.bus.on('location', this.getCurentLocation)
	},

	onUnload() {
		app.bus.off('location', this.getCurentLocation)
	},
	onShow() {
		this.data.isLogin && this.getCurentLocation()
	},
	/**
	 * 获取当前位置
	 */
	getCurentLocation() {
		const that = this;
		wx.getLocation({
			type: 'wgs84',
			success: async (res) => {
				const latitude = res.latitude
				const longitude = res.longitude
				// 更新状态
				app.store.locationRight = true;
				// const speed = res.speed
				// const accuracy = res.accuracy
				console.log('res-===', res)
				if (this.data.name) {
					that.setData({
						location: {
							latitude,
							longitude,
						}
					})
					return
				};
				const [name, high] = await that.getWeatherByLocation(this.data.seniverseKey, `${latitude}:${longitude}`)
				that.setData({
					name,
					high,
					location: {
						latitude,
						longitude,
					}
				})
			},
			fail(err) {
				console.log(err)
				that.authorizeLocation()
			}
		})
	},
	/**
	 *  位置 授权
	 */
	authorizeLocation() {
		app.handleAuthorize({
			title: '获取权限',
			content: '为了更好体验，需要获取你的地理位置',
		}, app.authorize.LOCATION_RIGHT, () => {
			app.bus.emit('location')
		})
	},
	/**
	 * 获取当前位置 地点、天气
	 */
	async getWeatherByLocation(seniverseKey, params) {
		const [status, data] = await getWeatherByLocation(seniverseKey, params)
		console.log(status, data)
		if (status === 0) {
			const name = getMutliLevelProperty(data, 'data.results.0.location.name', '')
			const high = getMutliLevelProperty(data, 'data.results.0.daily.0.high', '')
			return [name, high]
		}
		return []
	},

	/**
	 * 跳转 上传记录页
	 */
	async bindGotoRecord() {
		console.log('bindGotoRecord', app.authorize.LOCATION_RIGHT)
		const [status] = await app.checkAuthorize(app.authorize.LOCATION_RIGHT)
		console.log(status)
		if (status === -1) {
			this.authorizeLocation()
		} else {
			const { location } = this.data
			wx.navigateTo({ url: `/pages/recordform/index?location=${JSON.stringify(location)}`, })
		}
	},
	/**
	 * 用户授权、登陆
	 * @param {} e 
	 */
	bindUserProfile(e) {
		// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
		// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
		wx.getUserProfile({
			desc: '用于完善资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
			success: async (res) => {
				console.log(res)
				const nickName = getMutliLevelProperty(res, 'userInfo.nickName', '')
				console.log(nickName)
				wx.showLoading()
				const [status] = await this.handleLogin()
				wx.hideLoading()
			}
		})
	},
	/**
	 * 登陆
	 */
	handleLogin() {
		return new Promise((resolve, reject) => {
			wx.login({
				success: res => {
					// 发送 res.code 到后台换取 openId, sessionKey, unionId
					console.log(res,)
					this.setData({
						isLogin: true,
					})
					resolve([0])
				},
				fail() {
					resolve([-1])
				}
			});
		});
	},
	/**
	 * 反馈
	 */
	bindGoto({ currentTarget }) {
		const type = getMutliLevelProperty(currentTarget, 'dataset.type', '')
		const pageMap = {
			calendar: '/pages/calendar/index',
			fk: `/pages/feedback/index`
		}
		wx.navigateTo({ url: pageMap[type] || `/pages/medal/index`, })
	},


})
