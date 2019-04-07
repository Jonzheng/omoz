const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var result = ""
    let body = ctx.request.body
    var comm_id = body.comm_id
    var user_id = body.user_id
    result = await mysql.raw('insert t_zan (comm_id, user_id) values(?,?)on duplicate key update status = 1', [comm_id, user_id]);
    result = await mysql.raw('update t_comment set stars = stars+1 where id = ?', comm_id);
    ctx.state.data = result
}