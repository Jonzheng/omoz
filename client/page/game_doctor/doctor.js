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
const max_sed = 5
const least_sed = 5
const half_sed = 44
const total_step = 44
const step_bg = ["step-bg-red","step-bg-blue","step-bg-zero","step-bg-one","step-bg-two"]

Page({

  data: {
    bucket:[],
    ks_sed:[],
    level:1,
    spin_count:0,
    hita_count:0,
    sed_size:10,
    st_hint:0,
    rest_count:total_step,
    icon_setting:"../../image/setting.png",
    icon_omoz: 'https://systems-1256378396.cos.ap-guangzhou.myqcloud.com/omoz_sm.png',
    option: 1,
    top_hide: true,
    rank_hide: true,
    kana_hide: true,
    kon: true,
    skon:false,
    puzon:false,
    sakki_hira:"",
    sakki_kata:"",
    sakki_roma:"",
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
    //console.log(ks_all)
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
  
  loadGame: function(new_fields){
    var that = this
    var fields = []
    that.setData({
      fields,
      sakki_roma: "",
      bucket: [],
      puzs: [],
      level:1,
      spin_count:0,
      hita_count:0,
      rest_count:total_step,
    })
    var it = setInterval(function(){
      var row = new_fields.shift()
      if (!row) {
        clearInterval(it)
        return
      }
      fields.push(row)
      //fields = []
      that.setData({fields})
    },120)
  },

  onLoad: function(){
    var avatar_url = App.globalData.avatarUrl
    avatar_url = avatar_url ? avatar_url : ""
    var loged = App.globalData.hasLogin
    this.setData({
      loged,
      avatar_url
    })
  },

  onReady: function () {
    this.initKanaRows()
    this.initGame()
  },

  toLogin: function (e) {
    var that = this
    var userInfo = e.detail.userInfo
    if(userInfo){
        var openid = App.globalData.openid
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = 1
        if (userInfo.gender != "" || userInfo.gender != undefined) gender = userInfo.gender
        wx.request({
            url: urls.updateUser,
            method: 'POST',
            data: {
                openid,
                nickName,
                avatarUrl,
                gender,
            },
            success: function (res) {
                console.log('updateUser:')
                var user = res.data.data[0]
                console.log(user)
                var show_name = user.show_name
                var nick_name = user.nick_name
                var avatar_url = user.avatar_url
                App.globalData.hasLogin = true
                App.globalData.userInfo = user
                App.globalData.nickName = nick_name
                App.globalData.showName = show_name
                App.globalData.avatarUrl = avatar_url
                App.globalData.gender = gender
                that.setData({
                    loged: true,
                    avatar_url,
                    nick_name,
                    show_name
                })
            },
        });

    }else{
        App.globalData.hasLogin = false
        this.setData({
            loged: false,
        })
    }
},


//-----------------------------------------------------------------------------

  showRoma: function(e){
    var currData = e.currentTarget.dataset
    var word = currData.word
    var st_hint = this.data.st_hint
    if (word == "" || st_hint != 0) return
    wx.vibrateLong()
    var fields = this.data.fields
    var row = currData.row
    var col = currData.col
    var this_step = fields[row][col]
    this_step["hint"] = true
    
    var st_hint = setTimeout(()=>{
      this_step["hint"] = false
      this.setData({fields, st_hint:0})
    },1000)

    this.setData({fields, st_hint})
  },

  sakki: function(){
    var skon = !this.data.skon
    this.setData({skon})
  },

  sleep: function(d){
    var t = Date.now();
    while(Date.now() - t <= d);
  },

  //下落:down
  down: function(){
    var fields = this.data.fields
    var cols = this.data.cols
    cols.sort()
    console.log("down.....")
    for (let col of cols){
      this.sleep(16)
      //从下往上
      for (let row=max_row-1; row>=0; row--){
        if (fields[row][col]["word"] == ""){
          //需要交换的空白方块
          var empty_step = fields[row][col]
          var empty_on = empty_step["on"]
          var empty_don = empty_step["don"]
          for (let ro=row; ro>=0; ro--){
            if (fields[ro][col]["word"] != ""){
              //找到第一个下落的方块
              var word_step = fields[ro][col]
              var word_on = word_step["on"]
              var word_don = word_step["don"]
              word_step["row"] = row
              empty_step["row"] = ro

              fields[ro][col] = empty_step
              fields[ro][col]["on"] = word_on
              fields[ro][col]["don"] = word_don
              fields[row][col] = word_step
              fields[row][col]["on"] = empty_on
              fields[row][col]["don"] = empty_don

              break
            }
          }
        }
      }
      this.setData({fields})
    }
    this.fillFields()
    this.judge()
    console.log("down end")
  },

  judge: function(){
    var fields = this.data.fields
    console.log("judge:")
    var desut = []

    //行:row
    for (let row=0; row<max_row; row++){
      var desu = []
      for (let col=0; col<max_col; col++){
        var step = fields[row][col]
        var dlen = desu.length
        if (dlen > 0){
          var old = desu[dlen-1]
          if (old["roma"] == step["roma"]){
            desu.push(step)
            if (desu.length > 2){
              desut = desut.concat(desu)
            }
          }else{ //!=
            desu = [step]
          }
        }else{ //desu=[]
          desu.push(step)
        }
      }
    } //for row end

    //列:col
    for (let col=0; col<max_col; col++){
      var desu = []
      for (let row=0; row<max_row; row++){
        var step = fields[row][col]
        var dlen = desu.length
        if (dlen > 0){
          var old = desu[dlen-1]
          if (old["roma"] == step["roma"]){
            desu.push(step)
            if (desu.length > 2){
              desut = desut.concat(desu)
            }
          }else{ //!=
            desu = [step]
          }
        }else{ //desu=[]
          desu.push(step)
        }
      }
    } //for col end

    var cols = []
    var rcst = new Set([])
    for (step of desut){
      var row = step["row"]
      var col = step["col"]
      var row_col = row+","+col
      if (rcst.has(row_col)) continue
      rcst.add(row_col)
      cols.push(col)
      fields[row][col]["roma"] = row_col
      fields[row][col]["word"] = ""
      fields[row][col]["on"] = !fields[row][col]["on"]
      fields[row][col]["don"] = !fields[row][col]["don"]
    }
    this.setData({fields, cols})
    setTimeout(()=>{
      this.down()
    },500)
    
  },

  isNext: function(old_row, old_col, this_row, this_col){
    if (old_col == this_col && Math.abs(old_row - this_row) == 1){
        return true
    }
    if (old_row == this_row && Math.abs(old_col - this_col) == 1){
        return true
    }
    return false
  },

  swap: function(e){
    console.log("-----------")
    var currData = e.currentTarget.dataset
    var word = currData.word
    var st_hint = this.data.st_hint
    if (word == "" || st_hint != 0) return
    var bucket = this.data.bucket
    var fields = this.data.fields
    var row = currData.row
    var col = currData.col
    var this_step = fields[row][col]
    this_step["active"] = true
    if (bucket.length > 0){
        var olds = bucket[0]
        var old_row = olds[0]
        var old_col = olds[1]
        var old_step = fields[old_row][old_col]
        var old_rc = old_row+""+old_col
        var rc = row+""+col
        if (old_rc != rc){
          old_step["active"] = false
          bucket.pop()
          if (this.isNext(old_row, old_col, row, col)){
            bucket.pop()
            this_step["active"] = false

            this_step["row"] = old_row
            this_step["col"] = old_col
            old_step["row"] = row
            old_step["col"] = col
            var old_don = fields[old_row][old_col]["don"]
            var this_don = fields[row][col]["don"]
            
            fields[old_row][old_col]["don"] = !this_don
            fields[row][col]["don"] = !old_don

            fields[old_row][old_col] = this_step
            fields[row][col] = old_step

            this.setData({fields,bucket})
            this.judge()
          }else{ //not next
            bucket.push([row,col])
            this.setData({fields,bucket})
          }
        }
    }else{
      bucket.push([row,col])
      this.setData({fields,bucket})
    }
    console.log("swap end")
  },

//---------------------------------------------

  initResult: function(){
    var that = this
    var fields = this.data.fields
    var spin_count = this.data.spin_count
    var hita_count = this.data.hita_count
    var sed_size = this.data.sed_size
    sed_size = Math.max(sed_size, 10)
    var point = Math.round( (spin_count + hita_count * 10) * sed_size/10 )
    var new_fields = fields
    new_fields[0][0]["word"] = "旋"
    new_fields[0][1]["word"] = "转"
    new_fields[0][2]["word"] = "方"
    new_fields[0][3]["word"] = "块"
    
    new_fields[1][2]["word"] = "" + parseInt(spin_count / 1000 % 10)
    new_fields[1][3]["word"] = "" + parseInt(spin_count / 100 % 10)
    new_fields[1][4]["word"] = "" + parseInt(spin_count / 10 % 10)
    new_fields[1][5]["word"] = "" + spin_count % 10

    new_fields[2][0]["word"] = "异"
    new_fields[2][1]["word"] = "名"
    new_fields[2][2]["word"] = "连"
    new_fields[2][3]["word"] = "接"
    new_fields[3][2]["word"] = "" + parseInt(hita_count / 10 % 10)
    new_fields[3][3]["word"] = "" + hita_count % 10

    new_fields[4][0]["word"] = "假"
    new_fields[4][1]["word"] = "名"
    new_fields[4][2]["word"] = "数"
    new_fields[4][3]["word"] = "量"
    new_fields[5][2]["word"] = "" + parseInt(sed_size / 10 % 10)
    new_fields[5][3]["word"] = "" + sed_size % 10

    new_fields[6][0]["word"] = "得"
    new_fields[6][1]["word"] = "分"
    new_fields[7][2]["word"] = "" + parseInt(point / 1000 % 10)
    new_fields[7][3]["word"] = "" + parseInt(point / 100 % 10)
    new_fields[7][4]["word"] = "" + parseInt(point / 10 % 10)
    new_fields[7][5]["word"] = "" + point % 10

    new_fields[8][0]["word"] = "最"
    new_fields[8][1]["word"] = "高"
    var openid = App.globalData.openid

    //解锁假名
    var puzs = this.data.puzs
    var puz = ""
    if (puzs && puzs.size > 0) {
      puz = Array.from(puzs) + ""
    }
    console.log(puz)
    wx.request({
        url: urls.saveLinkRank,
        method: 'POST',
        data: {
            openid,
            point,
            status: 1,
            puz,
        },
        success: function (res) {
            console.log('saveLinkRank:')
            console.log(res)
            var rank = res.data.data[0]
            var best = Math.max(point, rank.point)
            new_fields[9][2]["word"] = "" + parseInt(best / 1000 % 10)
            new_fields[9][3]["word"] = "" + parseInt(best / 100 % 10)
            new_fields[9][4]["word"] = "" + parseInt(best / 10 % 10)
            new_fields[9][5]["word"] = "" + best % 10
            that.loadGame(new_fields)
        }
    });
    
  },

  loadRank: function(){
    var that = this
    wx.request({
        url: urls.queryLinkRank,
        method: 'POST',
        success: function (res) {
            console.log('queryLinkRank:')
            var ranks = res.data.data
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
        puzon: top_hide,
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

  showPuz: function(){
    var that = this
    var openid = App.globalData.openid
    var puzon = !this.data.puzon
    if (puzon){
      wx.request({
        url: urls.queryLinkRank,
        method: 'POST',
        data: {openid},
        success: function (res) {
            var rank = res.data.data[0]
            console.log(rank)
            var re_puz = rank.puz
            var puz_map = {}
            if (re_puz && re_puz != ""){
                var puz_sp = re_puz.split(";")
                for (let sp of puz_sp){
                    if (sp == "") continue
                    var sps = sp.split(",")
                    var spk = sps[0]
                    var spv = sps[1]
                    puz_map[spk] = spv
                }
            }
            that.setData({puz_map, puzon})
        }
      });

    }else{
      that.setData({puzon})
    }

  },

  switchKata: function(){
    var kon = !this.data.kon
    this.setData({kon})
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

    var bgc = {}
    var bgs = step_bg.concat()
    bgs.sort(function(){ return (Math.random() - 0.5)})
    for (let i = 0;i<ks_ed.length; i++){
      var roma = ks_ed[i]["roma"]
      bgc[roma] = bgs.pop()
    }

    var ks_ori = ks_ed.concat()
    while (ks_ed.length < half_sed * 2){
      ks_ed = ks_ed.concat(ks_ed)
    }
    ks_ed = ks_ed.slice(0, half_sed * 2)
    ks_ed.sort(function(){ return (Math.random() - 0.5)})

    this.setData({top_hide:true,btn_show:false, ks_ori, bgc})
    this.initFields(ks_ed)
  },

  initFields: function(kanas){
    var new_fields = []
    var kon = this.data.kon
    for (let row=0;row<max_row;row++){
      var rows = []
      for (let col=0;col<max_col;col++){
        var kana = kanas.pop()
        if(Math.random() > 0){
          var roma = kana["roma"] ? kana["roma"] : ""
          var hira = kana["hira"] ? kana["hira"] : ""
          var kata = kana["kata"] ? kana["kata"] : ""
          var word = hira
          var kton = false
        }else{
          var roma = kana["roma"] ? kana["roma"] : ""
          var hira = kana["hira"] ? kana["hira"] : ""
          var kata = kana["kata"] ? kana["kata"] : ""
          var word = kon ? kata : hira
          var kton = kon
        }

        var step = {row,col,roma,hira,kata,word,kton}
        rows.push(step)
      }
      new_fields.push(rows)
    }

    this.loadGame(new_fields)
  },

  fillFields: function(){
    var ks_ori = this.data.ks_ori.concat()
    var fields = this.data.fields
    for (let row=0;row<max_row;row++){
      for (let col=0;col<max_col;col++){
        if(fields[row][col]["word"] == ""){
          var old_on = fields[row][col]["on"]
          var old_don = fields[row][col]["don"]
          var idx = parseInt(Math.random()*10)%5
          var kana = ks_ori[idx]
          var roma = kana["roma"] ? kana["roma"] : ""
          var hira = kana["hira"] ? kana["hira"] : ""
          var kata = kana["kata"] ? kana["kata"] : ""
          var word = hira
          var kton = false
          var step = {row,col,roma,hira,kata,word,kton,old_on, old_don}
          fields[row][col] = step
        }
      }
    }
    this.setData({fields})
  },


})