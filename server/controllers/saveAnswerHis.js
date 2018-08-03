const { mysql } = require('../qcloud')

module.exports = async ctx => {

    var body = ctx.request.body
    var paper_id = body.paper_id
    var openid = body.paper_id
    var answer = body.answer
    var spend = body.spend
    
    console.log(body)

    await mysql.raw('insert t_answer_his (paper_id,openid,answer,spend) values(?,?,?,?)on duplicate key update answer=?,spend=?', [paper_id,openid,answer,spend, answer,spend])
    
    ctx.state.data = answer
}