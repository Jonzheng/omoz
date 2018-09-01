
Page({

  data: {
    hide_text:true,
    title:""
  },

  onLoad: function (data) {
    var type = data.type
    //console.log(type, type == 1)
    if(type == 1){
      var title = "假名·连连看の规则"
      
    }else if (type == 0){
      var title = "关于·游戏計画"
    }
    this.setData({title,type})
  },

  showText: function(){
    var hide_text = !this.data.hide_text
    this.setData({hide_text})
  }
})