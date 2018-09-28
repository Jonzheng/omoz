const { mysql } = require('../qcloud')
const cos = require('../qcos')
const fs = require('fs')

const Bucket = 'image-1256378396'
const Region = 'ap-guangzhou'

const PreAudio = 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/'
const SufAudio = '.mp3'
const PreVideo = 'https://video-1256378396.cos.ap-guangzhou.myqcloud.com/'
const SufVideo = '.mp4'

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
    var file_id = fields.file_id
    var flst = file_id.split("_") //["ssr", "xtz", "0", "1"]
    var level = flst[0]
    var s_name = flst[1]
    var ski = flst[2]
    var ver = flst[3]
    var cate = "y"

    var file_src_image = body.files.file_src_image

    var src_audio = PreAudio + file_id + SufAudio
    var src_video = PreVideo + file_id + SufVideo

    //获得视频文件大小
    var params_get = {
        Bucket: "video-1256378396",
        Region: Region,
        Prefix: file_id
    }
    var video_size = 0
    function getVideoSize(params_get) {
        return new Promise((resolve, reject) => {
            cos.getBucket(params_get, function (err, data) {
                if (err) {
                    console.log(err)
                } else {
                    if (data["Contents"].length > 0) video_size = data["Contents"][0].Size
                }
                resolve()
            });
        })
    }
    await getVideoSize(params_get)

    //await 在async修饰的函数下,必须是Promise才有效果
    var src_image = ""
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

    //没有选择文件的情况可以update
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

    await mysql('t_list').insert({
        file_id: file_id,
        src_video: src_video,
        video_size: video_size,
        title: fields.title,
        serifu: fields.serifu,
        stars: fields.stars,
        koner: fields.koner,
        roma: fields.roma,
        src_image: src_image,
        level: level,
        cate: cate,
        status: 1
    });

    await mysql('t_audio').insert({
        file_id: file_id,
        src_audio: src_audio,
        c_name: fields.c_name,
        s_name: s_name,
        shadow: fields.shadow,
        level: level,
        ski: ski,
        ver: ver,
        cate: cate,
        status: 1
    });

    ctx.state.data = src_image
}
