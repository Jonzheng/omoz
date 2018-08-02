const { mysql } = require('../qcloud')
const cos = require('../qcos')

const Bucket = 'audio-1256378396'
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
    var file_id = body.file_id

    var result = []
    if (file_id){
        
        var t_list = await mysql('t_list').select('*').andWhere('file_id', file_id)
        var t_audio = await mysql('t_audio').select('*').andWhere('file_id', file_id)
        result = {"t_list":t_list,"t_audio":t_audio}

    }else{
        var params = {
            Bucket: Bucket,
            Region: Region
        }
        var lst = []
        function list() {
            return new Promise((resolve, reject) => {
                cos.getBucket(params, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(data);
                        lst = data
                    }
                    resolve()
                });
            })
        }
    
        await list()
    
        var content = lst["Contents"]
    
        var t_audio = await mysql('t_audio').select('*')
        result = {"content":content,"t_audio":t_audio}
    }

    ctx.state.data = result
}