const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var res = ctx.res
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "Access-Control-Allow-Methods": "POST",
        "X-Powered-By": "3.2.1",
        'Content-Type': 'multipart/form-data;charset=utf-8'
    });

    var body = ctx.request.body
    console.log(body)
    var fields = body.fields
    console.log(fields)

    //t_list
    var file_id = fields.file_id
    
    var title = fields.title
    var serifu = fields.serifu
    var roma = fields.roma
    var stars = fields.stars

    //t_audio
    var shadow = fields.shadow
    var c_name = fields.c_name

    var src_image = fields.src_image

    var file_src_image = body.files.file_src_image
    console.log(body.files)
    console.log(file_src_image)

    await mysql("t_list").where("file_id", file_id).update({title:title,serifu:serifu,roma:roma,src_image:src_image,stars:stars})

    await mysql("t_audio").where("file_id", file_id).update({c_name:c_name,shadow:shadow})

    ctx.state.data = "update_pub"
}