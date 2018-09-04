const urls = require('../../config')
var sliderWidth = 48; // 需要设置slider的宽度，用于计算中间位置
const App = new getApp()
Page({
    data: {
        tabs: ["全部", "SSR", "SR", "R", "N", "阴阳师"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
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
                App.globalData.openid = user.openid
                App.globalData.nickName = user.nick_name
                App.globalData.showName = user.show_name
            }
        });
    },

    onLoad: function () {
        console.log("onLoad")
        var that = this;
        //初始化tabs
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
                });
            }
        });

        // 查看是否授权
        wx.getSetting({
            success: function (res) {
                console.log("getSetting:")
                console.log(res)
            }
        })

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
                            App.globalData.userInfo = userInfo
                            that.updateLogin(js_code, userInfo)
                        },
                        fail: function (err) {
                            //授权之前
                            console.log("getUserInfo-fail")
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

        //查询阴阳师list
        wx.request({
            url: urls.queryList,
            method: 'POST',
            success: function (res) {
                var _list = res.data.data
                if (!_list) return
                _list.sort((a,b) => {return b.stars - a.stars})
                var ssr_list = []
                var sr_list = []
                var r_list = []
                var n_list = []
                var m_list = []
                _list.forEach(ele => {
                    if (ele.level == 'ssr'){
                        ssr_list.push(ele)
                    }
                    else if (ele.level == 'sr'){
                        sr_list.push(ele)
                    }
                    else if (ele.level == 'r') {
                        r_list.push(ele)
                    }
                    else if (ele.level == 'n') {
                        n_list.push(ele)
                    }
                    else if (ele.level == 'm') {
                        m_list.push(ele)
                    }
                })
                that.setData({
                    _list: _list,
                    ssr_list: ssr_list,
                    sr_list: sr_list,
                    r_list: r_list,
                    n_list: n_list,
                    m_list: m_list
                })
                console.log(_list)
            }
        })
    },
    onReady: function () {
        console.log("onReady")
    },

    tabClick: function (e) {
        //console.log(e.currentTarget)
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    }
});