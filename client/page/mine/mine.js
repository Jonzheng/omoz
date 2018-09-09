
const App = getApp()
const urls = require('../../config')

Page({

    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        taps:[],
        po_x:0,
        po_y:0,
        icon_coin:"../../image/coin.png",
        icon_edit:"../../image/edit.png",
        level:0,
        edit: false,
        act:false
    },

    point: function (e) {
        console.log(e.detail)
        var _taps = this.data.taps
        _taps.push(6)
        this.setData({
            po_x: e.detail["x"]-20,
            po_y: e.detail["y"]-90,
            taps: _taps
        })
    },

    onLoad: function () {
        console.log("onLoad")
        if (!App.globalData.hasLogin) {
            return
        }
        var userInfo = App.globalData.userInfo
        if(userInfo){
            console.log(userInfo)
            var show_name = userInfo.show_name
            var nick_name = userInfo.nick_name
            var avatar_url = userInfo.avatar_url
            this.setData({
                loged: true,
                nick_name,
                show_name,
                avatar_url,
            })
        }
    },

    editName:function(){
        console.log("edit..")
        this.setData({edit:true})
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

    updateName: function(e){
        console.log('updateUser:')
        var that = this
        var showName = e.detail.value
        var userInfo = App.globalData.userInfo
        console.log(userInfo)
        var nickName = userInfo.nick_name
        if (showName == App.globalData.showName) return
        //更新用户到数据库
        var openid = App.globalData.openid
        var avatarUrl = userInfo.avatar_url
        var gender = userInfo.gender
        wx.request({
            url: urls.updateUser,
            method: 'POST',
            data: {
                openid,
                nickName,
                avatarUrl,
                gender,
                showName,
            },
            success: function (res) {
                var show_name = showName
                var nick_name = nickName
                App.globalData.showName = show_name
                that.setData({
                    edit:false,
                    nick_name,
                    show_name
                })
            }
        });

    },

    hideInput:function(){
        var show_name = this.data.show_name
        this.setData({
            edit:false,
            show_name,
        })
    }
})