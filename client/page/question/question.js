const urls = require('../../config')
const App = new getApp()

Page({

  data: {

  },

  initQuestions: function (questions){
    var that = this
    //选择题 <=10
    var que_type1 = []
    var que_type2 = []
    var que_type3 = []
    var que_type4 = []

    //阅读题 10< x <=20
    var que_type11 = []
    var que_type12 = []
    var que_type13 = []
    var que_type14 = []

    var que_type21 = []
    var que_type22 = []
    var que_type23 = []
    var que_type24 = []

    var cate1_count = 0
    var cate2_count = 0
    var cate3_count = 0

    for (let [i, v] of questions.entries()){

      v["radioItems"] = [{name: v.option_a, value: "A"},{name: v.option_b, value: "B"},{name: v.option_c, value: "C"},{name: v.option_d, value: "D"}]
      //console.log(i, v)

      if (v.type <= 10){

        cate1_count += 1
        if (v.type == 1){
          v["type_desc"] = "选择题1--根据汉字选假名/根据假名选汉字"
          que_type1.push(v)
        }else if (v.type == 2){
          v["type_desc"] = "选择题2--选择合适的单词/单词正确用法"
          que_type2.push(v)
        }else if (v.type == 3){
          v["type_desc"] = "选择题3--选择意思相近的句子"
          que_type3.push(v)
        }else if (v.type == 4){
          v["type_desc"] = "选择题4--连词成句(选择★位置的选项)"
          que_type4.push(v)
        }

      }else if(10 < v.type && v.type <= 20){

        cate2_count += 1
        console.log(v)
        if (v.type == 11){
          v["type_desc"] = "阅读理解--短篇1问/篇"
          que_type11.push(v)
        }else if (v.type == 12){
          v["type_desc"] = "阅读理解--中/长篇2-6问"
          que_type12.push(v)
        }else if (v.type == 13){
          v["type_desc"] = "阅读理解--中/长篇2-6问"
          que_type13.push(v)
        }else if (v.type == 14){
          v["type_desc"] = "阅读理解--中/长篇2-6问"
          que_type14.push(v)
        }

      }else if(v.type > 20){

        cate3_count += 1
        if (v.type == 21){
          v["type_desc"] = "聴解题"
          que_type21.push(v)
        }else if (v.type == 22){
          que_type22.push(v)
        }else if (v.type == 23){
          que_type23.push(v)
        }else if (v.type == 24){
          que_type24.push(v)
        }
      }

    }  //end for

    console.log(que_type21)
    that.setData({
      cate1_count,
      cate2_count,
      cate3_count,
      que_type1,
      que_type2,
      que_type3,
      que_type4,
      que_type11,
      que_type12,
      que_type13,
      que_type14,
      que_type21,
      que_type22,
      que_type23,
      que_type24,
    })
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
            if (questions){
              that.initQuestions(questions)
            }
            
        }
    })
  },


  onLoad: function (data) {
    //页面初始参数
    console.log(data)
    var god_on = data.god_on
    this.setData({god_on})
    var paper_id = data.paper_id
    console.log(paper_id)
    this.initPageData(paper_id)

  },
  
  setQueList: function(type, _list){
    if (type == 1){this.setData({"que_type1":_list})
    }else if (type == 2){this.setData({"que_type2":_list})
    }else if (type == 3){this.setData({"que_type3":_list})
    }else if (type == 4){this.setData({"que_type4":_list})

    }else if (type == 11){this.setData({"que_type11":_list})
    }else if (type == 12){this.setData({"que_type12":_list})
    }else if (type == 13){this.setData({"que_type13":_list})
    }else if (type == 14){this.setData({"que_type14":_list})

    }else if (type == 21){this.setData({"que_type21":_list})
    }else if (type == 22){this.setData({"que_type22":_list})
    }else if (type == 23){this.setData({"que_type23":_list})
    }else if (type == 24){this.setData({"que_type24":_list})
    }
  },

  radioChange: function (e) {
      console.log('radio value：', e.detail.value)
      var currData = e.currentTarget.dataset
      console.log(currData)
      var god_on = this.data.god_on
      console.log(god_on,god_on == 1)
      var curr_type = "que_type" + currData.type
      var _list = this.data[curr_type]
      var right_option = _list[currData.index].right_option.toUpperCase()
      var radioItems = _list[currData.index].radioItems
      for (var i = 0, len = radioItems.length; i < len; ++i) {
          radioItems[i].checked = radioItems[i].value == e.detail.value
          if (god_on == 1){
              radioItems[i].right = radioItems[i].value == right_option
              radioItems[i].abled = true
          }
          
      }
      console.log(_list[currData.index])
      this.setQueList(currData.type, _list)
  },
})