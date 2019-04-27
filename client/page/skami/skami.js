const urls = require('../../config')
var sliderWidth = 48; // 需要设置slider的宽度，用于计算中间位置
import { checkUser } from '../../utils/user'
const App = new getApp()

Page({
    data: {
        tabs: ["SP", "SSR", "SR", "R", "N", "阴阳师"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        icon_loading: "../../image/loading1.gif",
        height: -1,
        _list: [],
        sp_list: [],
        ssr_list: [],
        sr_list: [],
        r_list: [],
        n_list: [],
        m_list: [],
        sp_top: 9,
        ssr_top: 9,
        sr_top: 9,
        r_top: 9,
        n_top: 9,
        m_top: 9
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
                var sp_list = []
                var ssr_list = []
                var sr_list = []
                var r_list = []
                var n_list = []
                var m_list = []
                _list.forEach(ele => {
                    if (ele.level == 'sp'){
                        sp_list.push(ele)
                        if (sp_list.length < 11) ele['show'] = true
                    }
                    else if (ele.level == 'ssr') {
                        ssr_list.push(ele)
                        if (ssr_list.length < 11) ele['show'] = true
                    }
                    else if (ele.level == 'sr'){
                        sr_list.push(ele)
                        if (sr_list.length < 11) ele['show'] = true
                    }
                    else if (ele.level == 'r') {
                        r_list.push(ele)
                        if (r_list.length < 11) ele['show'] = true
                    }
                    else if (ele.level == 'n') {
                        n_list.push(ele)
                        if (n_list.length < 11) ele['show'] = true
                    }
                    else if (ele.level == 'm') {
                        m_list.push(ele)
                        if (m_list.length < 11) ele['show'] = true
                    }
                })
                that.setData({
                    _list,
                    sp_list,
                    ssr_list,
                    sr_list,
                    r_list,
                    n_list,
                    m_list
                })
                console.log(_list)
            }
        })
    },

    onPageScroll(e){ // 滚动事件
        // console.log(this.data.activeIndex)
        var top = e.scrollTop
        if (top > 100) {
            var bottom = (parseInt(top / 800) + 2) * 10
            var cate = this.data.activeIndex
            if (cate == 0) {
                if (bottom > this.data.sp_top){
                    this.setData({sp_top: bottom})
                    var sp_list = this.data.sp_list
                    for (let [idx, v] of sp_list.entries()) {
                        if (idx < bottom) v['show'] = true
                    }
                    this.setData({sp_list})
                }
            }
            else if (cate == 1) {
                if (bottom > this.data.ssr_top){
                    this.setData({ssr_top: bottom})
                    var ssr_list = this.data.ssr_list
                    for (let [idx, v] of ssr_list.entries()) {
                        if (idx < bottom) v['show'] = true
                    }
                    this.setData({ssr_list})
                }
            }else if (cate == 2) {
                if (bottom > this.data.sr_top){
                    this.setData({sr_top: bottom})
                    var sr_list = this.data.sr_list
                    for (let [idx, v] of sr_list.entries()) {
                        if (idx < bottom) v['show'] = true
                    }
                    this.setData({sr_list})
                }
            }else if (cate == 3) {
                if (bottom > this.data.r_top){
                    this.setData({r_top: bottom})
                    var r_list = this.data.r_list
                    for (let [idx, v] of r_list.entries()) {
                        if (idx < bottom) v['show'] = true
                    }
                    this.setData({r_list})
                }
            }else if (cate == 4) {
                if (bottom > this.data.n_top){
                    this.setData({n_top: bottom})
                    var n_list = this.data.n_list
                    for (let [idx, v] of n_list.entries()) {
                        if (idx < bottom) v['show'] = true
                    }
                    this.setData({n_list})
                }
            }else if (cate == 5) {
                if (bottom > this.data.m_top){
                    this.setData({m_top: bottom})
                    var m_list = this.data.m_list
                    for (let [idx, v] of m_list.entries()) {
                        if (idx < bottom) v['show'] = true
                    }
                    this.setData({m_list})
                }
            }

        }
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