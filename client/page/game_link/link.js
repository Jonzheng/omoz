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
const max_sed = 15
const least_sed = 10
const half_sed = 40
const total_step = 80

Page({

  data: {
    bucket:[],
    this_lefts:[],
    this_rights:[],
    this_ups:[],
    this_downs:[],
    ks_sed:[],
    level:1,
    spin_count:0,
    hita_count:0,
    sed_size:10,
    st_hint:0,
    rest_count:total_step,
    icon_setting:"../../image/setting.png",
    icon_omoz: 'https://systems-1256378396.cos.ap-guangzhou.myqcloud.com/omoz_sm.png',
    bgk_ori: [{"key":"ka","word":"か","price":100},{"key":"ki","word":"き","price":1000},{"key":"ku","word":"く","price":1000},{"key":"ke","word":"け","price":1000},{"key":"ko","word":"こ","price":10000}],
    bgk: [{"key":"ka","word":"か","price":100},{"key":"ki","word":"き","price":1000},{"key":"ku","word":"く","price":1000},{"key":"ke","word":"け","price":1000},{"key":"ko","word":"こ","price":10000}],
    myclst: [{"key":"no","word":""}],
    bgc: {"no":"step-bg-no","ka":"step-bg-ka","ki":"step-bg-ki","ku":"step-bg-ku","ke":"step-bg-ke","ko":"step-bg-ko"},
    cosmap: {"hira":"no", "kata":"no", "space":"no"},
    tipsClass:'tips-hide',
    tip:'',
    spend:0,
    remind:0,
    tips: ['方块的颜色和假名都可以自由设定', '某个地方的方块也可以长按', '据说黑色的方块很好看', '说不定以后会有假名发音呢'],
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
    show_price:0,
    old_coin:0,
    sub_coin:0,
    try_idx:0,
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
  onUnload: function () {
    var count_it = this.data.count_it
    clearInterval(count_it)
},
  onLoad: function(){
    var that = this
    var tips = that.data.tips
    var count_it = setInterval(function(){
      that.data.spend += 3
      if (that.data.spend % 18 == 0){
        var ridx = parseInt(Math.random() * tips.length)
        ridx = Math.min(ridx, tips.length -1)
        var tip = tips[ridx]
        that.setData({tipsClass: 'tips-show', tip})
      }
      that.setData({
        count_it,
      })
    },3000)
    var avatar_url = App.globalData.avatarUrl
    avatar_url = avatar_url ? avatar_url : ""
    var loged = App.globalData.hasLogin
    this.setData({
      loged,
      avatar_url
    })
  },

  onReady: function () {
    var that = this
    this.initKanaRows()
    var openid = App.globalData.openid
    wx.request({
        url: urls.queryLinkRank,
        method: 'POST',
        data: {openid},
        success: function (res) {
            var ranks = res.data.data
            if (ranks.length == 1){
              var rank = ranks[0]
              var cosmap = that.data.cosmap
              var hira = rank.hira
              var kata = rank.kata
              var space = rank.space
              cosmap["hira"] = hira
              cosmap["kata"] = kata
              cosmap["space"] = space
              that.setData({cosmap})
            }
            that.initGame()
        }
    });
    
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
//link_find_road



  rightLink: function(begin_col, end_col, fixed_row){
    console.log("-right")
    var fields = this.data.fields
    var this_lefts = this.data.this_lefts
    var this_ups = this.data.this_ups
    var this_downs = this.data.this_downs
    var steps = []
    var step_col = begin_col
    while (step_col < end_col){
        step_col += 1
        var step = fields[fixed_row][step_col]
        if (step["word"] != "") break
        var row_col = step.row+","+step.col
        steps.push(row_col)
        var idx = this_lefts.indexOf(row_col)
        if (idx != -1){
          steps = steps.concat(this_lefts.slice(0, idx))
          return steps
        }
        idx = this_ups.indexOf(row_col)
        if (idx != -1){
          steps = steps.concat(this_ups.slice(0, idx))
          return steps
        }
        idx = this_downs.indexOf(row_col)
        if (idx != -1){
          steps = steps.concat(this_downs.slice(0, idx))
          return steps
        }
    }//while end
    return []
  },

  downLink: function(begin_row, end_row, fixed_col){
    console.log("-down")
    var fields = this.data.fields
    var this_lefts = this.data.this_lefts
    var this_ups = this.data.this_ups
    var this_rights = this.data.this_rights
    var steps = []
    var step_row = begin_row
    while (step_row < end_row){
        step_row += 1
        var step = fields[step_row][fixed_col]
        if (step["word"] != "") break
        var row_col = step.row+","+step.col
        steps.push(row_col)
        var idx = this_ups.indexOf(row_col)
        if (idx != -1){
          steps = steps.concat(this_ups.slice(0, idx))
          return steps
        }
        idx = this_lefts.indexOf(row_col)
        if (idx != -1){
          steps = steps.concat(this_lefts.slice(0, idx))
          return steps
        }
        idx = this_rights.indexOf(row_col)
        if (idx != -1){
          steps = steps.concat(this_rights.slice(0, idx))
          return steps
        }
    }//while end
    return []
  },

  leftLink: function(begin_col, end_col, fixed_row){
    console.log("-left")
    var fields = this.data.fields
    var this_downs = this.data.this_downs
    var this_ups = this.data.this_ups
    var this_rights = this.data.this_rights
    var steps = []
    var step_col = begin_col
    while (step_col > end_col){
        step_col -= 1
        var step = fields[fixed_row][step_col]
        if (step["word"] != "") break
        var row_col = step.row+","+step.col
        steps.push(row_col)
        var idx = this_rights.indexOf(row_col)
        if (idx != -1){
          steps = steps.concat(this_rights.slice(0, idx))
          return steps
        }
        idx = this_ups.indexOf(row_col)
        if (idx != -1){
          steps = steps.concat(this_ups.slice(0, idx))
          return steps
        }
        idx = this_downs.indexOf(row_col)
        if (idx != -1){
          steps = steps.concat(this_downs.slice(0, idx))
          return steps
        }
    }//while end
    return []
  },

  upLink: function(begin_row, end_row, fixed_col){
    console.log("-up")
    var fields = this.data.fields
    var this_downs = this.data.this_downs
    var this_lefts = this.data.this_lefts
    var this_rights = this.data.this_rights
    var steps = []
    var step_row = begin_row
    while (step_row > end_row){
        step_row -= 1
        var step = fields[step_row][fixed_col]
        if (step["word"] != "") break
        var row_col = step.row+","+step.col
        steps.push(row_col)
        var idx = this_downs.indexOf(row_col)
        if (idx != -1){
          steps = steps.concat(this_downs.slice(0, idx))
          return steps
        }
        idx = this_lefts.indexOf(row_col)
        if (idx != -1){
          steps = steps.concat(this_lefts.slice(0, idx))
          return steps
        }
        idx = this_rights.indexOf(row_col)
        if (idx != -1){
          steps = steps.concat(this_rights.slice(0, idx))
          return steps
        }
    }//while end
    return []
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
  autoLink: function(this_row, this_col){
    var fields = this.data.fields
    var pos_map = this.data.pos_map

    //var roma = fields[this_row][this_col]["roma"]
    //var pos = pos_map[roma]
    //距离排序--逆序
  //pos.sort(function(a,b){return (a[0]-this_row)**2+(a[1]-this_col)**2 < (b[0]-this_row)**2+(b[1]-this_col)**2})
  //console.log("pos:")
  //console.log(pos)
  //for(let p of pos){
  //  console.log(p[0],p[1])
  //}
  //this.setData({fields})
    //console.log("up:")
    //up_pos
    if (this_row > 0){
      console.log("up_pos")
      var up_row = this_row - 1
      var up_roma = fields[up_row][this_col]["roma"]
      var up_pos = pos_map[up_roma]
      up_pos.sort(function(a,b){return (a[0]-up_row)**2+(a[1]-this_col)**2 < (b[0]-up_row)**2+(b[1]-this_col)**2})
      for(let p of up_pos){
        
        var row = p[0]
        var col = p[1]
        if (fields[row][col]["status"] == 0) break
        console.log("--start",row, col,fields[row][col]["word"])
        
        var linked = this.linkDirect(up_row, this_col, row, col)
        if (linked) {
          console.log("--link-true")
          this.setData({auto:false})
          break
        }
      }
    }
    console.log("--end")
    //this.setData({fields})
    return

    //down_pos
    if (this_row < max_row-1){
      console.log("down_pos")
      var down_row = this_row + 1
      var down_roma = fields[down_row][this_col]["roma"]
      var down_pos = pos_map[down_roma]
      down_pos.sort(function(a,b){return (a[0]-down_row)**2+(a[1]-this_col)**2 < (b[0]-down_row)**2+(b[1]-this_col)**2})
      for(let p of down_pos){
        console.log(p)
        fields[p[0]][p[1]]["active"] = true
      }
    }

    //left_pos
    if (this_col > 0){
      console.log("left_pos")
      var left_col = this_col - 1
      var left_roma = fields[this_row][left_col]["roma"]
      var left_pos = pos_map[left_roma]
      left_pos.sort(function(a,b){return (a[0]-this_row)**2+(a[1]-left_col)**2 < (b[0]-this_row)**2+(b[1]-left_col)**2})
      for(let p of left_pos){
        console.log(p)
        fields[p[0]][p[1]]["active"] = true
      }
    }

    //right_pos
    if (this_col < max_col-1){
      console.log("right_pos")
      var right_col = this_col + 1
      var right_roma = fields[this_row][right_col]["roma"]
      var right_pos = pos_map[right_roma]
      right_pos.sort(function(a,b){return (a[0]-this_row)**2+(a[1]-right_col)**2 < (b[0]-this_row)**2+(b[1]-right_col)**2})
      for(let p of right_pos){
        console.log(p)
        fields[p[0]][p[1]]["active"] = true
      }
    }

  },

  hideBoth: function(old_row, old_col, this_row, this_col, steps){
    var fields = this.data.fields
    var this_step = fields[this_row][this_col]
    var old_step = fields[old_row][old_col]
    //解锁假名
    if (this_step["word"] != old_step["word"]){
      var puzs = this.data.puzs
      var roma = this_step["roma"]
      if (puzs && puzs.size > 0) {
        puzs.add(roma)
      }else{
        puzs = new Set([roma])
      }
      this.setData({puzs})
      this.data.hita_count += 1
    }
    var sold = old_row+","+old_col
    var sthis = this_row+","+this_col
    var both = [sold, sthis]
    steps = steps.concat(both)
    this.passStep(steps)

    var sakki_roma = this_step["roma"]
    var sakki_hira = this_step["hira"]
    var sakki_kata = this_step["kata"]

    //if(steps.length > 2 && this.data.auto){
    //  this.autoLink(this_row, this_col)
    //}

    this_step["word"] = ""
    old_step["word"] = ""
    this_step["active"] = false
    old_step["active"] = false
    this_step["roma"] = sthis
    old_step["roma"] = sold

    this.setData({
      fields,
      skon:false,
      sakki_roma,
      sakki_hira,
      sakki_kata,
    })
    return true
  },

  passStep: function(steps){
    var fields = this.data.fields
    for (let step of steps){
      var rc = step.split(",")
      var row = rc[0]
      var col = rc[1]
      fields[row][col]["on"] = !fields[row][col]["on"]
    }
    //记录分数用
    var spin_count = this.data.spin_count
    var rest_count = this.data.rest_count
    rest_count -= 2
    var to_spin = spin_count + steps.length

    var spit = setInterval(()=>{
      if(spin_count < to_spin){
        spin_count += 1
        this.setData({spin_count})
      }else{
        clearInterval(spit)
      }
    },66)

    this.setData({
      fields,
      rest_count
    })

    //分数结算
    if (rest_count == 0){
      setTimeout(()=>{
        this.initResult()
      },500)
      setTimeout(()=>{
        this.setData({btn_show:true})
      },3000)
    }
  },

  initTargetPoint: function(this_row, this_col){
    var fields = this.data.fields
    var this_lefts = []
    var this_rights = []
    var this_ups = []
    var this_downs = []

    var step_col = this_col
    while (step_col > 0){
        step_col -= 1
        var step = fields[this_row][step_col]
        if (step["word"] != "") break
        this_lefts.push(step.row+","+step.col)
    }
    step_col = this_col
    while (step_col < max_col-1){
        step_col += 1
        var step = fields[this_row][step_col]
        if (step["word"] != "") break
        this_rights.push(step.row+","+step.col)
    }
    var step_row = this_row
    while (step_row > 0){
        step_row -= 1
        var step = fields[step_row][this_col]
        if (step["word"] != "") break
        this_ups.push(step.row+","+step.col)
    }
    step_row = this_row
    while (step_row < max_row-1){
        step_row += 1
        var step = fields[step_row][this_col]
        if (step["word"] != "") break
        this_downs.push(step.row+","+step.col)
    }
    this.setData({
      this_lefts,
      this_rights,
      this_ups,
      this_downs
    })
  },

  linkDirect: function(old_row, old_col, this_row, this_col){
      var fields = this.data.fields
      var steps = []
      if (this.isNext(old_row, old_col, this_row, this_col)){
          console.log("is next")
          return this.hideBoth(old_row, old_col, this_row, this_col, steps)
      }
      this.initTargetPoint(this_row, this_col)
      //从old_开始寻路
      steps = this.rightLink(old_col, this_col, old_row)
      if(steps.length > 0) {
        return this.hideBoth(old_row, old_col, this_row, this_col, steps)
      }
      steps = this.downLink(old_row, this_row, old_col)
      if (steps.length > 0){
        return this.hideBoth(old_row, old_col, this_row, this_col, steps)
      }
      steps = this.leftLink(old_col, this_col, old_row)
      if (steps.length > 0){
        return this.hideBoth(old_row, old_col, this_row, this_col, steps)
      }
      steps = this.upLink(old_row, this_row, old_col)
      if (steps.length > 0){
        return this.hideBoth(old_row, old_col, this_row, this_col, steps)
      }
      console.log("2-right")
      var steps_sec =[]
      var step_col = old_col
      while (step_col < max_col - 1){
          step_col += 1
          var step = fields[old_row][step_col]
          if (step["word"] != "") break
          var row_col = step.row+","+step.col
          steps.push(row_col)
          //(begin_row, end_row, fixed_col)
          steps_sec = this.upLink(step.row, this_row, step.col)
          if (steps_sec.length > 0) {
              steps = steps.concat(steps_sec)
              return this.hideBoth(old_row, old_col, this_row, this_col, steps)
          }
          steps_sec = this.downLink(step.row, this_row, step.col)
          if (steps_sec.length > 0) {
            steps = steps.concat(steps_sec)
            return this.hideBoth(old_row, old_col, this_row, this_col, steps)
          }
      }
      console.log("2-left")
      steps = []
      var step_col = old_col
      while (step_col > 0){
          step_col -= 1
          var step = fields[old_row][step_col]
          if (step["word"] != "") break
          var row_col = step.row+","+step.col
          steps.push(row_col)
          //(begin_row, end_row, fixed_col)
          steps_sec = this.upLink(step.row, this_row, step.col)
          if (steps_sec.length > 0) {
            steps = steps.concat(steps_sec)
              return this.hideBoth(old_row, old_col, this_row, this_col, steps)
          }
          steps_sec = this.downLink(step.row, this_row, step.col)
          if (steps_sec.length > 0) {
            steps = steps.concat(steps_sec)
            return this.hideBoth(old_row, old_col, this_row, this_col, steps)
          }
      }
      console.log("2-down")
      steps = []
      var step_row = old_row
      while (step_row < max_row - 1){
          step_row += 1
          var step = fields[step_row][old_col]
          if (step["word"] != "") break
          var row_col = step.row+","+step.col
          steps.push(row_col)
          //(begin_col, end_col, fixed_row)
          steps_sec = this.leftLink(step.col, this_col, step.row)
          if (steps_sec.length > 0) {
            steps = steps.concat(steps_sec)
            return this.hideBoth(old_row, old_col, this_row, this_col, steps)
          }
          steps_sec = this.rightLink(step.col, this_col, step.row)
          if (steps_sec.length > 0) {
            steps = steps.concat(steps_sec)
            return this.hideBoth(old_row, old_col, this_row, this_col, steps)
          }
      }
      console.log("2-up")
      steps = []
      var step_row = old_row
      while (step_row > 0){
          step_row -= 1
          var step = fields[step_row][old_col]
          if (step["word"] != "") break
          var row_col = step.row+","+step.col
          steps.push(row_col)
          //(begin_col, end_col, fixed_row)
          steps_sec = this.leftLink(step.col, this_col, step.row)
          if (steps_sec.length > 0) {
            steps = steps.concat(steps_sec)
            return this.hideBoth(old_row, old_col, this_row, this_col, steps)
          }
          steps_sec = this.rightLink(step.col, this_col, step.row)
          if (steps_sec.length > 0) {
            steps = steps.concat(steps_sec)
            return this.hideBoth(old_row, old_col, this_row, this_col, steps)
          }
      }
      return false
  },
  goLink: function(e){
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
        //console.log(old_row, old_col)
        if (old_rc != rc){
          old_step["active"] = false
          bucket.pop()
          bucket.push([row,col])
          if (old_step["word"] != "" && this_step["roma"]==old_step["roma"]){
            this.linkDirect(old_row, old_col, row, col)
            // 清空提示
            this.data.remind = 0
            this.data.spend = 0
            this.setData({tipsClass: 'tips-hide'})
          }else if (old_step["word"] != "" && this_step["word"] != ""){
            console.log("remind...")
            this.data.remind += 1
            if (this.data.remind > 5) {
              var tip = Math.random() > 0.5 ? '忘记罗马音时可以长按方块查看' : '觉得难的话可以自选假名和关闭片假名哦'
              this.setData({tipsClass: 'tips-show', tip})
            }
          }
        }
    }else{
      bucket.push([row,col])
    }
    this.setData({fields,bucket})

  },

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

//---------------------------------------------

  initResult: function(){
    var that = this
    var fields = this.data.fields
    var spin_count = this.data.spin_count
    var hita_count = this.data.hita_count
    var sed_size = this.data.sed_size
    sed_size = Math.max(sed_size, 10)
    var point = Math.round( (spin_count + hita_count * 10) * sed_size/10 )
    var check_coin = Math.round(point * 1.2 / 10)
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

    new_fields[10][0]["word"] = "金"
    new_fields[10][1]["word"] = "币"
    new_fields[10][2]["word"] = "+"
    new_fields[10][3]["word"] = "" + parseInt(check_coin / 100 % 10)
    new_fields[10][4]["word"] = "" + parseInt(check_coin / 10 % 10)
    new_fields[10][5]["word"] = "" + check_coin % 10

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
            check_coin,
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

  initBGK: function(sdate, ldate){
    var bgk = this.data.bgk
    var bgk_ori = this.data.bgk_ori
    if (sdate != ldate){
      for (let kp of bgk){
        kp["word"] = "签"
      }
    }else{
      bgk = bgk_ori
    }
    this.setData({bgk})
  },

  initColor: function(rank){
    var old_coin = rank.old_coin
    if (!old_coin) old_coin = 0
    var my_coin = rank.coin
    var myco = rank.myco
    var mycos = myco.split(",")
    var myclst = []
    for (let kk of mycos){
      var cod = {"key":kk,"word":""}
      myclst.push(cod)
    }
    this.setData({
      my_coin,
      old_coin,
      myco,
      myclst
    })
  },

  checkRank: function(check_coin, ran){
    var that = this
    var openid = App.globalData.openid
    wx.request({
        url: urls.checkLinkRank,
        method: 'POST',
        data: {openid, check_coin, ran},
        success: function (res) {
            var ranks = res.data.data
            console.log(ranks)
            if (ranks.length != 1) return
            var rank = ranks[0]
            console.log(rank)
            var sdate = rank["s_date"].substring(0, 10)
            var ldate = rank["latest"].substring(0, 10)
            that.initBGK(sdate, ldate)
            that.initColor(rank)
        }
    });
  },

  loadRank: function(){
    var that = this
    wx.request({
        url: urls.queryLinkRank,
        method: 'POST',
        success: function (res) {
            var ranks = res.data.data
            for (let rank of ranks){
              var myco = rank.myco
              var colst = myco.split(",")
              rank["colst"] = colst
            }
            that.setData({ranks})
        }
    });
  },

  setting:function(e){
    if (!this.data.loged) return
    var currData = e.currentTarget.dataset
    var option = currData.option
    if (option == 0){ //icon-setting
      //toggle
      var top_hide = !this.data.top_hide
      var se = this.data.option
      this.setData({
        option: 1,
        top_hide,
        stn: 0,
        puzon: top_hide,
        rank_hide: se == 1,
        kana_hide: se == 2,
        color_hide: se == 3,
      })
      var ch_color = this.data.ch_color
      if(ch_color) this.updateColor()

    }else if(option == 1){ //假名设定
      this.setData({ option:1 })
    }else if(option == 2){ //排行榜
      this.loadRank()
      this.setData({ option:2 })
    }else if(option == 3){ //颜色设定
      this.checkRank(0, 0)
      this.setData({ option:3 })
    }
    this.setData({old_coin:0, sub_coin:0, buy_log:""})
    
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

  setPuzMap: function(puz){
    var puz_map = {}
    if (puz && puz != ""){
        var puz_sp = puz.split(";")
        for (let sp of puz_sp){
            sp = sp.trim()
            var sps = sp.split(",")
            var spk = sps[0]
            if (!spk || spk == "") continue
            var spv = sps[1]
            puz_map[spk] = spv
        }
    }
    this.setData({puz_map})
    return puz_map
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
            var ranks = res.data.data
            if (ranks.length != 1) return
            var rank = ranks[0]
            var re_puz = rank.puz
            that.setPuzMap(re_puz)
            that.setData({puzon})
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
    //concat(ks_fill)
    ks_ed.push(...ks_fill)
    var ks_ori = ks_ed.concat()
    while (ks_ed.length < half_sed){
      ks_ed = ks_ed.concat(ks_ed)
    }
    ks_ed = ks_ed.slice(0, half_sed)
    ks_ed.sort(function(){ return (Math.random() - 0.5)})
    var t_kanas = ks_ed.concat()
    t_kanas.sort(function(){ return (Math.random() - 0.5)})
    //console.log(ks_ed.length)
    this.setData({top_hide:true,btn_show:false, ks_ori})
    this.initFields(ks_ed, t_kanas)
  },

  initFields: function(kanas, t_kanas){
    //total_step = kanas + t_kanas
    var pos_map = {}
    var new_fields = []
    var kon = this.data.kon
    for (let row=0;row<max_row;row++){
      var rows = []
      for (let col=0;col<max_col;col++){
        var kana = {}
        var space1 = (row == 6 && col > 0 && col < max_col-1)
        var space2  = (row == 3 && col > 2 && col < 5)
        if((row+col) % 2 == 0){
          if (!space1 && !space2) kana = kanas.pop()
          var roma = kana["roma"] ? kana["roma"] : ""
          var hira = kana["hira"] ? kana["hira"] : ""
          var kata = kana["kata"] ? kana["kata"] : ""
          var word = hira
          var kton = false
        }else{
          if (!space1 && !space2) kana = t_kanas.pop()
          var roma = kana["roma"] ? kana["roma"] : ""
          var hira = kana["hira"] ? kana["hira"] : ""
          var kata = kana["kata"] ? kana["kata"] : ""
          var word = kon ? kata : hira
          var kton = kon
        }
        //couple
        if(pos_map[roma]){
          pos_map[roma].push([row,col])
        }else{
          pos_map[roma] = [[row,col]]
        }

        var step = {row,col,roma,hira,kata,word,kton}
        rows.push(step)
      }
      new_fields.push(rows)
    }

    this.setData({pos_map})
    this.loadGame(new_fields)
  },


  //--------------------------------

  prebuy: function(e){
    var currData = e.currentTarget.dataset
    var key = currData.key
    var word = currData.word
    var stn = this.data.stn
    var cosmap = this.data.cosmap
    var ck = "c" + stn

    //点击我的颜色
    if ("" == word){ //颜色更换
      if (stn == 1 ) cosmap["hira"] = key
      if (stn == 2 ) cosmap["kata"] = key
      if (stn == 3 ) cosmap["space"] = key
      cosmap[ck] = !cosmap[ck]
      if (stn != 0) this.setData({ch_color:true})

    //购买颜色
    }else if ("签" == word){ //日签
      var bgk_ori = this.data.bgk_ori
      var bgk = bgk_ori
      this.setData({bgk, old_coin:0, sub_coin:0, buy_log:""})
      var ran = Math.random()
      var check_coin = parseInt(ran * 666)
      check_coin = Math.max(100, check_coin)
      this.checkRank(check_coin, check_coin)
    }else{ //兑换颜色
      var bgk = this.data.bgk
      for (let bgc of bgk){
        bgc["active"] = false
        if (key == bgc["key"]) bgc["active"] = true
      }
      var show_price = currData.price
      var myco = this.data.myco
      if (myco.includes(key)) show_price = "已兑换"
      var try_idx = 0
      var buy_log = ""
      var sub_coin = 0
      var co_key = key
      this.setData({show_price, bgk, try_idx, buy_log, co_key, sub_coin})
    }
    this.setData({
      cosmap,
    })
  },

  setColor: function(e){
    var currData = e.currentTarget.dataset
    var stn = currData.stn
    if (stn == this.data.stn) stn = 0
    this.setData({stn})
  },

  buy: function(e){
    var co_key = this.data.co_key
    var currData = e.currentTarget.dataset
    var key = currData.key
    var show_price = this.data.show_price
    if (key != co_key || "已兑换" == show_price) return
    wx.vibrateLong()
    var that = this
    var openid = App.globalData.openid
    var price = currData.price
    var coin = this.data.my_coin
    var try_idx = this.data.try_idx
    if (price > coin){
      var log_lst = ["金币不足!","金币不够啦!","玩游戏&赚金币!","玩游戏&赚金币!!","玩游戏&赚金币!!!","...ん?",".........","...............","(╯°Д°)╯︵ ┻━┻","真的是金币不够了!!!"]
      var buy_log = log_lst[try_idx]
      try_idx += 1
      try_idx = Math.min(log_lst.length - 1, try_idx)
      that.setData({buy_log, try_idx})
      return
    }
    if ("ko" == key){ //购买黑色
      wx.request({
        url: urls.queryLinkRank,
        method: 'POST',
        data: {openid},
        success: function (res) {
            var ranks = res.data.data
            if (ranks.length != 1) return
            var rank = ranks[0]
            var re_puz = rank.puz
            var puz_map = that.setPuzMap(re_puz)
            var canbuy = true
            var roman = 0
            for (let kk in puz_map){
              if (!kk || kk=="") continue
              if (puz_map[kk] < 10){
                canbuy = false
                break
              }
              roman += 1
            }
            if (roman < 46) canbuy = false
            console.log("canbuy?", canbuy, roman)
            if (canbuy){
              that.buyColor(key, coin, price)
            }else{ //条件未解锁
              var buy_log = "兑换条件不满足!"
              that.setData({buy_log})
            }
        }
      });

    }else{ //购买非黑色
      that.buyColor(key, coin, price)
    }
  },

  buyColor: function(color, coin, price){
    var that = this
    var openid = App.globalData.openid
    var balance = coin - price
    var sub_coin = price
    wx.request({
      url: urls.buyLinkColor,
      method: 'POST',
      data: {openid, color, balance},
      success: function (res) {
          var ranks = res.data.data
          if (ranks.length != 1) return
          var rank = ranks[0]
          var show_price = "已兑换"
          var buy_log = "兑换成功!"
          that.setData({sub_coin, buy_log, show_price})
          that.initColor(rank)
      }
    });
  },

  updateColor: function(){
    var that = this
    var openid = App.globalData.openid
    var cosmap = this.data.cosmap
    var hira = cosmap["hira"]
    var kata = cosmap["kata"]
    var space = cosmap["space"]
    that.setData({ch_color:false})
    wx.request({
      url: urls.updateColor,
      method: 'POST',
      data: {openid, hira, kata, space},
      success: function () {
        that.setData({ch_color:false})
      }
    });
  },
  onShareAppMessage() {
      return {
          title: '假名·连连看',
          path: '/page/index/game',
      }
  }
})