const urls = require('../../config')
const App = new getApp()

Page({

    data: {

    },

    //注册到数据库
    updateLogin: function(js_code, userInfo){
        var avatarUrl = userInfo ? userInfo.avatarUrl : ""
        var nickName = userInfo ? userInfo.nickName : ""
        wx.request({
            url: urls.updateLogin,
            method: 'POST',
            data: {
                js_code,
                avatarUrl,
                nickName
            },
            success: function (res) {
                console.log('updateLogin:')
                var user = res.data.data[0]
                console.log(user)
                App.globalData.userInfo = user
                App.globalData.openid = user.openid
                App.globalData.nickName = user.nick_name
                App.globalData.showName = user.show_name
                App.globalData.avatarUrl = user.avatar_url
            }
        });
    },

    onLoad: function () {
        var that = this
        // 查看是否授权
        //wx.getSetting({
        //    success: function (res) {
        //        console.log("getSetting:")
        //        console.log(res)
        //    }
        //})

        //页面无提示
        wx.login({
            success: function (res) {
                console.log("login_success")
                var js_code = res.code
                if (js_code) {
                    //尝试获取用户信息
                    wx.getUserInfo({
                        success: function (res) {
                            console.log("getUserInfo-success")
                            App.globalData.hasLogin = true
                            var userInfo = res.userInfo
                            that.updateLogin(js_code, userInfo)
                        },
                        fail: function (err) {
                            //授权之前
                            console.log(err)
                            App.globalData.hasLogin = false
                            that.updateLogin(js_code, undefined)
                        }
                    })

                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    },

})