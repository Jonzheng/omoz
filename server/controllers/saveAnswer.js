const { mysql } = require('../qcloud')

module.exports = async ctx => {

    var body = ctx.request.body
    var answer_id = body.answer_id
    var paper_id = body.paper_id
    var openid = body.openid
    var answer = body.answer
    var spend = body.spend
    var point = body.point

    
    var cate1_right = body.cate1_right
    var cate2_right = body.cate2_right
    var cate3_right = body.cate3_right
    var cate1_total = body.cate1_total
    var cate2_total = body.cate2_total
    var cate3_total = body.cate3_total
    

    //console.log(body)
    //console.log([answer_id,paper_id,openid,answer,spend,point,cate1_right,cate2_right,cate3_right,cate1_total,cate2_total,cate3_total, answer])
    //var ss = mysql.raw('insert t_answer (answer_id,paper_id,openid,answer,spend,point,cate1_right,cate2_right,cate3_right,cate1_total,cate2_total,cate3_total) values(?,?,?,?,?,?,?,?,?,?,?,?)on duplicate key update answer=?', [answer_id,paper_id,openid,answer,spend,point,cate1_right,cate2_right,cate3_right,cate1_total,cate2_total,cate3_total, answer]).toString()
    //console.log(ss)
    await mysql.raw('insert t_answer (answer_id,paper_id,openid,answer,spend,point,cate1_right,cate2_right,cate3_right,cate1_total,cate2_total,cate3_total) values(?,?,?,?,?,?,?,?,?,?,?,?)on duplicate key update answer=?', [answer_id,paper_id,openid,answer,spend,point,cate1_right,cate2_right,cate3_right,cate1_total,cate2_total,cate3_total, answer])
    
    ctx.state.data = answer_id
}