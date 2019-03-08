const cos = require('../qcos')

const Bucket = 'image-1256378396'
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
    var params = {
        Bucket: Bucket,
        Region: Region
    }
    var lst = []
    function find() {
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
    await find()
    var content = lst["Contents"]
    ctx.state.data = { content }
}