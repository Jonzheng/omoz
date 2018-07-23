const { mysql } = require('../qcloud')
const cos = require('../qcos')
const fs = require('fs')

const que_sound = 'que-sound-1256378396'
const que_image = 'que-image-1256378396'
const Region = 'ap-guangzhou'

module.exports = async ctx => {
    var res = ctx.res
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "Access-Control-Allow-Methods": "POST",
        "X-Powered-By": "3.2.1",
        'Content-Type': 'application/json;charset=utf-8'
    });

    var result = {}
    var body = ctx.request.body
    console.log(body)
    var fields = body.fields
    console.log(fields)
    var paper_id = fields.paper_id
    var question_no = fields.question_no
    var title = fields.title
    var option_a = fields.option_a
    var option_b = fields.option_b
    var option_c = fields.option_c
    var option_d = fields.option_d
    var right_option = fields.right_option
    var an_explain = fields.an_explain
    var type = fields.type
    var uploader = fields.uploader
    var article = fields.article

    var point = 0
    var question_id = paper_id + "_" + type + "_" + question_no
    //上传图片
    var src_image = ""
    function upload_image() {
        //接收图片文件
        var file_image = body.files.file_image
        var image_name = question_id + ".png"
        //file_image.name = image_name
        var params_image = {
            Bucket: que_image,
            Region: Region,
            ContentLength: file_image.size,
            Key: image_name,
            Body: fs.createReadStream(file_image.path)
        }
        return new Promise((resolve, reject) => {
            cos.putObject(params_image, function (err, data) {
                resp = err || data
                src_image = resp['Location']
                resolve()
            })
        })
    }

    //上传音频
    var src_sound = ""
    function upload_sound() {
        //接收音频文件
        var file_sound = body.files.file_sound
        var sound_name = question_id + ".mp3"
        var params_sound = {
            Bucket: que_sound,
            Region: Region,
            ContentLength: file_image.size,
            Key: sound_name,
            Body: fs.createReadStream(file_sound.path)
        }
        return new Promise((resolve, reject) => {
            cos.putObject(params_sound, function (err, data) {
                resp = err || data
                src_sound = resp['Location']
                resolve()
            })
        })
    }

    if (type == "3"){
        console.log(fields)
        //图片+声音
        await upload_image()
        await upload_sound()
    }else if (type == "4" || type == "5"){
        console.log(fields)
        //只有声音
        await upload_sound()
    }
    console.log(fields)

    result["src_sound"] = src_sound
    result["src_image"] = src_image
    console.log(result)
    //数据库参数
    var insert_values = [question_id,paper_id,question_no,title,option_a,option_b,option_c,option_d,right_option,an_explain,point,type,article,src_sound,src_image,uploader]
    console.log(insert_values)
    var update_values = [title,option_a,option_b,option_c,option_d,right_option,an_explain,article,src_sound,src_image]
    console.log(update_values)
    var params_lst = insert_values.concat(update_values)
    console.log(params_lst)
    var str_sql = ""
    function get_sql(params_lst) {
        var str_sql_ins = 'insert t_question (question_id,paper_id,question_no,title,option_a,option_b,option_c,option_d,right_option,an_explain,point,type,article,src_sound,src_image,uploader) values('
        var que_m = new Array(params_lst.length)
        que_m.fill("?")
        var que_str = que_m + ""
        var str_sql_upd = ')on duplicate key update title=?,option_a=?,option_b=?,option_c=?,option_d=?,right_option=?,an_explain=?,article=?,src_sound=?,src_image=?'
        console.log(que_str)
        return new Promise((resolve, reject) => {
            str_sql = str_sql_ins+que_str+str_sql_upd
            console.log(str_sql)
            resolve()
        })
    }

    await get_sql(insert_values)
    console.log(str_sql)
    await mysql.raw(str_sql, params_lst)
    console.log(result)
    ctx.state.data = result
}