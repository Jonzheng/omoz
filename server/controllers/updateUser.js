const { mysql } = require('../qcloud')

module.exports = async ctx => {
    let body = ctx.request.body
    var openid = body.openid
    var nickName = body.nickName
    var showName = body.showName
    var avatarUrl = body.avatarUrl
    var gender = body.gender
    if (!showName) showName = nickName
    console.log(body)
    var result = await mysql("t_user").where("openid", openid).update({ nick_name: nickName,show_name: showName, avatar_url: avatarUrl, gender: gender})
    ctx.state.data = result
}