const urls = require('../../config')
const App = new getApp()

Page({

  data: {
    
  },

  initPageData: function (paper_id) {
    var that = this
    //t_paper
    wx.request({
        url: urls.queryPaper,
        method: 'POST',
        data: {paper_id},
        success: function (res) {
            console.log("queryPaper:")
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

  modelChange: function (e){
    var god_on = e.detail.value

    this.setData({
      god_on: god_on
    })
  },

  openConfirm: function () {
    var paper_id = this.data.paper.paper_id
    var openid = App.globalData.openid
    //查询答题记录
    wx.request({
      url: urls.queryAnswerHis,
      method: 'POST',
      data: {paper_id, openid},
      success: function (res) {
          console.log("queryAnswerHis:")
          var result = res.data.data
          console.log(result)
          var _url = '../question/question?paper_id=' + paper_id
          if (result.length > 0){
            var answer_his = result[0]
            var answer_count = answer_his.answer.split(";").length
            var spend = answer_his.spend
            var content = "已答题: " + answer_count + " ,已用时: " + spend + " 分钟"
            wx.showModal({
              title: "是否继续上次答题?",
              content: content,
              confirmText: "继续答题",
              cancelText: "重新答题",
              success: function (res) {
                  if (res.confirm) {
                    _url = _url + "&spend=" + spend + "&answer_his=" + answer_his.answer
                    wx.navigateTo({
                      url: _url
                    })
                  }else{
                      wx.navigateTo({
                        url: _url
                      })
                  }
              }
            });
          }else{  //无记录
            wx.navigateTo({
              url: _url
            })
          }
      }
    })

},
})