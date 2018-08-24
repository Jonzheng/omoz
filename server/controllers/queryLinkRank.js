const { mysql } = require('../qcloud')

module.exports = async ctx => {
    
    var result = await mysql('t_link_rank').select('*').orderBy('point', 'desc').leftJoin('t_user', 't_link_rank.openid', 't_user.openid')
    ctx.state.data = result
    
}