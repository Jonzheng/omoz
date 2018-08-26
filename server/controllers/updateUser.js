const { mysql } = require('../qcloud')

module.exports = async ctx => {
    let body = ctx.request.body
    var openid = body.openid
    var nickName = body.nickName
    var showName = body.showName
    var avatarUrl = body.avatarUrl
    var gender = body.gender
    console.log(body)
    if (showName){
        await mysql("t_user").where("openid", openid).update({ nick_name: nickName,show_name: showName, avatar_url: avatarUrl, gender: gender})
    }else{
        await mysql("t_user").where("openid", openid).update({ nick_name: nickName,avatar_url: avatarUrl, gender: gender})
    }
    
    var userInfo = await mysql('t_user').select('*').where('openid', openid)
    ctx.state.data = userInfo
}