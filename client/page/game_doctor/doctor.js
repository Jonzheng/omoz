const App = new getApp()
const urls = require('../../config')

const kana_a = [["kana_a","a", "あ", "ア"],["kana_a","i", "い", "イ"],["kana_a","u", "う", "ウ"],["kana_a","e", "え", "エ"],["kana_a","o", "お", "オ"]]
const kana_ka = [["kana_ka","ka", "か", "カ"],["kana_ka","ki", "き", "キ"],["kana_ka","ku", "く", "ク"],["kana_ka","ke", "け", "ケ"],["kana_ka","ko", "こ", "コ"]]
const kana_sa = [["kana_sa","sa", "さ", "サ"],["kana_sa","shi", "し", "シ"],["kana_sa","su", "す", "ス"],["kana_sa","se", "せ", "セ"],["kana_sa","so", "そ", "ソ"]]
const kana_ta = [["kana_ta","ta", "た", "タ"],["kana_ta","chi", "ち", "チ"],["kana_ta","tsu", "つ", "ツ"],["kana_ta","te", "て", "テ"],["kana_ta","to", "と", "ト"]]
const kana_na = [["kana_na","na", "な", "ナ"],["kana_na","ni", "に", "ニ"],["kana_na","nu", "ぬ", "ヌ"],["kana_na","ne", "ね", "ネ"],["kana_na","no", "の", "ノ"]]
const kana_ha = [["kana_ha","ha", "は", "ハ"],["kana_ha","hi", "ひ", "ヒ"],["kana_ha","fu", "ふ", "フ"],["kana_ha","he", "へ", "ヘ"],["kana_ha","ho", "ほ", "ホ"]]
const kana_ma = [["kana_ma","ma", "ま", "マ"],["kana_ma","mi", "み", "ミ"],["kana_ma","mu", "む", "ム"],["kana_ma","me", "め", "メ"],["kana_ma","mo", "も", "モ"]]
const kana_ya = [["kana_ya","ya", "や", "ヤ"],["","","",""],["kana_ya","yu", "ゆ", "ユ"],["","","",""],["kana_ya","yo", "よ", "ヨ"]]
const kana_ra = [["kana_ra","ra", "ら", "ラ"],["kana_ra","ri", "り", "リ"],["kana_ra","ru", "る", "ル"],["kana_ra","re", "れ", "レ"],["kana_ra","ro", "ろ", "ロ"]]
const kana_wa = [["kana_wa","wa", "わ", "ワ"],["","","",""],["","","",""],["","","",""],["kana_wa","wo", "を", "ヲ"]]
const kana_n = [["kana_n","n","ん","ン"]]


const max_row = 11
const max_col = 8
const max_sed = 10
const least_sed = 5
const valid_sed = 12
const total_step = 80

Page({

  data: {
    bucket:[],
    ks_sed:[],
    spin_count:0,
    sed_size:10,
    rest_count:total_step,
    icon_setting:"../../image/setting.png",
    option: 1,
    top_hide: true,
    rank_hide: true,
    kana_hide: true,
  },

  getKanaRows: function(kana_row){
    var rows = []
    for (let lst of kana_row){
      var words = {}
      words["cate"] = lst[0]
      words["roma"] = lst[1]
      words["hira"] = lst[2]
      words["kata"] = lst[3]
      rows.push(words)
    }
    return rows
  },

  initKanaRows: function(){
    var ks_a = this.getKanaRows(kana_a)
    var ks_ka = this.getKanaRows(kana_ka)
    var ks_sa = this.getKanaRows(kana_sa)
    var ks_ta = this.getKanaRows(kana_ta)
    var ks_na = this.getKanaRows(kana_na)
    var ks_ha = this.getKanaRows(kana_ha)
    var ks_ma = this.getKanaRows(kana_ma)
    var ks_ya = this.getKanaRows(kana_ya)
    var ks_ra = this.getKanaRows(kana_ra)
    var ks_wa = this.getKanaRows(kana_wa)
    var ks_n = this.getKanaRows(kana_n)
    var ks_all = []
    ks_all.push(ks_a,ks_ka,ks_sa,ks_ta,ks_na,ks_ha,ks_ma,ks_ya,ks_ra,ks_wa,ks_n)
    this.setData({
      ks_all,
      ks_a,
      ks_ka,
      ks_sa,
      ks_ta,
      ks_na,
      ks_ha,
      ks_ma,
      ks_ya,
      ks_ra,
      ks_wa,
      ks_n
    })
  },

  initBucket: function(){
    var bucket = []
    var ks_ori = this.data.ks_ori
    var fields = this.data.fields
    ks_ori.sort(function(){ return (Math.random() - 0.5)})
    var first = ks_ori[0]
    var second = ks_ori[1]

    fields[0][3]["word"] = first["hira"]
    fields[0][3]["roma"] = first["roma"]
    fields[0][3]["active"] = true

    fields[0][4]["word"] = second["hira"]
    fields[0][4]["roma"] = second["roma"]
    fields[0][4]["active"] = true
    
    var lebot = fields[0][3]
    var ritop = fields[0][4]
    bucket.push(lebot, ritop)
    this.setData({bucket, fields})
  },
  
  loadGame: function(new_fields){
    var that = this
    var fields = []
    that.setData({
      fields,
      level:1,
      spin_count:0,
      hita_count:0,
      rest_count:total_step,
    })
    var it = setInterval(function(){
      var row = new_fields.shift()
      if (!row) {
        console.log("------------")
        clearInterval(it)
        return
      }
      fields.push(row)
      //fields = []
      that.setData({fields})
    },120)
  },

  onLoad: function(){
    this.setData({loged:App.globalData.hasLogin})
  },

  onUnload: function(){
    var doctor = this.data.doctor
    clearInterval(doctor)
  },

  onReady: function () {
    console.log("onLoad...")
    this.initKanaRows()
    this.initGame()
  },

  toLogin: function (e) {
    var that = this
    var userInfo = e.detail.userInfo
    console.log("toLogin:")
    if(userInfo){
        App.globalData.hasLogin = true
        App.globalData.userInfo = userInfo
        App.globalData.nickName = userInfo.nickName
        App.globalData.avatarUrl = userInfo.avatarUrl
        var gender = 1
        if (userInfo.gender != "" || userInfo.gender != undefined) gender = userInfo.gender
        App.globalData.gender = gender
        this.setData({
            loged: true,
        })
        that.updateUser()
    }else{
        App.globalData.hasLogin = false
        this.setData({
            loged: false,
        })
    }
  },

  //更新用户到数据库
  updateUser: () => {
    var openid = App.globalData.openid
    var nickName = App.globalData.nickName
    var showName = App.globalData.showName
    var avatarUrl = App.globalData.avatarUrl
    var gender = App.globalData.gender
    wx.request({
        url: urls.updateUser,
        method: 'POST',
        data: {
            openid,
            nickName,
            showName,
            avatarUrl,
            gender,
        },
        success: function (res) {
            console.log('updateUser:')
            console.log(res)
        },
        fail: (res) => {
            console.log('fail:')
            console.log(res)
        }
    });
  },


//-----------------------------------------------------------------------------

click: function(e){
  var that = this
  var fields = that.data.fields
  var currData = e.currentTarget.dataset
  var row = currData.row
  var col = currData.col
  console.log(row, col)

  if (this.data.doctor > 0){
    console.log("=========")
    console.log(fields[row][col])
  }else{
    var doctor = setInterval(()=>{
      var bucket = this.data.bucket
      fields = that.data.fields
      if (bucket.length == 2){
        var right = bucket.pop()
        var left = bucket.pop()
        if (left.row < 10 && right.row < 10 && fields[left.row+1][left.col]["word"] == "" && fields[right.row+1][right.col]["word"] == ""){
          console.log("down...")
          fields[left.row][left.col]["word"] = ""
          fields[right.row][right.col]["word"] = ""
          fields[left.row][left.col]["roma"] = ""
          fields[right.row][right.col]["roma"] = ""
          fields[left.row][left.col]["active"] = false
          fields[right.row][right.col]["active"] = false
  
          //移动到目标点
          fields[left.row+1][left.col]["word"] = left["word"]
          fields[right.row+1][right.col]["word"] = right["word"]

          fields[left.row+1][left.col]["roma"] = left["roma"]
          fields[right.row+1][right.col]["roma"] = right["roma"]
          fields[left.row+1][left.col]["active"] = true
          fields[right.row+1][right.col]["active"] = true
          fields[left.row+1][left.col]["on"] = !fields[left.row+1][left.col]["on"]
          fields[right.row+1][right.col]["on"] = !fields[right.row+1][right.col]["on"]
  
          left = fields[left.row+1][left.col]
          right = fields[right.row+1][right.col]
          bucket.push(left, right)
          this.setData({bucket, fields})
        }else{ //触底
          this.initBucket()
        }

      }else{ //游戏开始
        console.log("bucket-no")
        this.initBucket()
      }
    },3000)
    this.setData({doctor})
  }
  
},

loadRank: function(){
  var that = this
  wx.request({
      url: urls.queryLinkRank,
      method: 'POST',
      success: function (res) {
          console.log('queryLinkRank:')
          var ranks = res.data.data
          console.log(ranks)
          that.setData({ranks})
      }
  });
},

setting:function(e){
  var currData = e.currentTarget.dataset
  var option = currData.option
  if (option == 0){ //icon-setting
    //toggle
    var top_hide = !this.data.top_hide
    var se = this.data.option
    this.setData({
      top_hide,
      rank_hide: se == 1,
      kana_hide: se == 2,
    })
  }else if(option == 1){ //假名设定
    this.setData({
      kana_hide: false,
      rank_hide: true,
      option:1
    })
  }else if(option == 2){ //排行榜
    this.loadRank()
    this.setData({
      kana_hide: true,
      rank_hide: false,
      option:2
    })
  }
  
},
select: function(e){
  var currData = e.currentTarget.dataset
  var row = currData.row
  var col = currData.col
  var ks_all = this.data.ks_all
  var ks_sed = this.data.ks_sed
  if (ks_all[row][col]["roma"] == "") return
  var se = ks_all[row][col]["selected"]
  if(se){
    ks_sed.pop()
    ks_all[row][col]["selected"] = false
  }else{
    ks_sed.push([row,col])
    ks_all[row][col]["selected"] = true
  }
  if (ks_sed.length > max_sed){ //如果点击已选或者大于可选--取消最先选择的
    var ned = ks_sed.shift()
    var n_row = ned[0]
    var n_col = ned[1]
    ks_all[n_row][n_col]["selected"] = false
  }
  
  var sed_size = ks_sed.length
  var is_max = sed_size == max_sed
  this.setData({ks_all,ks_sed,is_max,sed_size})
},

switchKata: function(){
  var kata_on = !this.data.kata_on
  this.setData({kata_on})
},

initGame: function(){
  var ks_ed = []
  var ks_no = []
  var ks_all = this.data.ks_all
  for (let rows of ks_all){
    for(let step of rows){
      if(step.selected){
        ks_ed.push(step)
      }else if(step["roma"]){
        ks_no.push(step)
      }
    }
  }

  ks_no.sort(function(){ return (Math.random() - 0.5)})

  var fill_size = least_sed - ks_ed.length
  fill_size = fill_size > 0 ? fill_size : 0
  var ks_fill = ks_no.slice(0, fill_size)
  ks_ed.push(...ks_fill)
  var ks_ori = ks_ed.concat()
  while (ks_ed.length < valid_sed){
    ks_ed = ks_ed.concat(ks_ed)
  }
  ks_ed = ks_ed.slice(0, valid_sed)
  ks_ed.sort(function(){ return (Math.random() - 0.5)})
  console.log(ks_ed)
  this.setData({top_hide:true,btn_show:false,ks_ori})
  this.initFields(ks_ed)
},

initFields: function(kanas){
  var pos_map = {}
  var new_fields = []
  var kata_on = this.data.kata_on
  for (let row=0;row<max_row;row++){
    var rows = []
    for (let col=0;col<max_col;col++){
      var kana = {}
      var roma = ""
      var word = ""
      var kata = false
      var valid = (row > 8 && (col < 3 || col > 4))
      if (valid){
        kana = kanas.pop()
        roma = kana["roma"]
        if((row+col) % 2 == 0){
          word = kana["hira"]
        }else{
          word = kata_on ? kana["kata"] : kana["hira"]
          kata = true
        }
      }
      
      var step = {row,col,roma,word,kata}
      rows.push(step)
    }
    new_fields.push(rows)
  }

  this.setData({pos_map})
  this.loadGame(new_fields)
},
})