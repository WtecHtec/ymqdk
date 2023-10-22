function getCacheByKey(key, def = '') {
	try {
		return wx.getStorageSync(key)

	} catch (e) {
		// Do something when catch error
		return def
	}
}

function setCacheByKey(key, value) {
	try {
		wx.setStorageSync(key, value)
		return true
	} catch (e) { return false }
}

export {
	getCacheByKey,
	setCacheByKey,
}