const { mysql } = require('../qcloud')
const { jsonBody } = require('../xbody')

module.exports = async ctx => {
    var res = ctx.res
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "POST",
        "X-Powered-By": "3.2.1",
        'Content-Type': 'application/json; charset=utf-8'
    });

    const body = jsonBody(ctx.request.body)
    //t_list
    var file_id = body.file_id
    var title = body.title
    var serifu = body.serifu
    var koner = body.koner
    var roma = body.roma
    var stars = body.stars

    //t_audio
    var shadow = body.shadow
    var c_name = title.split('_')[0]
    var src_image = body.src_image

    await mysql("t_list").where("file_id", file_id).update({title:title,serifu:serifu,koner:koner,roma:roma,src_image:src_image,stars:stars})
    await mysql("t_audio").where("file_id", file_id).update({c_name:c_name,shadow:shadow})

    ctx.state.data = body
}