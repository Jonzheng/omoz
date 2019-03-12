const { mysql } = require('../qcloud')
const cos = require('../qcos')
const { jsonBody } = require('../xbody')

const Bucket = 'video-1256378396'
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
        // 'Content-Type': 'multipart/form-data;charset=utf-8'
    });
    const body = jsonBody(ctx.request.body)
    var file_id = body.file_id
    var flst = file_id.split("_") //["ssr", "xtz", "0", "1"]
    var level = flst[0]
    var s_name = flst[1]
    var ski = flst[2]
    var ver = flst[3]
    var cate = "y"

    var src_audio = PreAudio + file_id + SufAudio
    var src_video = PreVideo + file_id + SufVideo

    //获得视频文件大小
    var params_get = {
        Bucket: Bucket,
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
    var src_image = body.src_image

    await mysql('t_list').insert({
        file_id: file_id,
        src_video: src_video,
        video_size: video_size,
        title: body.title,
        serifu: body.serifu,
        stars: body.stars,
        koner: body.koner,
        roma: body.roma,
        src_image: src_image,
        level: level,
        cate: cate,
        status: 1
    });

    await mysql('t_audio').insert({
        file_id: file_id,
        src_audio: src_audio,
        c_name: body.c_name,
        s_name: s_name,
        shadow: body.shadow,
        level: level,
        ski: ski,
        ver: ver,
        cate: cate,
        status: 1
    });

    ctx.state.data = body
}
