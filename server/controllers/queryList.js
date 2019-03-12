const { mysql } = require('../qcloud')
const { jsonBody } = require('../xbody')

module.exports = async ctx => {
    var res = ctx.res
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "Access-Control-Allow-Methods": "POST",
        "X-Powered-By": "3.2.1",
        'Content-Type': 'application/json;charset=utf-8'
    });
    const body = jsonBody(ctx.request.body)
    const file_id = body.file_id
    const pageNo = body.pageNo
    const pageSize = body.pageSize
    const title = body.title
    const level = body.level
    var t_list = []
    if (file_id != undefined){
        t_list = await mysql('t_list').select('*').where('file_id', file_id)
    }else if (pageNo != undefined){
        var offset = (pageNo - 1) * pageSize
        var liket = '%'+title+'%'
        if (level) {
            t_list = await mysql('t_list').select('*').where('title', 'like', liket).andWhere('level', level).orderBy('stars', 'desc').limit(pageSize).offset(offset)
            var res = await mysql('t_list').count('file_id as total').where('title', 'like', liket).andWhere('level', level)
            t_list.push({total: res[0]['total']})
        }else{
            t_list = await mysql('t_list').select('*').where('title', 'like', liket).orderBy('stars', 'desc').limit(pageSize).offset(offset)
            var res = await mysql('t_list').count('file_id as total').where('title', 'like', liket)
            t_list.push({total: res[0]['total']})
        }

    }else{
        t_list = await mysql('t_list').select('*').where('status', 1).orderBy('stars', 'desc')
    }

    ctx.state.data = t_list
}