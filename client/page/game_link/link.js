

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


const max_row = 10
const max_col = 8
const max_sed = 10
const fix_sed = 8

Page({

  data: {
    bucket:[],
    this_lefts:[],
    this_rights:[],
    this_ups:[],
    this_downs:[],
    ks_sed:[],
    level_box:"level-1",
    level:1,
    spin_count:0,
    rest_count:72,
    avatarUrl:"../../image/heart_full.png",
    icon_setting:"../../image/setting.png",
    showName:"地表最强地表最强",
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
    console.log(ks_all)
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
      level:1,
      spin_count:0,
      rest_count:72,
    })
    var it = setInterval(function(){
      var step = new_fields.shift()
      if (!step) {
        clearInterval(it)
        return
      }
      fields.push(step)
      //fields = []
      that.setData({fields})
    },200)
  },

  initGame0: function(){
    var kanas = kana_a.concat(kana_ka).concat(kana_sa).concat(kana_ta).concat(kana_na).concat(kana_ha).concat(kana_ma).concat(kana_ya).concat(kana_ra).concat(kana_wa).concat(kana_n)
    //46
    console.log(kanas.length)
    //8x10-2x6 = 70/2 = 35
    kanas.sort(function(){ return (Math.random() - 0.5)})
    //slice splice(change origin)
    kanas = kanas.slice(0, 10) //12
    var sp = kanas.slice(0, 8) //6
    sp = sp.concat(sp) //12
    sp = sp.concat(sp) //24
    kanas = kanas.concat(kanas) //24
    kanas = kanas.concat(kanas) //48
    kanas = kanas.concat(sp) //48+24
    kanas.sort(function(){ return (Math.random() - 0.5)})
    console.log(kanas.length)
    //var train = ["kana_a","kana_ka"]
    this.initFields(kanas)
  },

  initFields0: function(kanas){
    var train = []
    var pos_map = {}
    var new_fields = []
    for (let row=0;row<max_row;row++){
      var rows = []
      for (let col=0;col<max_col;col++){
        var kana = ""
        var space1 = (row == 6 && col > 0 && col < max_col-1)
        var space2  = (row == 2 && col > 2 && col < 5)
        if (!space1 && !space2) kana = kanas.pop()
        var active = false
        var type = "hira"
        var status = 0
        var word = ""
        var cate = ""
        var roma = ""
        var hira = ""
        var kata = ""
        if (kana){
          status = 1
          cate = kana[0]
          roma = kana[1]
          hira = kana[2]
          kata = kana[3]
          word = hira
          //var idx = train.indexOf(cate)
          if (Math.random() > 0.9 && this.data.level==2){
            type = "kata"
            //train.splice(idx, 1)
            word = kata
          }
        } //if (kana) end

        //couple
        if(pos_map[roma]){
          pos_map[roma].push([row,col])
        }else{
          pos_map[roma] = [[row,col]]
        }

        var step = {row,col,roma,word,status,type,active}
        rows.push(step)
      }
      new_fields.push(rows)
    }

    this.setData({pos_map})
    this.loadGame(new_fields)
  },

  onReady: function () {
    console.log("onLoad...")
    this.initKanaRows()
    this.initGame()
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
        if (step.status == 1) break
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
      if (step.status == 1) break
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
      if (step.status == 1) break
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
      if (step.status == 1) break
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
  var same = false
  var fields = this.data.fields
  var this_step = fields[this_row][this_col]
  var old_step = fields[old_row][old_col]
  var both = [old_row+","+old_col, this_row+","+this_col]
  steps = steps.concat(both)
  this_step["status"] = 0
  old_step["status"] = 0

  //kata&hira==2
  var degree = 2
  if (this_step["type"] == old_step["type"]) degree = 1
  this.passStep(steps, degree)

  //if(steps.length > 2 && this.data.auto){
  //  this.autoLink(this_row, this_col)
  //}

  this.setData({fields})
  return true
},

passStep: function(steps, degree){
  var fields = this.data.fields
  for (let step of steps){
    var rc = step.split(",")
    var row = rc[0]
    var col = rc[1]
    console.log(step)
    fields[row][col]["on"] = !fields[row][col]["on"]
    //记录分数用
    var spin_count = this.data.spin_count
    var rest_count = this.data.rest_count
    rest_count -= 2
    spin_count += steps.length * degree
  }
  this.setData({
    fields,
    spin_count,
    rest_count
  })

  //等级2-恢复
  if (rest_count == 0) this.loadLevel2()
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
      if (step.status == 1) break
      this_lefts.push(step.row+","+step.col)
  }
  step_col = this_col
  while (step_col < max_col-1){
      step_col += 1
      var step = fields[this_row][step_col]
      if (step.status == 1) break
      this_rights.push(step.row+","+step.col)
  }
  var step_row = this_row
  while (step_row > 0){
      step_row -= 1
      var step = fields[step_row][this_col]
      if (step.status == 1) break
      this_ups.push(step.row+","+step.col)
  }
  step_row = this_row
  while (step_row < max_row-1){
      step_row += 1
      var step = fields[step_row][this_col]
      if (step.status == 1) break
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
              if (step.status == 1) break
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
              if (step.status == 1) break
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
              if (step.status == 1) break
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
              if (step.status == 1) break
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
    var that = this
    var currData = e.currentTarget.dataset
    var status = currData.status
    if (status == 0) return
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
        console.log(old_row, old_col)
        if (old_rc != rc){
          old_step["active"] = false
          bucket.pop()
          bucket.push([row,col])
          if (old_step["status"] != 0 && this_step["roma"]==old_step["roma"]){
            this.linkDirect(old_row, old_col, row, col)
          }
        }
    }else{
      bucket.push([row,col])
    }
    this.setData({fields,bucket})

  },

  //---------------等级2-------------
  loadLevel2: function(){
    this.setData({
      level:2,
    })
  },

  link2:function(e){
    console.log("link2")
    return
    var currData = e.currentTarget.dataset
    var status = currData.status
    if (status == 0) return
    var bucket = this.data.bucket
    var fields = this.data.fields
    var row = currData.row
    var col = currData.col
    
    fields[row][col]["active"] = true
    if (bucket.length > 0){
        var olds = bucket.shift()
        console.log(old_row,"-",old_col)
        var old_row = olds[0]
        var old_col = olds[1]
        fields[old_row][old_col]["active"] = false
        if (old_row+""+old_col != row+""+col){
          bucket.push([row,col])
          this.linkDirect(old_row, old_col, row, col)
        }
    }else{
      bucket.push([row,col])
    }
    
    for (let bk of bucket){
      console.log(bk)
    }
    this.setData({fields,bucket})
  },


//---------------------------------------------


  initResult: function(){

    var new_fields = []
    for (let row=0;row<max_row;row++){

      var rows = []
      for (let col=0;col<max_col;col++){
        var word = ""
        var status = 0
        var step = {row,col,word,status}
        rows.push(step)
      }
      new_fields.push(rows)
    }
    new_fields[1][0]["word"] = "分"
    new_fields[1][1]["word"] = "数:"

    new_fields[2][2]["word"] = "0"
    new_fields[2][3]["word"] = "3"
    new_fields[2][4]["word"] = "5"
    new_fields[2][5]["word"] = "6"

    new_fields[7][0]["word"] = "排"
    new_fields[7][1]["word"] = "行"
    new_fields[7][2]["word"] = "榜"
    new_fields[7][0]["status"] = 1
    new_fields[7][1]["status"] = 1
    new_fields[7][2]["status"] = 1

    new_fields[7][5]["word"] = "下"
    new_fields[7][6]["word"] = "一"
    new_fields[7][7]["word"] = "局"
    new_fields[7][5]["status"] = 2
    new_fields[7][6]["status"] = 2
    new_fields[7][7]["status"] = 2

    this.loadGame(new_fields)
  },

  next: function(e){
    var currData = e.currentTarget.dataset
    var status = currData.status
    if (status == 1){ //排行榜
      console.log("rank")
    }else if(status == 2){ //下一局
      console.log("new")
    }
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
    if (se || ks_sed.length > max_sed){ //如果点击已选或者大于可选--取消最先选择的
      var ned = ks_sed.shift()
      var n_row = ned[0]
      var n_col = ned[1]
      ks_all[n_row][n_col]["selected"] = false
    }else{
      ks_sed.push([row,col])
    }
    ks_all[row][col]["selected"] = !se
    this.setData({ks_all,ks_sed})
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

    var fill_size = max_sed - ks_ed.length
    var ks_fill = ks_no.slice(0, fill_size)
    //concat(ks_fill)
    ks_ed.push(...ks_fill)

    //倍数修正 8 16 32
    var ks_fix = ks_ed.slice(0, fix_sed)
    ks_fix = ks_fix.concat(ks_fix)
    ks_fix = ks_fix.concat(ks_fix)
    //10 20 40
    ks_ed = ks_ed.concat(ks_ed)
    ks_ed = ks_ed.concat(ks_ed)
    //40 + 32 + 2
    ks_ed = ks_ed.concat(ks_fix).concat([{},{}])
    ks_ed.sort(function(){ return (Math.random() - 0.5)})
    console.log(ks_ed.length)
    this.setData({top_hide:true})
    this.initFields(ks_ed)
  },

  initFields: function(kanas){
    //kanas.length == 74
    var pos_map = {}
    var new_fields = []
    var kata_on = this.data.kata_on
    for (let row=0;row<max_row;row++){
      var rows = []
      for (let col=0;col<max_col;col++){
        var kana = {}
        var space1 = (row == 6 && col > 0 && col < max_col-1)
        if (!space1) kana = kanas.pop()
        var status = kana["roma"] ? 1 : 0
        var roma = kana["roma"] ? kana["roma"] : ""
        var word = kana["hira"] ? kana["hira"] : ""
        word = kata_on ? kana["kata"] : word

        //couple
        if(pos_map[roma]){
          pos_map[roma].push([row,col])
        }else{
          pos_map[roma] = [[row,col]]
        }

        var step = {row,col,roma,word,status,kata_on}
        rows.push(step)
      }
      new_fields.push(rows)
    }

    this.setData({pos_map})
    this.loadGame(new_fields)
  },


})