Page({
  data: {
    count: 3,
    timer: ''
  },
  onLoad() {
    let _this = this
    _this.data.count = 3
    this.data.timer = setInterval(() => {
      _this.data.count--
      if (_this.data.count == 0 || _this.data.count < 0) {
        _this.data.count = 0
        clearInterval(_this.data.timer)
        this.direct()
      }
      _this.setData({
        count: _this.data.count
      })
    }, 1000)
  },
  skip() {
    clearInterval(this.data.timer)
    this.direct()
  },
  direct() {
    let url = '/pages/category/index'
    if (true) {
      url = '/pages/category/index'
    }
    wx.switchTab({
      url
    })
  }
})
