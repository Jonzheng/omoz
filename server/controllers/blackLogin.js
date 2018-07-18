const { mysql } = require('../qcloud')
const crypto = require('crypto')

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
    var auth_name = body.auth_name
    var auth_code = body.auth_code

    function getCode() {
        return new Promise((resolve, reject) => {
            var md5 = crypto.createHash('md5')
            auth_code = md5.update(auth_code).digest('hex')
            resolve()
        })
    }
    await getCode()
    var user = await mysql('t_user').select('*').where('auth_name', auth_name).andWhere('auth_code', auth_code).andWhere('status', 2)
    ctx.state.data = user
}