const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var body = ctx.request.body
    //console.log(body)
    var openid = body.openid
    var check_coin = body.check_coin
    var ran = body.ran
    var old_coin = 0
    var result = []
    if (openid){
        await mysql.raw('update t_link_rank set latest=now() where openid = ?', [openid]);
        if (check_coin > 0){ //签到
            await mysql.raw('update t_link_rank set check_coin=check_coin+?,total_coin=total_coin+?,ran=?, s_date=now() where openid = ?', [check_coin,check_coin,ran, openid]);
        }

        result = await mysql('t_link_rank').select('*').where('openid', openid)
        if (result.length == 1){
            var t_rank = result[0]
            old_coin = t_rank.check_coin
            if (old_coin > 0){
                await mysql.raw('update t_link_rank set coin = coin+?,check_coin=0 where openid = ?', [old_coin, openid]);
                result = await mysql('t_link_rank').select('*').where('openid', openid)
            }
            result[0]["old_coin"] = old_coin
        }else if(result.length == 0){
            await mysql.raw('insert t_link_rank (openid,point,s_date) values(?,?,date_sub(now(), interval -1 day))', [openid, 0])
            result = await mysql('t_link_rank').select('*').where('openid', openid)
            result[0]["old_coin"] = old_coin
        }
    }
    ctx.state.data = result
    
}