const { mysql } = require('../qcloud')

module.exports = async ctx => {
    
    var result = await mysql('t_link_rank').select('*')
    ctx.state.data = result
    
}