const { mysql } = require('../qcloud')

module.exports = async ctx => {

    var body = ctx.request.body
    var answer_id = body.answer_id
    var paper_id = body.paper_id
    var openid = body.paper_id
    var answer = body.answer
    var spend = body.spend
    var point = body.point
    
    console.log(body)

    await mysql.raw('insert t_answer (answer_id,paper_id,openid,answer,spend,point) values(?,?,?,?,?,?)on duplicate key update answer=?', [answer_id,paper_id,openid,answer,spend,point, answer])
    
    ctx.state.data = answer
}