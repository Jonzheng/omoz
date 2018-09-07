const { mysql } = require('../qcloud')

module.exports = async ctx => {
    
    var body = ctx.request.body
    var openid = body.openid
    var point = body.point
    var status = body.status
    //例:puz = 'ka,na,tsu,a'
    var puz = body.puz

    var puz_map = {}
    var pn_sp = puz.split(",")

    var result = await mysql('t_link_rank').select('*').where('openid', openid)
    if (result && result.length > 0){
        var re_point = result.point
        point = point > re_point ? point:re_point
        var re_puz = result.puz
        if (re_puz != "" && puz != ""){ //puz已经有记录,例:puz = 'ra,6;ka,12;na,3;ta,10;tsu,2;'
            var puz_sp = re_puz.split(";")
            for (let sp of puz_sp){
                if (sp == "") continue
                var sps = sp.split(",")
                var spk = sps[0]
                var spv = sps[1]
                puz_map[spk] = spv
            }
        }
    }
    for (let p of pn_sp){
        var pnum = puz_map[p]
        pnum = pnum ? parseInt(pnum) += 1 : 1
        puz_map[p] = pnum
    }
    //puz_map -> puz
    puz = ""
    for (let k in puz_map){
        var pu = k + "," + puz_map[k] + ";"
        puz += pu
    }
    console.log(puz)

    //var ss = mysql.raw('insert t_link_rank (openid,point,puz,status,latest) values(?,?,?,?,now())on duplicate key update point= ?,round=round+1,status=?,latest=now()', [openid,point,puz,status, point,status]).toString()
    console.log(ss)
    
    await mysql.raw('insert t_link_rank (openid,point,puz,status,latest) values(?,?,?,?,now())on duplicate key update point= ?,round=round+1,status=?,latest=now()', [openid,point,puz,status, point,status])
    var result = await mysql('t_link_rank').select('*').where('openid', openid)
    ctx.state.data = result
}