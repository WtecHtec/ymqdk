// index.js
import { getWeatherByLocation, postCheckLogin, postLogin, getArenaAll, getEmojAll, getRecordByYear } from "../server/index"
import { getMutliLevelProperty } from "../../utils/util"
import { setCacheByKey } from "../../utils/storage"
import { formatDate } from "../../utils/date"
import { CACHE_AUTH_TOKEN, IMG_FIX_URL } from "../../config"
// 获取应用实例
const app = getApp()

Page({
	data: {
		name: '深圳',
		high: '20',
		location: {
			latitude: 22.54286,
			longitude: 114.05956
		},
		seniverseKey: app.config.seniverseKey,
		isLogin: true || app.store.isLogin,
		markerDatas: [],
		belongs: ['深圳'],
		arenaBelong: '深圳',
    emojDatas: [],
    hasInit: false,
	},

	onLoad() {
		console.log(app)
		app.bus.on('location', this.getCurentLocation)
		this.checkLoin()
	},

	onUnload() {
		app.bus.off('location', this.getCurentLocation)
	},
	onShow() {
		this.getCurentLocation()
	},
	/**
	 * 获取当前位置
	 */
	getCurentLocation() {
		const that = this;
		const { belongs } = this.data;
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
        that.setData({
          location: {
            latitude,
            longitude,
          }
        }, () => {
          this.setLocationToApp()
        })
        // 避免重复请求接口
				if (this.data.name) {
					return
				};
				const [name, high] = await that.getWeatherByLocation(this.data.seniverseKey, `${latitude}:${longitude}`)
				const belong = that.checkBelongs(name, belongs)
				if (!belong) {
					wx.showToast({
						title: '当前地区尚未更新数据,请谅解!',
						icon: 'error',
						duration: 2000
					})
				} else {
          app.store.arenaBelong = belong
        }
				that.setData({
					name,
					high,
					arenaBelong: belong,
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
	bindGotoRecord() {
		this.handleGotoRecord()
	},
	/**
	 * 跳转 上传记录页
	 */
	async handleGotoRecord() {
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
				this.nickName = nickName;
				wx.showLoading()
				await this.handleLogin()
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
					this.handLogin(res.code, this.nickName)
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

	/**
	 *  检测登陆
	 */
	async checkLoin() {
		const [err, res] = await postCheckLogin();
		if (!err && res) {
			let isLogin = false
			if (res.code === 200) {
				isLogin = true
			}
			this.setData({ isLogin }, () => {
				this.InitData()
			})
		} else {
			wx.showToast({
				title: '服务异常',
				icon: 'error',
				duration: 2000
			})
			this.setData({ isLogin: false })
		}
	},
	/**
	 * 登陆
	 * @param {} code 
	 * @param {*} avatarUrl 
	 * @param {*} nickName 
	 */
	async handLogin(code, nickName) {
		const [err, res] = await postLogin(code, nickName);
		if (!err && res && res.code === 200) {
			setCacheByKey(CACHE_AUTH_TOKEN, res.minikey)
			this.setData({ isLogin: true }, () => {
				this.InitData()
			})
		} else {
			wx.showToast({
				title: '服务异常',
				icon: 'error',
				duration: 2000
			})
		}
	},
	/**
	 * 判断是否在 数据地区中
	 */
	checkBelongs(arena, belongs) {
		if (!Array.isArray(belongs) || !belongs.length) return false
		for (let i = 0; i < belongs.length; i++) {
			if (arena.indexOf(belongs[i]) !== -1) return belongs[i]
		}
		return false
	},
	/**
	 *  初始化数据
	 */
	async InitData() {
		this.mapCtx = wx.createMapContext('ymqMapId')
    const yRecordMap = await this.getRecordDataByYear();
    const emojMap = await this.getEmojAllDatas();
		const arenaDatas = await this.getArenas();
    this.updateMapMarkers(arenaDatas, yRecordMap, emojMap);
    this.setData({
      hasInit: true,
    })
	},
	async getArenas() {
		const { arenaBelong } = this.data;
		if (!arenaBelong) return
		const [err, res] = await getArenaAll(arenaBelong)
		const data = getMutliLevelProperty(res, 'data', [])
    let arenaDatas = []
		if (!err && res && res.code === 200 && Array.isArray(data) && data.length) {
      arenaDatas = [...data]
			// this.setData({ markerDatas })
		}
    return arenaDatas
	},

  async getEmojAllDatas() {
    const [err, res] =  await getEmojAll()
    const data = getMutliLevelProperty(res, 'data', [])
    const emojMap = {}
		if (!err && res && res.code === 200 && Array.isArray(data) && data.length) {
     const emojDatas = data.map(({Id, EmoIconUrl, EmoDesc}) => {
        const item = {
          id: Id,
          desc: EmoDesc,
          url: `${IMG_FIX_URL}/${EmoIconUrl}`
        }
        emojMap[Id] = item
        return item
      })
      app.store.emojDatas  = emojDatas;
      this.data.emojDatas = emojDatas;
    }
    return emojMap
  },
  /**
   * 设置坐标位置
   */
  setLocationToApp() {
    const { location } = this.data;
    app.store.locations = { ...location }
  },
  /** 获取今年记录 */
  async getRecordDataByYear() {
    const year = formatDate(new Date(), 'yyyy')
    const [err, res ] = await getRecordByYear(year)
    const data = getMutliLevelProperty(res, 'data', [])
    const yearRecord = {}
    if (!err && res && res.code === 200 && Array.isArray(data) && data.length) { 
      data.forEach(item => {
        const { arena_id } = item
        yearRecord[arena_id] = item
      })
    }
    return yearRecord;
  },
  /** 更新地图 */
  updateMapMarkers(arenaDatas, yRecordMap, emojMap) {
    const markerDatas = []
    arenaDatas.forEach(({ arena_id, arena_latitude, arena_longitude }, i) => {
      let iconPath =  '../../images/index/icon-10.png'
      if (yRecordMap[arena_id] && !yRecordMap[arena_id].check) {
        const { emoj_id } = yRecordMap[arena_id]
        yRecordMap[arena_id].check = true
        iconPath = (emojMap[emoj_id] && emojMap[emoj_id].url) || iconPath;
      }
      markerDatas.push({
        id: i,
        width: 50,
        height: 50,
        latitude: Number(arena_latitude),
        longitude: Number(arena_longitude),
        iconPath,
        // joinCluster: true,
      });
    })
    console.log('markerDatas===', markerDatas)
    this.mapCtx.addMarkers({
      markers: markerDatas,
      clear: true,
      complete(res) {
        console.log('clusterCreate addMarkers=====', res)
      },
      fail(err) {
        console.error('clusterCreate fail', err)
      }
    })
  }

})
