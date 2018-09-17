const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var body = ctx.request.body
    //console.log(body)
    var openid = body.openid
    var old_coin = 0
    var result = []
    if (openid){
        result = await mysql('t_link_rank').select('*').where('openid', openid)
        if (result.length > 0){
            old_coin = result.check_coin
            if (old_coin > 0){
                await mysql.raw('update t_link_rank set coin = coin+?,check_coin=0 where openid = ?', [old_coin, openid]);
                result = await mysql('t_link_rank').select('*').where('openid', openid)
            }
            result["old_coin"] = old_coin
        }
    }
    ctx.state.data = result
    
}