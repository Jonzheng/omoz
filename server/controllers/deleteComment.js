const { mysql } = require('../qcloud')

module.exports = async ctx => {
    let body = ctx.request.body
    var record_id = body.record_id
    var comm_id = body.comm_id
    var user_id = boyd.user_id
    await mysql.raw('delete from t_comment where id = ? and user_id = ?', [comm_id, user_id]);
    await mysql.raw('update t_record set comm = comm-1 where record_id = ?', record_id);

    var t_comment = await mysql.raw('select t_cm.*,t_ur.show_name,t_ur.nick_name,t_ur.avatar_url,tz.user_id as zid from t_comment t_cm inner join t_user t_ur on (t_cm.user_id = t_ur.openid) left join t_zan tz on (t_cm.id=tz.comm_id and tz.status=1 and tz.user_id = ?) where t_cm.record_id = ? order by t_cm.c_date desc', [user_id, record_id])
    ctx.state.data = t_comment
}