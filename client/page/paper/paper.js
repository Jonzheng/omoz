const Conf = require('../../config')

Page({

  data: {
      
  },

  initPageData: function () {
    var that = this
    //查询阴阳师list
    wx.request({
        url: Conf.queryPaper,
        method: 'POST',
        data: {},
        success: function (res) {
            console.log("queryPaper:")
            console.log(res.data.data)
        }
    })
  },

  onLoad: function () {
    //页面初始参数
    this.initPageData()
  },

})