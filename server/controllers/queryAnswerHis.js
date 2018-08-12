const { mysql } = require('../qcloud')

module.exports = async ctx => {
    
    var body = ctx.request.body
    console.log(body)
    var t_answer_his = []
    var paper_id = body.paper_id
    var openid = body.openid
    var god_on = body.god_on

    if (paper_id && openid){
        t_answer_his = await mysql('t_answer_his').select('*').where('paper_id', paper_id).andWhere('openid', openid).andWhere('god_on', god_on)
    }

    ctx.state.data = t_answer_his
}