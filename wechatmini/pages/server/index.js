import { otherHttp, Request } from "../../utils/http";

function getWeatherByLocation(key, location) {
	// 22.55329:113.88308
	const url = `https://api.seniverse.com/v3/weather/daily.json?key=${key}&location=${location}&language=zh-Hans&days=1`
	return otherHttp(url)
}

/**
 * 检查登录态
 * @returns 
 */
function postCheckLogin() {
	return Request('/auth/refresh_token');
}

/**
 * 请求登陆
 * @param {*} code 
 * @returns 
 */
function postLogin(code, nickName) {
	return Request('/login', { code, nickName })
}
/**
 * 获取 所有球馆
 * @returns 
 */
function getArenaAll(arena_belong = '深圳') {
	return Request('/auth/getarenaall', { arena_belong })
}



/** 提交反馈 */
function subitFeebBack(desc, score) {
  return Request('/auth/createfeedback', { desc, score })
}

export {
	getWeatherByLocation,
	postCheckLogin,
	postLogin,
	getArenaAll,
  subitFeebBack,
}