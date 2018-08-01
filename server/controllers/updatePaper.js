const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var res = ctx.res
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "Access-Control-Allow-Methods": "POST",
        "X-Powered-By": "3.2.1",
        'Content-Type': 'application/json;charset=utf-8'
    });

    var body = ctx.request.body
    console.log(body)
    var paper_id = body.paper_id
    //int?
    var time_limit = body.time_limit
    var type1_count = body.type1_count
    var type2_count = body.type2_count
    var type3_count = body.type3_count
    var que_count = type1_count + type2_count + type3_count
    var status = body.status

    await mysql("t_paper").where("paper_id", paper_id).update({ type1_count:type1_count,type2_count:type2_count,type3_count:type3_count, time_limit:time_limit, que_count:que_count, status:status})
    ctx.state.data = que_count
}