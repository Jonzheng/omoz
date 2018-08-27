const { mysql } = require('../qcloud')

module.exports = async ctx => {
    
    var body = ctx.request.body
    var openid = body.openid
    var point = body.point
    var status = body.status

    //console.log(body)
    //var ss = mysql.raw('insert t_link_rank (openid,point,status,latest) values(?,?,?,now())on duplicate key update point=case when ? > point then ? else point end,round=round+1,status=?,latest=now()', [openid,point,status, point,point,status]).toString()
    //console.log(ss)
    
    await mysql.raw('insert t_link_rank (openid,point,status,latest) values(?,?,?,now())on duplicate key update point=case when ? > point then ? else point end,round=round+1,status=?,latest=now()', [openid,point,status, point,point,status])
    var result = await mysql('t_link_rank').select('*').where('openid', openid)
    ctx.state.data = result
}