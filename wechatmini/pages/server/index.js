import { otherHttp, Request, uploadImage } from "../../utils/http";

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


/**
 *  获取表情
 */

function getEmojAll() {
  return Request('/auth/selectemojall')
}

/** 
 * 获取最近的数据
 */
function getArenaNear(arena_belong,  arena_latitude, arena_longitude,) {
  return Request('/auth/getarenanear', { arena_belong, arena_longitude: String(arena_longitude) ,  arena_latitude: String(arena_latitude) })
}

/**
 * 模糊查询 
 */

function getArenaLike(arena_belong,  name) {
  return Request('/auth/selectarenalike', { arena_belong, name })
}

/** 上传图片 */
function UploadImg(filePath) {
  return uploadImage(filePath)
}

/**
 * 创建记录
 * @param {*} params  { arena_id,emoj_id, record_img, record_desc }
 * @returns 
 */
function createRecord(params) {
  return Request('/auth/createrecord', { ...params })
}

export {
	getWeatherByLocation,
	postCheckLogin,
	postLogin,
	getArenaAll,
  subitFeebBack,
  getEmojAll,
  getArenaNear,
  getArenaLike,
  UploadImg,
  createRecord,
}