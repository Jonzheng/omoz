

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
  //

  onLoad: function () {
    var kanas = kana_a.concat(kana_ka).concat(kana_sa).concat(kana_ta).concat(kana_na).concat(kana_ha).concat(kana_ma).concat(kana_ya).concat(kana_ra).concat(kana_wa).concat(kana_n)
    //46
    console.log(kanas.length)
    //8x10-2x6 = 70/2 = 35
    kanas.sort(function(){ return (Math.random() - 0.5)})
    //slice splice(change origin)
    kanas = kanas.slice(0, 12)
    var sp = kanas.slice(0, 6)
    sp = sp.concat(sp) //12
    sp = sp.concat(sp) //24
    kanas = kanas.concat(kanas) //24
    kanas = kanas.concat(kanas) //48
    kanas = kanas.concat(sp) //48+24
    kanas.sort(function(){ return (Math.random() - 0.5)})
    console.log(kanas.length)
    //var train = ["kana_a","kana_ka"]
    var train = []
    var target_pos = {}
    var fields = []
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
          var idx = train.indexOf(cate)
          if (idx != -1){
            type = "kata"
            train.splice(idx, 1)
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
      fields.push(rows)
    }

    for (let i of fields){
      console.log(i)
    }
    this.setData({
      fields
    })

  },


//-----------------------------------------------------------------------------
//link_find_road



  rightLink: function(begin_col, end_col, fixed_row){
    var steps = []
    var step_col = begin_col
    while (step_col < end_col){
        step_col += 1
        var step = fields[fixed_row][step_col]
        if (step.status == 1) break
        var row_col = step.row+","+step.col
        steps.push(row_col)
        if (this_lefts.includes(row_col)){
            return steps
        }else if(this_ups.includes(row_col)){
          return steps
        }else if(this_downs.includes(row_col)){
          return steps
        }
    }//while end
    return steps
},

downLink: function(begin_row, end_row, fixed_col){
    var steps = []
    var step_row = begin_row
    while (step_row < end_row){
        step_row += 1
        var step = fields[step_row][fixed_col]
        if (step.status == 1) break
        var row_col = step.row+","+step.col
        steps.push(row_col)
        if (this_ups.includes(row_col)){
          return steps
        }else if(this_lefts.includes(row_col)){
          return steps
        }else if(this_rights.includes(row_col)){
          return steps
        }
    }//while end
    return steps
},

leftLink: function(begin_col, end_col, fixed_row){
    var steps = []
    var step_col = begin_col
    while (step_col > end_col){
        step_col -= 1
        var step = fields[fixed_row][step_col]
        if (step.status == 1) break
        var row_col = step.row+","+step.col
        steps.push(row_col)
        if (this_rights.includes(row_col)){
          return steps
        }else if(this_ups.includes(row_col)){
          return steps
        }else if(this_downs.includes(row_col)){
          return steps
        }
    }//while end
    return steps
},

upLink: function(begin_row, end_row, fixed_col){
    var steps = []
    var step_row = begin_row
    while (step_row > end_row){
        step_row -= 1
        var step = fields[step_row][fixed_col]
        if (step.status == 1) break
        var row_col = step.row+","+step.col
        steps.push(row_col)
        if (this_downs.includes(row_col)){
          return steps
        }else if(this_lefts.includes(row_col)){
          return steps
        }else if(this_rights.includes(row_col)){
          return steps
        }
    }//while end
    return steps
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

hideBoth: function(old_row, old_col, this_row, this_col){
  var fields = this.data.fields
  fields[old_row][old_col]["active"] = false
  fields[this_row][this_col]["status"] = 0
  //this.setData({fields})
},
initTargetPoint: function(old_row, old_col, this_row, this_col){
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
  while (step_col < col_max-1){
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
  while (step_row < row_max-1){
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
      var linked = isNext(old_row, old_col, this_row, this_col)
      if (linked){
          console.log("is next")
          this.hideBoth(old_row, old_col, this_row, this_col)
          return
      }
      this.initTargetPoint(old_row, old_col, this_row, this_col)
      //从old_开始寻路
      console.log("右")
      var steps = this.rightLink(old_col, this_col, old_row)
      if(steps,length == 0) {
          console.log("下")
          steps = this.downLink(old_row, this_row, old_col)
      }
      if (steps,length == 0){
          console.log("左")
          steps = this.leftLink(old_col, this_col, old_row)
      }                        
      if (steps,length == 0){
          console.log("上")
          steps = this.upLink(old_row, this_row, old_col)
      }
      if (steps,length == 0){
          console.log("二次")
          //右-上/下
          //左-上/下
          //下-左/右
          //上-左/右
          var steps_sec =[]
          var step_col = old_col
          while (step_col < col_max - 1){
              step_col += 1
              var step = fields[old_row][step_col]
              if (step.status == 1) break
              var row_col = step.row+","+step.col
              steps.push(row_col)
              //(begin_row, end_row, fixed_col)
              steps_sec = this.upLink(step.row, this_row, step.col)
              if (steps_sec.length > 0) {
                  console.log(steps.concat(steps_sec))
                  break
              }
              steps_sec = this.downLink(step.row, this_row, step.col)
              if (steps_sec.length > 0) {
                console.log(steps.concat(steps_sec))
                break
              }
          }
      }
      if (steps,length == 0){
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
                  console.log(steps.concat(steps_sec))
                  break
              }
              steps_sec = this.downLink(step.row, this_row, step.col)
              if (steps_sec.length > 0) {
                console.log(steps.concat(steps_sec))
                break
              }
          }
      }
      if (steps,length == 0){
          steps = []
          var step_row = old_row
          while (step_row < row_max - 1){
              step_row += 1
              var step = fields[step_row][old_col]
              if (step.status == 1) break
              var row_col = step.row+","+step.col
              steps.push(row_col)
              //(begin_col, end_col, fixed_row)
              steps_sec = this.leftLink(step.col, this_col, step.row)
              if (steps_sec.length > 0) {
                console.log(steps.concat(steps_sec))
                break
              }
              steps_sec = this.rightLink(step.col, this_col, step.row)
              if (steps_sec.length > 0) {
                console.log(steps.concat(steps_sec))
                break
              }
          }
      }
      if (steps,length == 0){
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
                console.log(steps.concat(steps_sec))
                break
              }
              steps_sec = this.rightLink(step.col, this_col, step.row)
              if (steps_sec.length > 0) {
                console.log(steps.concat(steps_sec))
                break
              }
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
    }else{
        bucket.push([row,col])
    }
    this.setData({fields})
    var old_row = olds[0]
    var old_col = olds[1]
    var this_row = row
    var this_col = col

    //顺时针延伸-是否直接包含目标点坐标
    this.linkDirect(old_row, old_col, this_row, this_col)

    //如果找到路径
    setTimeout(function(){
      fields[row][col]["active"] = false
      this.setData({fields})
    },500)
  }

})