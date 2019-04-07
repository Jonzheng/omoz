const urls = require('../config')
const checkUser = ()=> {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (res) {
          console.log("login_success")
          var js_code = res.code
          if (js_code) {
              //尝试获取用户信息
              wx.getUserInfo({
                  success: function (res) {
                    updateLogin(js_code, res.userInfo).then(user=>{
                      resolve(user)
                    })
                  },
                  fail: function (err) {
                    console.log(err)
                    //授权之前
                    updateLogin(js_code, res.userInfo).then(user=>{
                      reject(user)
                    })
                  }
              })
          } else {
              reject(res.errMsg)
          }
      }
    })
  })
}
const updateLogin = (js_code, userInfo = null) => {
  return new Promise((resolve) => {
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
            resolve(user)
        }
    })
  })

}
//注册到数据库
module.exports = {
  checkUser: checkUser
}
