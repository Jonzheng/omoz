const urls = require('../../config')

Page({

  data: {
    
  },

  initPageData: function (paper_id) {
    var that = this
    wx.request({
        url: urls.queryPaper,
        method: 'POST',
        data: {paper_id},
        success: function (res) {
            console.log("queryQuestion:")
            var paper = res.data.data[0]
            console.log(paper)
            that.setData({
              paper: paper
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