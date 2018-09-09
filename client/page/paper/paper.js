const urls = require('../../config')
const App = getApp()

Page({

  data: {

  },

  initPageData: function () {
    var that = this
    wx.request({
        url: urls.queryPaper,
        method: 'POST',
        data: {status: 1},
        success: function (res) {
            console.log("queryPaper:")
            var _list = res.data.data
            console.log(_list)
            that.setData({
              _list: _list
            })
        }
    })
  },

  onLoad: function () {
    //页面初始参数
    this.initPageData()
    var loged = App.globalData.hasLogin
    this.setData({
      loged,
    })
  },

  toLogin: function (e) {
    var that = this
    var userInfo = e.detail.userInfo
    console.log("toLogin:")
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

})