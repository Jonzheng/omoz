const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var res = ctx.res
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "Access-Control-Allow-Methods": "POST",
        "X-Powered-By": "3.2.1",
        'Content-Type': 'application/json;charset=utf-8'
    });
    var body = ctx.request.body
    var file_id = body.file_id

    var t_list = []
    if (file_id != undefined){
        t_list = await mysql('t_list').select('*').andWhere('file_id', file_id)
    }else{
        t_list = await mysql('t_list').select('*').orderBy('stars', 'desc')
    }

    ctx.state.data = t_list
}