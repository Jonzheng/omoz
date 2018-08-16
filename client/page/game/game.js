

const kana_a = [["kana_a","a", "あ", "ア"],["kana_a","i", "い", "イ"],["kana_a","u", "う", "ウ"],["kana_a","e", "え", "エ"],["kana_a","o", "お", "オ"]]
const kana_ka = [["kana_ka","ka", "か", "カ"],["kana_ka","ki", "き", "キ"],["kana_ka","ku", "く", "ク"],["kana_ka","ke", "け", "ケ"],["kana_ka","ko", "こ", "コ"]]
const kana_sa = [["kana_sa","sa", "さ", "サ"],["kana_sa","shi", "し", "シ"],["kana_sa","su", "す", "ス"],["kana_sa","se", "せ", "セ"],["kana_sa","so", "そ", "ソ"]]
const kana_ta = [["kana_ta","ta", "た", "タ"],["kana_ta","chi", "ち", "チ"],["kana_ta","tsu", "つ", "ツ"],["kana_ta","te", "て", "テ"],["kana_ta","to", "と", "ト"]]
const kana_na = [["kana_na","na", "な", "ナ"],["kana_na","ni", "に", "ニ"],["kana_na","nu", "ぬ", "ヌ"],["kana_na","ne", "ね", "ネ"],["kana_na","no", "の", "ノ"]]
const kana_ha = [["kana_ha","ha", "は", "ハ"],["kana_ha","hi", "ひ", "ヒ"],["kana_ha","fu", "ふ", "フ"],["kana_ha","he", "へ", "ヘ"],["kana_ha","ho", "ほ", "ホ"]]
const kana_ma = [["kana_ma","ma", "ま", "マ"],["kana_ma","mi", "み", "ミ"],["kana_ma","mu", "む", "ム"],["kana_ma","me", "め", "メ"],["kana_ma","mo", "も", "モ"]]
const kana_ya = [["kana_ya","ya", "や", "ヤ"],["kana_ya","yu", "ゆ", "ユ"],["kana_ya","yo", "よ", "ヨ"]]
const kana_ra = [["kana_ra","ra", "ら", "ラ"],["kana_ra","ri", "り", "リ"],["kana_ra","ru", "る", "ル"],["kana_ra","re", "れ", "レ"],["kana_ra","ro", "ろ", "ロ"]]
const kana_wa = [["kana_wa","wa", "わ", "ワ"],["kana_wa","wo", "を", "ヲ"]]
const kana_n = [["kana_n","n","ん","ン"]]


const max_row = 10
const max_col = 8

Page({

  data: {
    bucket:[],
    this_lefts:[],
    this_rights:[],
    this_ups:[],
    this_downs:[],
  },
  loadGome: function(new_fields){
    var that = this
    var fields = []
    that.setData({fields})
    var it = setInterval(function(){
      var step = new_fields.shift()
      if (!step) clearInterval(it)
      console.log(step)
      fields.push(step)
      that.setData({fields})
    },200)
  },

  initGame: function(){
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

  initFields: function(kanas){
    var train = []
    var target_pos = {}
    var new_fields = []
    for (let row=0;row<max_row;row++){
      var rows = []
      for (let col=0;col<max_col;col++){
        var kana = ""
        var space1 = (row == 2 && col > 0 && col < max_col-1)
        var space2  = (row == 7 && col > 2 && col < 5)
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
          if (Math.random() > 0.9){
            type = "kata"
            //train.splice(idx, 1)
            word = kata
          }
        }

        //couple
        var cp = target_pos[roma]
        if (cp){
          cp.push(row+","+col)
          target_pos[roma] = cp
        }else{
          target_pos[roma] = [cp]
        }

        var step = {row,col,roma,word,status,type,active}
        rows.push(step)
      }
      new_fields.push(rows)
    }

    this.loadGome(new_fields)
  },

  onLoad: function () {
    console.log("onLoad...")
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

hideBoth: function(old_row, old_col, this_row, this_col, steps){
  var fields = this.data.fields
  if (fields[old_row][old_col]["roma"] == fields[this_row][this_col]["roma"]){
    this.passStep(steps)
    fields[old_row][old_col]["status"] = 0
    fields[this_row][this_col]["status"] = 0
  }
  this.setData({fields})
},

passStep: function(steps){
  var fields = this.data.fields
  for (let step of steps){
    var rc = step.split(",")
    var row = rc[0]
    var col = rc[1]
    console.log(step)
    fields[row][col]["on"] = !fields[row][col]["on"]
  }
  this.setData({fields})
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
          var steps = [old_row+","+old_col, this_row+","+this_col]
          this.hideBoth(old_row, old_col, this_row, this_col, steps)
          return
      }
      this.initTargetPoint(this_row, this_col)
      //从old_开始寻路
      steps = this.rightLink(old_col, this_col, old_row)
      if(steps.length > 0) {
        this.hideBoth(old_row, old_col, this_row, this_col, steps)
        return
      }
      steps = this.downLink(old_row, this_row, old_col)
      if (steps.length > 0){
        this.hideBoth(old_row, old_col, this_row, this_col, steps)
        return
      }
      steps = this.leftLink(old_col, this_col, old_row)
      if (steps.length > 0){
        this.hideBoth(old_row, old_col, this_row, this_col, steps)
        return
      }
      steps = this.upLink(old_row, this_row, old_col)
      if (steps.length > 0){
        this.hideBoth(old_row, old_col, this_row, this_col, steps)
        return
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
                  this.hideBoth(old_row, old_col, this_row, this_col, steps)
                  return
              }
              steps_sec = this.downLink(step.row, this_row, step.col)
              if (steps_sec.length > 0) {
                steps = steps.concat(steps_sec)
                this.hideBoth(old_row, old_col, this_row, this_col, steps)
                return
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
                  this.hideBoth(old_row, old_col, this_row, this_col, steps)
                  return
              }
              steps_sec = this.downLink(step.row, this_row, step.col)
              if (steps_sec.length > 0) {
                steps = steps.concat(steps_sec)
                this.hideBoth(old_row, old_col, this_row, this_col, steps)
                return
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
                this.hideBoth(old_row, old_col, this_row, this_col, steps)
                return
              }
              steps_sec = this.rightLink(step.col, this_col, step.row)
              if (steps_sec.length > 0) {
                steps = steps.concat(steps_sec)
                this.hideBoth(old_row, old_col, this_row, this_col, steps)
                return
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
                this.hideBoth(old_row, old_col, this_row, this_col, steps)
                return
              }
              steps_sec = this.rightLink(step.col, this_col, step.row)
              if (steps_sec.length > 0) {
                steps = steps.concat(steps_sec)
                this.hideBoth(old_row, old_col, this_row, this_col, steps)
                return
              }
          }
  },
  goLink: function(e){
    var currData = e.currentTarget.dataset
    var status = currData.status
    if (status == 0) return
    var bucket = this.data.bucket
    var fields = this.data.fields
    var row = currData.row
    var col = currData.col
    
    fields[row][col]["active"] = true
    if (bucket.length == 1){
        var olds = bucket.pop()
        var old_row = olds[0]
        var old_col = olds[1]

        fields[old_row][old_col]["active"] = false
        fields[row][col]["active"] = false

      //顺时针延伸-是否直接包含目标点坐标
      this.linkDirect(old_row, old_col, row, col)
    }else{
      bucket.push([row,col])
    }
    this.setData({fields})

  }

})