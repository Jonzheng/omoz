const urls = require('../../config')
const App = new getApp()
const seek_ss = 15

Page({

  data: {
    listening: false,
    isFirst: false,
    top_show: true,
    icon_more: "../../image/more.png",
    answer_map: {},
    cate1_done: 0,
    cate2_done: 0,
    cate3_done: 0,
    listen_1: 0,
    listen_2: 0,
    listen_3: 0,
    listen_4: 0,
    curr_width: 0,
    back_ss: 0,
    seek_ss: seek_ss,
    spend_hh: "00",
    spend_mm: "00",
    spend_ss: "00",
    dura_mm: "00",
    dura_ss: "00",
    curr_mm: "00",
    curr_ss: "00",
  },
  onUnload: function () {
      console.log("onUnload")
      var audioContext = this.data.audioContext
      audioContext.stop()

      var count_it = this.data.count_it
      console.log("count_it:",count_it)
      clearInterval(count_it)

      var dura_it = this.data.dura_it
      console.log("dura_it:",dura_it)
      clearInterval(dura_it)

      var curr_it = this.data.curr_it
      console.log("curr_it:",curr_it)
      clearInterval(curr_it)

  },
  onReady: function () {
    var audioContext = wx.createInnerAudioContext()
    audioContext.obeyMuteSwitch = false
    this.setData({
      audioContext,
    });
    
    audioContext.onPlay(() => {
      this.setData({
          listening: true,
      });
      this.initDura()
      //_next.call(this);
      this.initBar()
    });

    audioContext.onEnded(() => {
        console.log("end")
        this.setData({
          listening: false,
      });
    });

    audioContext.onStop(() => {
      console.log("onStop")
      this.setData({
        listening: false,
      });
    });

    audioContext.onSeeked(() => {
        var curr_time = audioContext.currentTime
        var duration = audioContext.duration
        var curr_width = curr_time/duration * 480
        this.setData({curr_width})
    });

  },

  initCate: function(question_id){
      //1533472089868_1_2
      var cate = parseInt(question_id.split("_")[1])
      var cate1_done = this.data.cate1_done
      var cate2_done = this.data.cate2_done
      var cate3_done = this.data.cate3_done
      if (cate <= 10){
        cate1_done += 1
      }else if (cate <= 20){
        cate2_done += 1
      }else if (cate <= 30){
        cate3_done += 1
      }
      this.setData({
        cate1_done,
        cate2_done,
        cate3_done,
      })
  },

  getRadioItems: function(question, answer_map){
    var radioItems = [{name: question.option_a, value: "A"},{name: question.option_b, value: "B"},{name: question.option_c, value: "C"},{name: question.option_d, value: "D"}]

    var option = answer_map[question.question_id]

    if(option == "A"){
      //如果已选择
      radioItems[0]["checked"] = true
    }else if(option == "B"){
      radioItems[1]["checked"] = true
    }else if(option == "C"){
      radioItems[2]["checked"] = true
    }else if(option == "D"){
      radioItems[3]["checked"] = true
    }
    if (option){
      this.initCate(question.question_id)
    }
    return radioItems
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

    var cate1_total = 0
    var cate2_total = 0
    var cate3_total = 0

    var answer_map = this.data.answer_map
    for (let [i, v] of questions.entries()){

      v["radioItems"] = this.getRadioItems(v, answer_map)

      if (v.type <= 10){

        cate1_total += 1
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

        cate2_total += 1
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
        v["listen_desc"] = "※开始前会有一段问题说明以及例题"
        cate3_total += 1
        if (v.type == 21){
          v["que_desc"] = "请先听问题,接着听对话,然后选出正确的答案"
          v["type_desc"] = "聴解题1--问题理解"
          que_type21.push(v)
        }else if (v.type == 22){
          v["que_desc"] = "请先听问题,接着听对话,然后选出正确的答案"
          v["type_desc"] = "聴解题2--重点理解"
          que_type22.push(v)
        }else if (v.type == 23){
          v["que_desc"] = "根据所描述的场景,选出箭头所指人物的恰当表达"
          v["type_desc"] = "聴解题3--语言表达"
          que_type23.push(v)
        }else if (v.type == 24){
          v["que_desc"] = "听简短对话选出恰当的应答"
          v["type_desc"] = "聴解题3--即时应答"
          que_type24.push(v)
        }
      }

    }  //end for
    
    console.log(que_type21)
    that.setData({
      size21:que_type21.length,
      size22:que_type22.length,
      size23:que_type23.length,
      size24:que_type24.length,
      cate1_total,
      cate2_total,
      cate3_total,
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
            that.initQuestions(questions)
          }
      }
    })
  },

  initPageData: function (data) {
    var that = this

    console.log(data)
    var god_on = data.god_on
    var paper_id = data.paper_id
    var openid = App.globalData.openid

    this.setData({paper_id,god_on})

    var spend = data.spend
    if (spend){
      spend = parseInt(spend)
      //t_answer_his
      wx.request({
          url: urls.queryAnswerHis,
          method: 'POST',
          data: {paper_id,openid,god_on},
          success: function (res) {
              console.log("queryAnswerHis:")
              var result = res.data.data
              console.log(result)
              if (result.length > 0){
                var answer_his = result[0]
                var answer = answer_his.answer
                var listen_1 = answer_his.listen_1
                var listen_2 = answer_his.listen_2
                var listen_3 = answer_his.listen_3
                var listen_4 = answer_his.listen_4

                var answer_map = {}
                var answer_sp = answer.split(";")
                for (let an of answer_sp){
                  var fields = an.split(",")
                  var question_id = fields[0]
                  var option = fields[1]
                  answer_map[question_id] = option
                }
                console.log(answer_map)
                that.setData({
                  answer_map,
                  listen_1,
                  listen_2,
                  listen_3,
                  listen_4,
                })
              }
              that.loadQuestion(paper_id)
          }
      })
    }else{
      spend = 0
      this.setData({isFirst:true})
      that.loadQuestion(paper_id)
    }

    //计时开始
    var count_it = setInterval(function(){
      spend += 1
      if (spend % 50 == 0){
        console.log(spend, "save....")
      }
      var spend_hh = parseInt(spend / 3600)
      var spend_mm = parseInt(spend / 60)
      var spend_ss = parseInt(spend % 60)
      if (spend_hh < 10) spend_hh = "0"+spend_hh
      if (spend_mm < 10) spend_mm = "0"+spend_mm
      if (spend_ss < 10) spend_ss = "0"+spend_ss

      that.setData({
        spend,
        spend_hh,
        spend_mm,
        spend_ss,
        count_it,
      })
    },1000)
    console.log("it:", count_it)

  },

  onLoad: function (data) {
    //页面初始参数
    this.initPageData(data)

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

  saveAnswer: function(answer_map){
    var that = this
    var god_on = this.data.god_on
    var paper_id = this.data.paper_id
    var spend = this.data.spend
    var openid = App.globalData.openid

    var listen_1 = this.data.listen_1
    var listen_2 = this.data.listen_2
    var listen_3 = this.data.listen_3
    var listen_4 = this.data.listen_4

    var answer = ""
    console.log(answer_map)

    for (let kk in answer_map){
      var an = kk + "," + answer_map[kk]
      answer += an + ";"
    }
    if (answer) answer = answer.substr(0, answer.length-1)

    //insert_answer_his
    if (this.data.isFirst){
      wx.request({
        url: urls.saveAnswerHis,
        method: 'POST',
        data: {paper_id,openid,answer,god_on,spend,listen_1,listen_2,listen_3,listen_4},
        success: function (res) {
            console.log("saveAnswerHis:")
            that.setData({
              isFirst: false
            })
        }
      })

    }else{  //update_answer_his
      wx.request({
        url: urls.updateAnswerHis,
        method: 'POST',
        data: {paper_id,openid,answer,god_on,spend,listen_1,listen_2,listen_3,listen_4},
        success: function (res) {
            console.log("updateAnswerHis:",answer)
            that.setData({
              isFirst: false
            })
        }
      })

    }


  },

  radioChange: function (e) {
      var currData = e.currentTarget.dataset
      var god_on = this.data.god_on
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

      var question = _list[currData.index]
      var question_id = question.question_id
      var answer_map = this.data.answer_map
      answer_map[question_id] = e.detail.value

      //更新显示已做的题目数
      this.initCate(question_id)

      this.setQueList(currData.type, _list)
      this.saveAnswer(answer_map)
  },

  listen: function(e){
    var currData = e.currentTarget.dataset
    var src = currData.src
    var audioContext = this.data.audioContext
    audioContext.src = src
    if (!this.data.oriPlaying){
        audioContext.play()

    }
  },

  jumpCate: function(e){
    var currData = e.currentTarget.dataset
    var cate_id = "#" + currData.type
    var query = wx.createSelectorQuery()
    query.select(cate_id).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res){
      var top = res[0].top
      var scrollTop = res[1].scrollTop

      wx.pageScrollTo({
        scrollTop: scrollTop+top-200,
        duration: 300
      })
    })
  },

  initDura: function(){
    var audioContext = this.data.audioContext
    var that = this
    var dura_it = setInterval(function(){
      var duration = audioContext.duration
      var dura_mm = parseInt(duration / 60)
      var dura_ss = parseInt(duration % 60)
      if (dura_mm < 10) dura_mm = "0"+dura_mm
      if (dura_ss < 10) dura_ss = "0"+dura_ss

      that.setData({
        dura_it,
        dura_mm,
        dura_ss,
      });

      if(duration > 0) clearInterval(dura_it)
    },500)
  },

  seekTo: function(e){
    var audioContext = this.data.audioContext
    var currData = e.currentTarget.dataset
    var type = currData.type
    clearInterval(this.data.back_it)
    if (type == "+"){
      this.initSeek()
      var curr_time = audioContext.currentTime
      curr_time += seek_ss
      audioContext.seek(curr_time)
    }else{
      var sec = currData.sec
      if (sec < 1) return
      this.setData({back_ss:0})
      var curr_time = audioContext.currentTime
      curr_time -= sec
      audioContext.seek(curr_time)
    }
  },

  showMore: function(){
    var top_show = this.data.top_show
    this.setData({
      top_show: !top_show
    })
  },

  initBar: function(){
    var that = this
    var audioContext = this.data.audioContext
    var curr_it = setInterval(function(){
      var curr_time = audioContext.currentTime
      var duration = audioContext.duration
      var curr_width = curr_time/duration * 480

      var curr_mm = parseInt(curr_time / 60)
      var curr_ss = parseInt(curr_time % 60)
      if (curr_mm < 10) curr_mm = "0"+curr_mm
      if (curr_ss < 10) curr_ss = "0"+curr_ss

      that.setData({
        curr_it,
        curr_width,
        curr_mm,
        curr_ss,
      })

      if (!that.data.listening){
        clearInterval(curr_it)
      }
    },100)
  },

  initSeek: function(){
    var that = this
    var back_ss = seek_ss
    var back_it = setInterval(function(){
      back_ss -= 1
      if (back_ss < 0) back_ss = 0
      that.setData({
        back_ss,
        back_it
      })
      if (!that.data.listening || back_ss == 0){
        clearInterval(back_it)
      }
    },1000)
  },

})