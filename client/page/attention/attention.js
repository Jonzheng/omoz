const urls = require('../../config')

Page({

  data: {
    
  },

  initPageData: function (paper_id) {
    var that = this
    wx.request({
        url: urls.queryQuestion,
        method: 'POST',
        data: {paper_id},
        success: function (res) {
            console.log("queryQuestion:")
            var _list = res.data.data
            console.log(_list)
            that.setData({
              _list: _list
            })
        }
    })
  },

  onLoad: function (data) {
    //页面初始参数
    var paper_id = data.paper_id
    console.log(paper_id)
    this.initPageData(paper_id)
  },

})