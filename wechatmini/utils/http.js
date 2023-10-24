import { getCacheByKey } from "./storage"
import { BASE_URL, CACHE_AUTH_TOKEN } from "../config"
import { getMutliLevelProperty, tryJsonPaseByStr } from "./util"
// 获取应用实例
const app = getApp()

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


const Request = (url, data) => {
	const minikey = getCacheByKey(CACHE_AUTH_TOKEN);
	console.log(minikey)
	return new Promise((resolve, reject) => {
		wx.request({
			url: `${BASE_URL}${url}`,
			data,
			header: {
				'content-type': 'application/json',
				'Authorization': `Bearer ${minikey}`
			},
			method: 'POST',
			success(res) {
				if (res && res.data && typeof res.data === 'object') {
					return resolve(['', res.data]);
				}
				resolve([`post ${url} response error `, null]);
			},
			fail() {
				resolve([`post ${url} error`, null]);
			}
		})
	})
}

function uploadImage(imgUrl) {
  const minikey = getCacheByKey(CACHE_AUTH_TOKEN);
  const header = {
    Authorization: `Bearer ${minikey}`
  }
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${BASE_URL}/auth/authupload`,
      header: header,
      name: 'file',
      filePath: imgUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          const data = getMutliLevelProperty(res, 'data', "{}")
          const result = tryJsonPaseByStr(data, {})
          console.log('result===', result);
          const code = getMutliLevelProperty(result, 'code', 0)
          if (code === 200) {
            resolve([0, result])
          } else {
            resolve([-1])
          }
        } else {
          resolve([-1])
        }
      },
      fail: (err) => {
        console.error('uploadImage err', err)
        resolve([-1])
      }
    })
  })
}

export {
	otherHttp,
	Request,
  uploadImage,
}