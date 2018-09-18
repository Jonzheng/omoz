const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var body = ctx.request.body
    var openid = body.openid
    var hira = body.hira
    var kata = body.kata
    var space = body.space
    var result = []
    if (openid){
        await mysql.raw('update t_link_rank set hira = ?, kata=?, space=? where openid = ?', [hira,kata,space,openid]);
    }
    ctx.state.data = result
    
}