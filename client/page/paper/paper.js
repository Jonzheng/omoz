const urls = require('../../config')

Page({

  data: {

  },

  initPageData: function () {
    var that = this
    wx.request({
        url: urls.queryPaper,
        method: 'POST',
        data: {status: 1},
        success: function (res) {
            console.log("queryPaper:")
            var _list = res.data.data
            console.log(_list)
            that.setData({
              _list: _list
            })
        }
    })
  },

  onLoad: function () {
    //页面初始参数
    this.initPageData()
  },

})