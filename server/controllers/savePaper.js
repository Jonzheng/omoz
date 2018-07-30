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

    var result = ""
    var body = ctx.request.body
    var paper_id = body.paper_id
    var title = body.title
    var description = body.description
    var attention = body.attention
    var level = body.level
    var difficulty = body.difficulty
    var uploader = body.uploader
    console.log(body)
    var ex_sql = mysql.raw('insert t_paper (paper_id,title,description,attention,level,difficulty,uploader) values(?,?,?,?,?,?,?)on duplicate key update title=?,description=?,attention=?,level=?,difficulty=?', [paper_id,title,description,attention,level,difficulty,uploader,title,description,attention,level,difficulty]).toString()
    console.log(ex_sql)
    result = await mysql.raw('insert t_paper (paper_id,title,description,attention,level,difficulty,uploader) values(?,?,?,?,?,?,?)on duplicate key update title=?,description=?,attention=?,level=?,difficulty=?', [paper_id,title,description,attention,level,difficulty,uploader,title,description,attention,level,difficulty])
    ctx.state.data = result
}