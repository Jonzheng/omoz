const { mysql } = require('../qcloud')

module.exports = async ctx => {
    let body = ctx.request.body
    var record_id = body.record_id
    var user_id = body.user_id
    var file_id = body.file_id
    var master_id = body.master_id
    const content = body.content
    var re_name = body.re_name ? body.re_name : ''
    var re_content = body.re_content ?  body.re_content : ''
    var id = file_id + new Date().getTime()
    await mysql.raw('insert t_comment (id,record_id,user_id,file_id,master_id,content,re_name,re_content) values(?,?,?,?,?,?,?,?)on duplicate key update status = 1', [id, record_id, user_id, file_id, master_id,content,re_name,re_content]);
    await mysql.raw('update t_record set comm = comm+1 where record_id = ?', record_id);

    var t_comment = await mysql.raw('select t_cm.*,t_ur.show_name,t_ur.nick_name,t_ur.avatar_url,tz.user_id as zid from t_comment t_cm inner join t_user t_ur on (t_cm.user_id = t_ur.openid) left join t_zan tz on (t_cm.id=tz.comm_id and tz.status=1 and tz.user_id = ?) where t_cm.record_id = ? order by t_cm.c_date desc', [user_id, record_id])
    ctx.state.data = t_comment
}