const { mysql } = require('../qcloud')

module.exports = async ctx => {
    
    const body = ctx.request.body
    const record_id = body.record_id
    const user_id = body.user_id
    var t_comment = await mysql.raw('select t_cm.*,t_ur.show_name,t_ur.nick_name,t_ur.avatar_url,tz.user_id as zid from t_comment t_cm inner join t_user t_ur on (t_cm.user_id = t_ur.openid) left join t_zan tz on (t_cm.id=tz.comm_id and tz.status=1 and tz.user_id = ?) where t_cm.record_id = ? order by t_cm.c_date desc', [user_id, record_id])
    ctx.state.data = t_comment
}