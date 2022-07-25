const app = getApp()
Page({
  data: {
    batchNo: '',
    detail: null,
    imageBaseUrl: app.globalData.imageBaseUrl,
  },
  onLoad() {
    
  },
  inputBatchNo: function (e) {
    this.setData({
      batchNo: e.detail.value
    })
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
   var index = e.currentTarget.dataset.index;
    //所有图片
   var imgs = this.data.detail.images;
   wx.previewImage({
    //当前显示图片
    current: imgs[index],
    //所有图片
    urls: imgs
   })
  },
  submitQuery() {
    const opt = {
      batchNo: this.data.batchNo
    }
    app.globalData.fetch.Post('/wechat/api/selectBatch', opt).then(res => {
      console.log(res)
      if (res.code === 200) {
        res.data.images = res.data.images.map(item => {
          return this.data.imageBaseUrl + item
        })
        this.setData({
          detail: res.data
        })
      }
    })
  }
})
