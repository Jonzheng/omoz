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
    console.log(body)
    var paper_id = body.paper_id
    var status = body.status

    if (paper_id){ //单个查询--attention
        var t_paper = await mysql('t_paper').select('*').where('paper_id', paper_id)
    }else if(status){ //查询发布状态的所有--list show
        var t_paper = await mysql('t_paper').select('*').where('status', status)
    }else{ //查询所有--数据管理
        var t_paper = await mysql('t_paper').select('*')
    }

    ctx.state.data = t_paper
}