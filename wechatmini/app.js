// app.js
import EventBus from "./utils/event_bus"
import { seniverseKey } from "./config";

const LOCATION_RIGHT = 'scope.userLocation'


App({
	bus: new EventBus(),
	authorize: {
		LOCATION_RIGHT: LOCATION_RIGHT,
	},
	config: {
		seniverseKey: seniverseKey,
	},
	store: {
		locationRight: false,
		isLogin: false,
    emojDatas: [],
    locations: {},
    arenaBelong: '',
	},
  cache: {},
	onLaunch() {
		console.log(this)
	},
	/**
	 *
	 * 判断权限是否开启
	 */
	checkAuthorize(authorize) {
		return new Promise(resovle => {
			wx.getSetting({
				success(res) {
					console.log(res.authSetting)
					if (!res.authSetting[authorize]) {
						resovle([-1]);
					}
					resovle([0]);
				}
			});
		});
	},
	/**
	 * 授权
	 */
	handleAuthorize(config, authorize, callBack) {
		wx.showModal({
			title: config.title || '获取权限',
			content: config.content || '为了更好体验，需要获取你的地理位置',
			showCancel: false,
			success(res) {
				if (res.confirm) {
					console.log('用户点击确定')
					wx.openSetting({
						success(res) {
							console.log(res.authSetting)
							if (res.authSetting[authorize]) {
								if (typeof callBack === 'function') callBack()
								console.log('locationlocation')
							}
						}
					})
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	},
})
