// pages/arenaselect/index.js
import { getArenaNear, getArenaLike } from "../server/index"
import { getMutliLevelProperty } from "../../utils/util"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFocus: false,
    keyValue: '',
    arenaBelong: '深圳',
    locations: {
			latitude: 22.540029,
			longitude: 113.94583
    },
    arenaDatas: [],
    hasTap: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const {  locations , arenaBelong } = app.store
    // console.log('locations===', locations, arenaBelong)
    this.data.locations =  locations || {},
    this.data.arenaBelong = arenaBelong || '深圳'
    this.getArenaNearData()
  },
  bindInput() {
    this.setData({
      isFocus: true,
    });
  },
  bindblur() {
    this.setData({
      isFocus: false,
    });
  },
  bindconfirm({ detail }) {
    const { value } = detail;
    console.log('bindconfirm====', detail, value)
    this.getArenaLikeData(value)
  },
  bindUsrInput({ detail }) {
    const { value } = detail;
    this.data.keyValue = value;
    console.log('bindUsrInput====', detail)
  },
  bindFind() {
    const { keyValue } = this.data;
    if (!keyValue) return;
    this.getArenaLikeData(keyValue)
  },
  async getArenaNearData() {
    const { arenaBelong,   locations: {
			latitude,
			longitude
    },} = this.data;
    const [err, res] = await getArenaNear(arenaBelong, latitude, longitude)
    const data = getMutliLevelProperty(res, 'data', [])
    if (!err && res && res.code === 200 && Array.isArray(data) && data.length) { 
      console.log('getArenaNearData===', data)
      this.setData({
        arenaDatas: data,
      });
    }
  },
  bindSelectItem({ currentTarget }) {
    const { item } = currentTarget.dataset
    console.log('app===', app)
    app.cache.arenaitem = item;
    wx.navigateBack()
  },
  async getArenaLikeData(keyValue) {
    if (!keyValue) return;
    const { arenaBelong } = this.data;
    const [err, res] = await getArenaLike(arenaBelong, keyValue)
    const data = getMutliLevelProperty(res, 'data', [])
    if (!err && res && res.code === 200 && Array.isArray(data) && data.length) { 
      console.log('getArenaNearData===', data)
      this.setData({
        arenaDatas: data,
        hasTap: true,
      });
    }
  }


})