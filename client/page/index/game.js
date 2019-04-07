import { checkUser } from '../../utils/user'
const App = new getApp()

Page({

    data: {

    },
    onLoad: function () {
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
    },
    onShareAppMessage() {
        return {
            title: '假名·连连看',
            path: '/page/index/game',
            imageUrl: 'https://systems-1256378396.cos.ap-guangzhou.myqcloud.com/title00.png'
        }
    }

})