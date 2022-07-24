const app = getApp()
Page({
  data: {
    batchNo: ''
  },
  onLoad() {
    
  },
  inputBatchNo: function (e) {
    this.setData({
      batchNo: e.detail.value
    })
  },
  submitQuery() {
    const opt = {
      batchNo: this.data.batchNo
    }

    app.globalData.fetch.Post('/wechat/api/selectBatch', opt).then(res => {
      console.log(res)
    })
  }
})
