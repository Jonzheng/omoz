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
    var level = body.level
    var difficulty = body.difficulty
    var uploader = body.uploader
    //result = await mysql.raw('insert t_paper (paper_id,title,description,level,difficulty,uploader) values(?,?,?,?,?,?)on duplicate key update title=?,description=?,level=?,difficulty=?', [paper_id,title,description,level,difficulty,uploader,title,description,level,difficulty]);
    ctx.state.data = result
}