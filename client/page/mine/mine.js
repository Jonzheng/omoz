
const App = getApp()
const urls = require('../../config')

Page({

    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        taps:[],
        po_x:0,
        po_y:0,
        icon_coin:"../../image/coin.png",
        icon_edit:"../../image/edit.png",
        icon_avatar:"",
        nickName:"",
        level:0,
        edit: false,
        act:false
    },
    onclick:function(e){
        console.log("click.")
    },
    point: function (e) {
        //var au = new AudioContext();
        //console.log(au)
        var that = this
        console.log(e.detail)
        var _taps = this.data.taps
        _taps.push(6)
        console.log(_taps)
        this.setData({
            po_x: e.detail["x"]-20,
            po_y: e.detail["y"]-90,
            taps: _taps
        })
    },

    black: function() {
        console.log("to black")
        console.log(this.data.userInfo)
        //wx.navigateTo({ url: '../b_index/index' })
    },

    onLoad: function () {
        console.log("onLoad")
        var userInfo = App.globalData.userInfo
        var showName = App.globalData.showName
        var nickName = userInfo.nickName
        if (!showName) showName = nickName
        if(userInfo){
            this.setData({
                userInfo,
                nickName: nickName,
                avatarUrl: userInfo.avatarUrl,
                showName
            })
        }
    },
    onReady: function () {
        console.log("onReady")
    },

    editName:function(){
        console.log("edit..")
        this.setData({edit:true})
    },

    updateName: function(e){
        console.log('updateUser:')
        var that = this
        var showName = e.detail.value
        var userInfo = App.globalData.userInfo
        var nickName = userInfo.nickName
        if (showName == App.globalData.showName) return
        //更新用户到数据库
        var openid = App.globalData.openid
        var avatarUrl = userInfo.avatarUrl
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
                that.setData({
                    edit:false,
                    nickName,
                    showName
                })
                App.globalData["showName"] = showName
            }
        });

    }
    ,
    hideInput:function(){
        this.setData({
            edit:false,
            nickName:this.data.nickName
        })
    }
})