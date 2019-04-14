/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
// ar host = 'https://06mdkod2.qcloud.la';
var host = 'https://418980938.omoz.club';

var appId = 'wx2ce3e7794b9393b8';
var appSecret = '258ce2e03d8dd6f330d6d6f3423411da';

var urls = {
    host,
    queryList: `${host}/weapp/queryList`,
    queryDetail: `${host}/weapp/queryDetail`,
    inList: `${host}/weapp/inList`,
    upVideo: `${host}/weapp/upVideo`,
    upAudio: `${host}/weapp/upAudio`,
    uploadRecord: `${host}/weapp/uploadRecord`,
    updateLogin: `${host}/weapp/updateLogin`,
    updateUser: `${host}/weapp/updateUser`,
    updateRecord: `${host}/weapp/updateRecord`,
    updateHeart: `${host}/weapp/updateHeart`,
    cancelHeart: `${host}/weapp/cancelHeart`,
    queryPaper: `${host}/weapp/queryPaper`,
    queryQuestion: `${host}/weapp/queryQuestion`,
    queryAnswerHis: `${host}/weapp/queryAnswerHis`,
    saveAnswerHis: `${host}/weapp/saveAnswerHis`,
    updateAnswerHis: `${host}/weapp/updateAnswerHis`,
    saveLinkRank: `${host}/weapp/saveLinkRank`,
    queryLinkRank: `${host}/weapp/queryLinkRank`,
    checkLinkRank: `${host}/weapp/checkLinkRank`,
    buyLinkColor: `${host}/weapp/buyLinkColor`,
    saveAnswer: `${host}/weapp/saveAnswer`,
    queryAnswer: `${host}/weapp/queryAnswer`,
    updateColor: `${host}/weapp/updateColor`,
    queryComment: `${host}/weapp/queryComment`,
    saveComment: `${host}/weapp/saveComment`,
    deleteComment: `${host}/weapp/deleteComment`,
    updateZan: `${host}/weapp/updateZan`,
    cancelZan: `${host}/weapp/cancelZan`,
};

module.exports = urls;
