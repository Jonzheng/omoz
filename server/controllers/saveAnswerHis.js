const { mysql } = require('../qcloud')

module.exports = async ctx => {

    var body = ctx.request.body
    var paper_id = body.paper_id
    var openid = body.openid
    var answer = body.answer
    var god_on = body.god_on
    var spend = body.spend
    
    var listen_1 = body.listen_1
    var listen_2 = body.listen_2
    var listen_3 = body.listen_3
    var listen_4 = body.listen_4

    console.log(body)

    await mysql.raw('insert t_answer_his (paper_id,openid,answer,god_on,spend,listen_1,listen_2,listen_3,listen_4) values(?,?,?,?,?,?,?,?,?)on duplicate key update answer=?,spend=?', [paper_id,openid,answer,god_on,spend,listen_1,listen_2,listen_3,listen_4, answer,spend])
    
    ctx.state.data = answer
}