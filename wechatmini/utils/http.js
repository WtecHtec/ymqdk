
function otherHttp(url, method, params) {
	return new Promise((resolver, reject) => {
		wx.request({
			url, //仅为示例，并非真实的接口地址
			method,
			data: {
				...params
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success(res) {
				console.log(res.data)
				resolver([0, res])
			},
			fail() {
				resolver([-1, res])
			}
		})
	})
}

export {
	otherHttp
}