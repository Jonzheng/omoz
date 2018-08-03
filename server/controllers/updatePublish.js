const { mysql } = require('../qcloud')
const cos = require('../qcos')
const fs = require('fs')

const Bucket = 'image-1256378396'
const Region = 'ap-guangzhou'

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
    console.log(file_src_image)

    function uploder(params) {
        return new Promise((resolve, reject) => {
            cos.putObject(params, function (err, data) {
                if (err) {
                    console.log(err)
                } else {
                    src_image = data['Location']
                }
                resolve()
            })
        })
    }

    if (file_src_image && file_src_image.size > 0){
        var fileName = file_id + '.png'
        file_src_image.name = fileName

        var params = {
            Bucket: Bucket,
            Region: Region,
            ContentLength: file_src_image.size,
            Key: file_src_image.name,
            Body: fs.createReadStream(file_src_image.path)
        }
        await uploder(params)
    }

    await mysql("t_list").where("file_id", file_id).update({title:title,serifu:serifu,roma:roma,src_image:src_image,stars:stars})

    await mysql("t_audio").where("file_id", file_id).update({c_name:c_name,shadow:shadow})

    ctx.state.data = "update_pub"
}