const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var res = ctx.res
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "Access-Control-Allow-Methods": "POST,GET,",
        "X-Powered-By": "3.2.1",
        'Content-Type': 'application/json;charset=utf-8'
    });
    var data = {}
    var body = ctx.request.body
    var file_id = body.file_id
    if (file_id != undefined){
        data = await mysql('t_list').select('*').where('cate', body.cate).andWhere('file_id', file_id)
    }else{
        data = await mysql('t_list').select('*').where('cate', body.cate)
    }
    ctx.state.data = data
}