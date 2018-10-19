const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var body = ctx.request.body
    //console.log(body)
    var openid = body.openid
    var result = []
    if (openid){
        result = await mysql('t_link_rank').select('*').where('openid', openid)
    }else{
        result = await mysql('t_link_rank').select('*').where('round','>', 0).orderBy('total_coin', 'desc').leftJoin('t_user', 't_link_rank.openid', 't_user.openid')
    }
    ctx.state.data = result
    
}