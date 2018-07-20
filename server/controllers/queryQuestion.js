const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var res = ctx.res
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "Access-Control-Allow-Methods": "POST,GET",
        "X-Powered-By": "3.2.1",
        'Content-Type': 'application/json;charset=utf-8'
    });
    var body = ctx.request.body
    var paper_id = body.paper_id
    //查询
    var t_question = await mysql('t_question').select('*').where('paper_id', paper_id)

    ctx.state.data = t_question
}