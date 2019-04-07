const urls = require('../../config')
var sliderWidth = 48; // 需要设置slider的宽度，用于计算中间位置
import { checkUser } from '../../utils/user'
const App = new getApp()

Page({
    data: {
        tabs: ["全部", "SSR", "SR", "R", "N", "阴阳师"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
    },
    
    onLoad: function () {
        var that = this
        //初始化tabs
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
                });
            }
        })
        checkUser().then(user=>{
            console.log(user)
            App.globalData.userInfo = user
            App.globalData.openid = user.openid
            App.globalData.nickName = user.nick_name
            App.globalData.showName = user.show_name
            App.globalData.avatarUrl = user.avatar_url
            App.globalData.hasLogin = true
        }).catch(err=>{
            console.log('err?')
            console.log(err)
            App.globalData.hasLogin = false
            App.globalData.openid = err ? err.openid : ''
        })
        wx.showLoading({title: '加载中...'})
        //查询阴阳师list
        wx.request({
            url: urls.queryList,
            method: 'POST',
            success: function (res) {
                wx.hideLoading()
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
    onPullDownRefresh: function () {
        this.onLoad()
        wx.stopPullDownRefresh()
    },

    tabClick: function (e) {
        //console.log(e.currentTarget)
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    onShareAppMessage() {
        return {
            title: '阴阳师·式神台词语音',
            path: '/page/skami/skami',
        }
    }
});