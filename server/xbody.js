const jsonBody = body => {
    if (typeof(body) === 'string' && body.startsWith('{') && body.endsWith('}')){
        var jody = JSON.parse(body)
        jody["jody"] = true
        return jody
    }
    return body
}

module.exports = {
    jsonBody: jsonBody
  }