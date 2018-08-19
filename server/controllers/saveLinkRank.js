const { mysql } = require('../qcloud')

module.exports = async ctx => {
    
    var body = ctx.request.body
    var openid = body.openid
    var point = body.point
    var round = body.round
    var status = body.status

    console.log(body)

    await mysql.raw('insert t_link_rank (openid,point,round,status,latest) values(?,?,?,?,now())on duplicate key update point=?,round=?,status=?,latest=now()', [openid,point,round,status, point,round,status])
    var ss = mysql.raw('insert t_link_rank (openid,point,round,status,latest) values(?,?,?,?,now())on duplicate key update point=?,round=?,status=?,latest=now()', [openid,point,round,status, point,round,status]).toString()
    console.log(ss)
    var result = await mysql('t_link_rank').select('*')
    ctx.state.data = result
}