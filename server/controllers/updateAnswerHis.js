const { mysql } = require('../qcloud')

module.exports = async ctx => {

    var body = ctx.request.body
    var paper_id = body.paper_id
    var openid = body.openid
    var answer = body.answer
    var spend = body.spend
    var god_on = body.god_on
    var listen_1 = body.listen_1
    var listen_2 = body.listen_2
    var listen_3 = body.listen_3
    var listen_4 = body.listen_4
    
    //console.log(body)

    await mysql("t_answer_his").where("paper_id", paper_id).andWhere("openid", openid).andWhere("god_on", god_on).update({
        answer: answer,
        spend: spend,
        listen_1: listen_1,
        listen_2: listen_2,
        listen_3: listen_3,
        listen_4: listen_4,
    })
    
    ctx.state.data = answer
}