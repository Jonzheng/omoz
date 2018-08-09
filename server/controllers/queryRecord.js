const { mysql } = require('../qcloud')

module.exports = async ctx => {
    
    var body = ctx.request.body
    console.log(body)
    var t_answer = await mysql.raw('select th.user_id heart_ud,t_re.*,t_ur.*,to_days(now()) - to_days(t_re.c_date) dday from t_record t_re inner join t_user t_ur on (t_re.master_id = t_ur.openid) left join t_heart th on (th.record_id = t_re.record_id and th.status = 1) where t_re.status = 1 order by case when to_days(now()) - to_days(t_re.c_date) < 7 then 0 else 1 end,heart desc')

    ctx.state.data = t_answer
}