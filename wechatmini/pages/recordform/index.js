// pages/recordform/index.js
import { getMutliLevelProperty } from "../../utils/util"
import { UploadImg, createRecord } from "../server/index"
const app  = getApp()
console.log('app=== emojDatas', app)
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		form: {
			recordImg: {
        key: 'record_img',
				value: '',
        showData: '',
			},
			recordArena: {
        key: 'arena_id',
				value: '',
				showData: '',
			},
			feeling: {
        key: 'emoj_id',
				value: '',
				showData: '',
			},
			thoughts: {
        key: 'record_desc',
				value: '',
			},
		},
		emojDatas: [],
		showEmoj: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
    console.log(' app.store.emojDatas===',  app.store.emojDatas)
    if (app.store.emojDatas.length) {
      const { id, url } = app.store.emojDatas[0]
      this.setData({
        emojDatas:  app.store.emojDatas,
        'form.feeling.value': String(id),
        'form.feeling.showData': url,
      });
    }
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
    console.log('onshow', app.cache)
    const name =  getMutliLevelProperty(app, 'cache.arenaitem.Name', '')
    const Id = getMutliLevelProperty(app, 'cache.arenaitem.Id', '')
    if (name && Id) {
      this.setData({
        'form.recordArena.value': Id,
        'form.recordArena.showData': name
      });
    }
 
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	bindInput({ detail, currentTarget }) {
		const value = getMutliLevelProperty(detail, 'value', -1)
		const key = getMutliLevelProperty(currentTarget, 'dataset.key', '')
		if (!value || !key) return
		const update = {}
		update[`form.${key}.value`] = value
		this.setData({
			...update,
		})
	},

	bindPickerChange({ detail, currentTarget }) {
		const value = getMutliLevelProperty(detail, 'value', -1)
		const key = getMutliLevelProperty(currentTarget, 'dataset.key', '')
		if (value === -1 || !key) return
		const { arenaDatas } = this.data
		const pickerData = arenaDatas
		const update = {}
		update[`form.${key}.value`] = pickerData[value].id
		update[`form.${key}.showData`] = pickerData[value].name
		this.setData({
			...update,
		})
	},

	bindEmojChange({ detail, currentTarget }) {
		const value = getMutliLevelProperty(currentTarget, 'dataset.value', -1)
		const key = getMutliLevelProperty(currentTarget, 'dataset.key', '')
		if (value === -1 || !key) return
		const { emojDatas } = this.data
		const pickerData = emojDatas
		const update = {}
		update[`form.${key}.value`] = String(pickerData[value].id)
		update[`form.${key}.showData`] = pickerData[value].url
		this.setData({
			// showEmoj: !this.data.showEmoj,
			...update,
		})
	},


	bindUpload(e) {
		console.log(e)
		const key = getMutliLevelProperty(e, 'currentTarget.dataset.key', '')
		wx.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera'],
			success: async (res) => {
				// tempFilePath可以作为img标签的src属性显示图片
				const tempFilePaths = res.tempFilePaths
				if (tempFilePaths.length) {
					console.log(tempFilePaths)
          const [err, res] = await UploadImg(tempFilePaths[0])
          console.log('err, res====', err, res)
          if (err !== 0) {
            wx.showToast({
              title: '图片上传失败!',
              icon: 'error',
              duration: 2000
            })
            return
          }
          const data = getMutliLevelProperty(res, 'data', '')
					const update = {}
					update[`form.${key}.value`] = data
          update[`form.${key}.showData`] = tempFilePaths[0]
					this.setData({
						...update,
					})
				}

			}
		})
	},

	bindSend() {
		const { form } = this.data;
		console.log(form)
		if (!this.checkForm(form)) {
			wx.showToast({
				title: '请完成信息填写!',
				icon: 'none',
				duration: 2000
			})
			return;
		}
    this.handleCreateRecord()
	},

	checkForm(form) {
		let status = true
		Object.keys(form).forEach(key => {
			if (!form[key].value && form[key].value !== 0) status = false;
		})
		return status
	},

	bindEmoj() {
		this.setData({ showEmoj: !this.data.showEmoj });
	},

  bindGoArenPicker() {
    wx.navigateTo({ url: `/pages/arenaselect/index`, })
  },

  /** 拼接参数 */
  getParams(form) {
    const params = {}
    Object.keys(form).forEach(k => {
      const { key, value } = form[k]
      params[key] = value
		})
    return params
  },
  async handleCreateRecord() {
    const { form } = this.data;
    const [err, res ] = await createRecord(this.getParams(form))
    if (!err && res ) {
      if (res.code === 200) {
        // wx.showToast({
        //   title: '反馈成功',
        //   icon: 'none',
        //   duration: 2000
        // })
        wx.redirectTo({
          url: '/pages/formresult/index'
        })
      } else if (res.code === 202) {
        wx.showToast({
          title: '24小时内，只能发布1条',
          icon: 'none',
          duration: 2000
        })
      } else {
        this.showFail('包含特殊字符')
      }

    } else {
      this.showFail()
    }
  },
  showFail(title) {
    wx.showToast({
      title: title || '反馈失败',
      icon: 'none',
      duration: 2000
    })
  }


})