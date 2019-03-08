const keyBody = body => {
    for (let key in body) {
        if (key.indexOf(',') != -1 && key.indexOf(':') != -1){
            body = JSON.parse(key)
            break;
        }
    }
    return body
}

module.exports = {
    keyBody: keyBody
  }