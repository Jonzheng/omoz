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

    var body = ctx.request.body
    var fields = body.fields
    console.log(body)
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

    var src_image = fields.src_image
    var title_image = fields.title_image

    var point = 0
    var question_id = paper_id + "_" + type + "_" + question_no

    var file_title_image = body.files.file_title_image
    var file_src_image = body.files.file_src_image
    var file_sound = body.files.file_sound

    //上传图片
    function upload_title_image() {
        //接收图片文件
        var image_name = question_id + "_" + new Date().getTime() + ".png"
        file_title_image.name = image_name
        var params_image = {
            Bucket: que_image,
            Region: Region,
            ContentLength: file_title_image.size,
            Key: image_name,
            Body: fs.createReadStream(file_title_image.path)
        }
        return new Promise((resolve, reject) => {
            cos.putObject(params_image, function (err, data) {
                resp = err || data
                title_image = resp['Location']
                resolve()
            })
        })
    }

    //上传图片
    function upload_src_image() {
        //接收图片文件
        var image_name = question_id + "_" + new Date().getTime() + ".png"
        file_src_image.name = image_name
        var params_image = {
            Bucket: que_image,
            Region: Region,
            ContentLength: file_src_image.size,
            Key: image_name,
            Body: fs.createReadStream(file_src_image.path)
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
        var sound_name = question_id + "_" + new Date().getTime() + ".mp3"
        file_sound.name = sound_name
        var params_sound = {
            Bucket: que_sound,
            Region: Region,
            ContentLength: file_sound.size,
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

    console.log(file_title_image)
    console.log(file_sound)
    //题目中图片
    if (file_title_image && file_title_image.size > 0){
        console.log("up_title_image...")
        await upload_title_image()
    }
    //阅读图片
    if (file_src_image && file_src_image.size > 0){
        console.log("up_src_image...")
        await upload_src_image()
    }
    if (file_sound && file_sound.size > 0){
        console.log("up_sound..")
        await upload_sound()
    }

    //数据库参数
    var insert_values = [question_id,paper_id,question_no,title,title_image,option_a,option_b,option_c,option_d,right_option,an_explain,point,type,article,src_sound,src_image,uploader]
    var update_values = [title,title_image,option_a,option_b,option_c,option_d,right_option,an_explain,article,src_sound,src_image]
    var params_lst = insert_values.concat(update_values)
    var str_sql = ""
    console.log(params_lst)
    function get_sql(params_lst) {
        var str_sql_ins = 'insert t_question (question_id,paper_id,question_no,title,title_image,option_a,option_b,option_c,option_d,right_option,an_explain,point,type,article,src_sound,src_image,uploader) values('
        var que_m = new Array(params_lst.length)
        que_m.fill("?")
        var que_str = que_m + ""
        var str_sql_upd = ')on duplicate key update title=?,title_image=?,option_a=?,option_b=?,option_c=?,option_d=?,right_option=?,an_explain=?,article=?,src_sound=?,src_image=?'
        return new Promise((resolve, reject) => {
            str_sql = str_sql_ins+que_str+str_sql_upd
            resolve()
        })
    }
    await get_sql(insert_values)
    console.log(str_sql)
    var sql = mysql.raw(str_sql, params_lst).toString()
    console.log(sql)
    await mysql.raw(str_sql, params_lst)
    var qeustion = {question_id,paper_id,question_no,title,title_image,option_a,option_b,option_c,option_d,right_option,an_explain,point,type,article,src_sound,src_image,uploader}
    ctx.state.data = qeustion
}