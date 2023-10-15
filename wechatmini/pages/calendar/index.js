// pages/calendar/index.js
import { formatDate, strToTime } from "../../utils/date";
const curDate = formatDate(new Date(), 'yyyy-MM-dd');
const showDate = formatDate(new Date(), 'yyyy-MM');
console.log(curDate)
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
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		const { date } = this.data;
		// this.getWeekByMonth('2023-10-02')
		// this.getCountDaysByMonth('2023-10-02')
		const result = this.getShowDatas(date)
		this.setData({
			showDatas: result,
		})
		console.log(result)
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},
	bindDateChange({ detail: { value } }) {
		console.log(strToTime(`${value}-01`).getMonth())
		const result = this.getShowDatas(`${value}-01`)
		this.setData({
			showDatas: result,
			showDate: value,
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
				hasRecord: strDate === curDate,
				url: '../../images/emoj/happy.png',
			})
		}
		return result
	},
	/**
	 * 获取 日历数据
	 */
	getShowDatas(month) {
		return this.getCalendarDatas(this.getWeekByMonth(month), this.getCountDaysByMonth(month), month, curDate)
	}

})