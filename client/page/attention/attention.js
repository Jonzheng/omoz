const urls = require('../../config')
const App = new getApp()

Page({

  data: {
    god_on: 0
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
    var god_on = 0
    if (e.detail.value){
      god_on = 1
    }
    this.setData({
      god_on: god_on
    })
  },

  openConfirm: function () {
    var god_on = this.data.god_on
    var paper_id = this.data.paper.paper_id
    var openid = App.globalData.openid
    //查询答题记录
    wx.request({
      url: urls.queryAnswerHis,
      method: 'POST',
      data: {paper_id, openid, god_on},
      success: function (res) {
          console.log("queryAnswerHis:")
          var result = res.data.data
          console.log(result)
          var _url = '../question/question?paper_id=' + paper_id + "&god_on=" + god_on
          if (result && result.length > 0){
            var answer_his = result[0]
            var answer_count = answer_his.answer.split(";").length

            var spend = parseInt(answer_his.spend)
            var spend_hh = parseInt(spend / 3600)
            var spend_mm = parseInt(spend / 60)
            var spend_ss = parseInt(spend % 60)
            if (spend_hh < 10) spend_hh = "0"+spend_hh
            if (spend_mm < 10) spend_mm = "0"+spend_mm
            if (spend_ss < 10) spend_ss = "0"+spend_ss

            var content = "已答题: " + answer_count + " ,已用时: " + spend_hh+":"+spend_mm+":"+spend_ss
            wx.showModal({
              title: "是否继续上次答题?",
              content: content,
              confirmText: "继续答题",
              cancelText: "重新答题",
              success: function (res) {
                  if (res.confirm) {
                    _url = _url + "&spend=" + spend
                    wx.navigateTo({
                      url: _url
                    })
                  }else{
                      wx.navigateTo({
                        url: _url + "&cover=1"
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