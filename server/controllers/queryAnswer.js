const { mysql } = require('../qcloud')

module.exports = async ctx => {
    
    var body = ctx.request.body
    console.log(body)
    var t_answer = []
    var paper_id = body.paper_id
    var openid = body.openid

    //唯一的是answer_id
    if (paper_id && openid){  //可能做了很多次试卷

        t_answer = await mysql('t_answer').select('*').where('paper_id', paper_id).andWhere('openid', openid)

    }else if(paper_id){  //排名时查询用

        t_answer = await mysql('t_answer').select('*').where('paper_id', paper_id).leftJoin('t_user', 't_answer.openid', 't_user.openid')

    }

    ctx.state.data = t_answer
}