import { getRecordById } from '../server/index'
import { getMutliLevelProperty } from "../../utils/util";
import { IMG_FIX_UP_URL } from '../../config';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailItem: {},
    emojDatas: {},
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
    this.getRecordDataById(options.record_id)
  },
  async getRecordDataById(id) {
    const { emojDatas } = this.data
    const [err, res ] = await getRecordById(id)
    const data = getMutliLevelProperty(res, 'data', [])
    if (!err && res && res.code === 200 && Array.isArray(data) && data.length) {  
    //  const item =   {
    //   arena_location: "深圳",
    //   arena_name: "皇岗羽毛球馆",
    //   emoj_id: "",
    //   record_desc: "魔刹石",
    //   record_id: "",
    //   record_img: "/upload/8fd9ff28-2a80-4458-8446-18a9727b4206.png",
    //   str_create_date: "2023-10-25 09:26",}
      const { emoj_id, record_img } = data[0];
      this.setData({
        detailItem: {
          ...data[0],
          emoj_img: emojDatas[emoj_id],
          record_img: `${IMG_FIX_UP_URL}${record_img}`
        },
      })
    } else {
      wx.showToast({
				title: '获取数据失败',
				icon: 'error',
				duration: 2000
			})
    }
  },
  bindView() {
    const {  detailItem } = this.data;
    wx.previewImage({
      current: detailItem.record_img, // 当前显示图片的http链接
      urls: [ detailItem.record_img ] // 需要预览的图片http链接列表
    })
  }

})