// pages/calendar/index.js
import { getRecordByMonth } from "../server/index";
import { formatDate, strToTime } from "../../utils/date";
import { getMutliLevelProperty } from "../../utils/util";
const curDate = formatDate(new Date(), 'yyyy-MM-dd');
const showDate = formatDate(new Date(), 'yyyy-MM');
const app = getApp()
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		showDate,
		date: curDate,
		startDate: '2023-01-01',
		endDate: curDate,
		weeks: ['日', '一', '二', '三', '四', '五', '六',],
		showDatas: [],
    recordDatas: {},
    emojDatas: {},
    cacheData: {},
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
    if (app.store.emojDatas.length) {
      app.store.emojDatas.forEach( ({ id, url}) => {
        this.data.emojDatas[id] = url
      })
    }
		const { date } = this.data;
		// this.getWeekByMonth('2023-10-02')
		// this.getCountDaysByMonth('2023-10-02')
		this.updateData(date);
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},
	bindDateChange({ detail: { value } }) {
		console.log(strToTime(`${value}-01`).getMonth())
    this.updateData(`${value}-01`)
		this.setData({
			showDate: value,
      date: `${value}-01`,
		})
	},
	/**
	 * 获取 月 1号 是周几
	 */
	getWeekByMonth(month) {
		let date = strToTime(month);
		const strDate = formatDate(date, 'yyyy-MM')
		date = strToTime(`${strDate}-01`);
		const w = date.getDay()
		console.log(w)
		return w;
	},

	/**
 * 获取 月 总共有多少天
 */
	getCountDaysByMonth(month) {
		const date = strToTime(month);
		const count = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
		console.log(count)
		return count;
	},

	/**
	 *  拼接 日历数组
	 */
	getCalendarDatas(week, count, month, curDate) {
		const result = [].concat(new Array(week).fill(''))
		const sm = formatDate(strToTime(month), 'yyyy-MM')
		const len = count
		for (let i = 0; i < len; i++) {
			const d = i + 1
			const strDate = `${sm}-${d < 10 ? '0' + d : d}`
			result.push({
				strDate,
				strDay: d,
				toDay: strDate === curDate,
				hasRecord: false,
				url: '',
			})
		}
		return result
	},
	/**
	 * 获取 日历数据
	 */
	getShowDatas(month) {
		return this.getCalendarDatas(this.getWeekByMonth(month), this.getCountDaysByMonth(month), month, curDate)
	},

  async updateData(month) {
    const sm = formatDate(strToTime(month), 'yyyy-MM')
    if (this.data.cacheData[sm]) {
      this.setData({
        showDatas: this.data.cacheData[sm],
      })
      return
    }
    const { emojDatas } = this.data
    let result = this.getShowDatas(month)
    const recordDatas = await this.getRecordDatas(month)
    result = result.map(item  => {
      const { strDate } = item
      if (recordDatas[strDate]) {
        const { emoj_id } = recordDatas[strDate];
        return {
          ...item,
          ...recordDatas[strDate],
          hasRecord: true,
          url: emojDatas[emoj_id] || ''
        }
      }
      return item
    })
    this.data.cacheData[sm] = result;
		this.setData({
			showDatas: result,
		})
		console.log(result)
  },
  /** 获取记录 */
  async getRecordDatas(month) {
    const sm = formatDate(strToTime(month), 'yyyy-MM')
    const [err, res] =  await getRecordByMonth(sm)
    let data = getMutliLevelProperty(res, 'data', [])
    const recordDatas = {}
		if (!err && res && res.code === 200 && Array.isArray(data) && data.length) {
      data.forEach(item => {
        const { str_create_date } = item
        const strData = formatDate(strToTime(str_create_date), 'yyyy-MM-dd')
        recordDatas[strData] = {
          strData,
          ...item,
        }
      })
    }
    return recordDatas;
  },
  bindDetail({ currentTarget}) {
    const { item: { record_id } } = currentTarget.dataset
    
    wx.navigateTo({ url: `/pages/detail/index?record_id=${record_id}`, })

  }

})