const urls = require('../../config')
const App = new getApp()

Page({

  data: {
    god_on: 0,
    show_result: false,
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
    //queryPaper -- if(answer_id) -> queryAnswer -- queryQuestion -- initScore
    //页面初始参数
    var paper_id = data.paper_id
    var answer_id = data.answer_id

    console.log(paper_id, answer_id)
    
    if(answer_id){
      this.loadAnswer(paper_id, answer_id)
    }else{
      this.initPageData(paper_id)
    }
  },

  initScore: function(questions){
    var that = this
    console.log(questions)
    var answer = this.data.answer
    console.log(answer)
    var answer_map = {}
    var answer_sp = answer.split(";")
    for (let an of answer_sp){
      var fields = an.split(",")
      var question_id = fields[0]
      var option = fields[1]
      answer_map[question_id] = option
    }
    console.log(answer_map)

    var cate1_right = 0
    var cate2_right = 0
    var cate3_right = 0

    var cate1_total = 0
    var cate2_total = 0
    var cate3_total = 0
    for (let v of questions){
      //统计各大题的正确数量
      if (v.type <= 10){
        cate1_total += 1
        if (answer_map[v.question_id] == v.right_option) cate1_right += 1
      }else if(10 < v.type && v.type <= 20){
        cate2_total += 1
        if (answer_map[v.question_id] == v.right_option) cate2_right += 1
      }else if(v.type > 20){
        cate3_total += 1
        if (answer_map[v.question_id] == v.right_option) cate3_right += 1
      }

    } //end for
    this.setData({
      cate1_total,
      cate2_total,
      cate3_total,
      cate1_right,
      cate2_right,
      cate3_right,
      show_result: true
    })
    var right_bar1 = 1
    var max1 = cate1_right / cate1_total * 100
    var it1 = setInterval(function(){
      while (right_bar1 < max1){
        right_bar1 += 1
        that.setData({right_bar1})
      }
      clearInterval(it1)
    },120)

    var right_bar2 = 1
    var max2 = cate2_right / cate2_total * 100
    var it2 = setInterval(function(){
      while (right_bar2 < max2){
        right_bar2 += 1
        that.setData({right_bar2})
      }
      clearInterval(it2)
    },200)

    var right_bar3 = 1
    var max3 = cate3_right / cate3_total * 100
    var it3 = setInterval(function(){
      while (right_bar3 < max3){
        right_bar3 += 1
        that.setData({right_bar3})
      }
      clearInterval(it3)
    },300)

    setTimeout(()=> this.fadeIn(), 3000)
    
  },

  loadQuestion: function(paper_id){
    var that = this
    //t_question
    wx.request({
      url: urls.queryQuestion,
      method: 'POST',
      data: {paper_id},
      success: function (res) {
          console.log("queryQuestion:")
          var questions = res.data.data
          if (questions){
            that.initScore(questions)
          }
      }
    })
  },

  loadAnswer: function(paper_id, answer_id){
    var that = this
    var openid = App.globalData.openid
    //t_question
    wx.request({
      url: urls.queryAnswer,
      method: 'POST',
      data: {answer_id, openid},
      success: function (res) {
          console.log("queryAnswer:")
          var t_answer = res.data.data[0]
          console.log(t_answer)
          if (t_answer){
            var answer = t_answer.answer
            that.setData({answer})
            that.loadQuestion(paper_id)
          }
      }
    })
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

  fadeIn: function(){
    this.setData({i_show:true})
  }
})