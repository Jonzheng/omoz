const urls = require('../../config')
const App = new getApp()

Page({

  data: {

    radioItems: [
      {name: '选项A!!', value: 'A'},
      {name: '选项-----B!!', value: 'B'},
      {name: '选项--C!!', value: 'C'},
      {name: '选项-ADDDDDDD!!', value: 'D'},
    ],

  },

  initPageData: function (paper_id) {
    var that = this
    //t_question
    wx.request({
        url: urls.queryQuestion,
        method: 'POST',
        data: {paper_id},
        success: function (res) {
            console.log("queryQuestion:")
            var questions = res.data.data
            console.log(questions)
            that.setData({
              questions: questions
            })
        }
    })
  },


  onLoad: function (data) {
    //页面初始参数
    console.log(data)
    var paper_id = data.paper_id
    console.log(paper_id)
    this.initPageData(paper_id)

  },
  
  radioChange: function (e) {
      console.log('radio value：', e.detail.value);

      var radioItems = this.data.radioItems;
      for (var i = 0, len = radioItems.length; i < len; ++i) {
          radioItems[i].checked = radioItems[i].value == e.detail.value;
      }

      this.setData({
          radioItems: radioItems
      });
  },
})