const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var result = {}
    var body = ctx.request.body
    var file_id = body.file_id
    var cate = body.cate
    var user_id = body.user_id
    result["list_result"] = []
    result["audio_result"] = []
    result["record_result"] = []
    result["list_other"] = []
    if (file_id){
        result["list_result"] = await mysql('t_list').select('*').where('cate', cate).andWhere('file_id', file_id).andWhere('status', 1)
        result["audio_result"] = await mysql('t_audio').select('*').where('file_id', file_id).andWhere('status', 1)
        result["record_result"] = await mysql.raw('select th.user_id heart_ud,t_re.*,t_ur.*,to_days(now()) - to_days(t_re.c_date) dday from t_record t_re inner join t_user t_ur on (t_re.master_id = t_ur.openid) left join t_heart th on (th.record_id = t_re.record_id and th.status = 1 and th.user_id = ?) where t_re.file_id = ? and t_re.status = 1 order by case when to_days(now()) - to_days(t_re.c_date) < 3 then 0 else 1 end,heart desc', [user_id, file_id])
        //ssr_yzq_0_3  ssr_h_0_0  ssr_hnj_0_0
        var fids = file_id.split("_")
        var level = fids[0]
        var sname = fids[1]
        var start_str = level + "_" + sname + "_"
        var slen = start_str.length
        result["list_other"] = await mysql.raw('select * from t_list where status=? and cate=? and substr(file_id, 1, ?) =?',[1,cate,slen,start_str])
    }else{
        result["list_result"] = await mysql('t_list').select('*').where('cate', cate)
        result["audio_result"] = await mysql('t_audio').select('*')
    }
    ctx.state.data = result
}