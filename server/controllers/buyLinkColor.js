const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var body = ctx.request.body
    var openid = body.openid
    var balance = body.balance
    var color = body.color
    var result = []
    if (openid){
        await mysql.raw('update t_link_rank set coin = ?, myco=concat(myco,",",?) where openid = ?', [balance,color,openid]);
        result = await mysql('t_link_rank').select('*').where('openid', openid)
    }
    ctx.state.data = result
    
}