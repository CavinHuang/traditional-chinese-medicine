const { Wechat } = require('../../utils/upload')

const app = getApp()
Page({
  data: {
    imageBaseUrl: app.globalData.imageBaseUrl,
    imageLists: [],
    batch_no: ''
  },
  onLoad() {
    
  },

  batchNoInput: function (e) {
    this.setData({
      batch_no: e.detail.value
    })
  },

  deleteImage: async function (e) {
    const index = e.currentTarget.dataset.index;
    console.log(e, index)
    const url = this.data.imageLists[index]
    const res = await app.globalData.fetch.Post('/wechat/api/deleteFile', { url })
    if (res.code === 200) {
      this.data.imageLists.splice(index, 1)
      this.setData({
        imageLists: this.data.imageLists
      })
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })
    } else {
      wx.showToast({
        title: res.message,
        icon: 'error',
        duration: 1500
      })
    }
  },

  async chooseImage() {
    const imageRes = await Wechat.chooseImage(9)
    this.uploadFiles(imageRes.tempFiles)
    console.log(imageRes)
  },
  
  async uploadFiles(files) {
    if (!files.length) return false
    try {
      const file = files.splice(0, 1)
      console.log(file)
      const uploadRes = await Wechat.uploadFile('/wechat/api/upload', file[0].tempFilePath, 'file')
      console.log(uploadRes)
      if (uploadRes && uploadRes.data) {
        const result = JSON.parse(uploadRes.data)
        if (result.code === 200) {
          console.log(result)
          this.setData({
            imageLists: [
              ...(this.data.imageLists || []),
              result.data
            ]
          })
        }
      }
      this.uploadFiles(files)
    } catch (error) {
      console.log(error)
    }

  },

  async submitPageData() {
    const options = {
      batch_no: this.data.batch_no,
      images: this.data.imageLists
    }

    app.globalData.fetch.Post('/wechat/api/batchAdd', options).then(res => {
      wx.showToast({
        title: res.message,
        icon: 'success',
        duration: 2000
      })
      this.setData({
        imageLists: [],
        batch_no: ''
      })
    })
  }
})
