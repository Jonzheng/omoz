const urls = require('../../config')
const App = new getApp()
const recorderManager = wx.getRecorderManager()
const options = {
    duration: 10000,
    sampleRate: 44100,
    numberOfChannels: 2,
    encodeBitRate: 320000,
    format: 'mp3',
    frameSize: 50
}
const dura = options.duration / 1000

const load_list = [0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.7, 1.9, 2.1, 2.3, 2.5, 2.7, 2.9, 3.1, 3.3, 3.5, 3.7, 3.9, 4.1, 4.3]
//const downloadTask = wx.downloadFile({
//    url: src_sound,
//    success: function (res) {
//        console.log(res)
//    }
//})

const src_heart = "../../image/heart.png"
const src_heart_full = "../../image/heart_full.png"
const src_zan_em = "../../image/zan_em.png"
const src_zan_fu = "../../image/zan_fu.png"

function _next() {
    var that = this;
    var _progress = this.data.progress_record
    if (!this.data.isRecording) {
        return true;
    }
    if (_progress >= 100) {
        _progress = 100;
        return true
    }
    this.setData({
        progress_record: _progress + 2
    });
    setTimeout(function () {
        _next.call(that);
    }, 200);
}

Page({
    data: {
        loged: false,
        slider: 'bar-ori',
        oriPlaying: false,
        show_video: false,
        an_in: false,
        list_master:[],
        record_map:{},
        icon_trash: "../../image/trash.png",
        icon_upload: "../../image/upload.png",
        icon_record: "../../image/record.png",
        icon_comm: "../../image/comm.png",
        icon_more: "../../image/more.png",
        re_id: '',
        re_name: '',
        re_content: '',
        icon_zan_em: src_zan_em,
        icon_zan_fu: src_zan_fu,
        progress_record: 0,
        hasTmp: false,
        isRecording: false,
        isPlaying: false,
        show_other: true,
        tempFile: '',

    },
    onUnload: function () {
        console.log("onUnload")
        var audioContextOri = this.data.audioContextOri
        var audioContextMaster = this.data.audioContextMaster
        var audioContextMine = this.data.audioContextMine
        audioContextOri.stop()
        audioContextMine.stop()
        audioContextMaster.stop()
    },
    onReady: function (res) {
        this.videoContext = wx.createVideoContext('myVideo')

        const audioContextOri = wx.createInnerAudioContext()
        const audioContextMaster = wx.createInnerAudioContext()
        const audioContextMine = wx.createInnerAudioContext()

        this.setData({
            audioContextOri,
            audioContextMaster,
            audioContextMine,
        })

        audioContextOri.onPlay(() => {
            console.log("audioContextOri...")
            this.setData({
                slider: 'bar-end',
                oriPlaying: true,
            });
        });

        audioContextOri.onEnded(() => {
            this.setOriStop();
        });

        audioContextOri.onStop(() => {
            this.setOriStop();
        });

        audioContextMaster.onEnded(() => {
            this.setMasterStop();
        });

        audioContextMine.onEnded(() => {
            this.setMineStop();
        });

        audioContextMine.onStop(() => {
            this.setMineStop();
        });

        //----监听录音------------
        recorderManager.onStart(() => {
            console.log('start,dura:' + dura)
            this.setData({
                isRecording: true,
                dura: dura,
                isPlayed: false,
            })
            _next.call(this);
        })

        recorderManager.onStop((res) => {
            console.log(res)
            var progress_record = res.duration / options.duration * 100
            this.setData({
                progress_record,
                tempFile: res,
                isRecording: false,
                hasTmp: true
            })
        })
    },

    toLogin: function (e) {
        var that = this
        var userInfo = e.detail.userInfo
        console.log("toLogin:")
        if(userInfo){
            App.globalData.hasLogin = true
            App.globalData.userInfo = userInfo
            App.globalData.nickName = userInfo.nickName
            App.globalData.avatarUrl = userInfo.avatarUrl
            var gender = 1
            if (userInfo.gender != "" || userInfo.gender != undefined) gender = userInfo.gender
            App.globalData.gender = gender
            this.setData({
                loged: true,
            })
            console.log(userInfo)
            that.updateUser(userInfo)
        }else{
            App.globalData.hasLogin = false
            this.setData({
                loged: false,
            })
            console.log(userInfo)
        }
    },
    //卍解-coin-1?
    unlock: function(){
        console.log("unlock")
        this.setData({
            show_video:true
        })
    },
    //更新用户到数据库
    updateUser: (userInfo) => {
        var openid = App.globalData.openid
        var nickName = App.globalData.nickName
        var avatarUrl = App.globalData.avatarUrl
        var gender = App.globalData.gender
        wx.request({
            url: urls.updateUser,
            method: 'POST',
            data: {
                openid,
                nickName,
                avatarUrl,
                gender,
            },
            success: function (res) {
                console.log('updateUser:')
                console.log(res)
            },
            fail: (res) => {
                console.log('fail:')
                console.log(res)
            }
        });
    },

    initSerifu: function(list_element){
        var serifu = list_element.serifu
        var koner = list_element.koner
        var roma = list_element.roma

        var serifu_lst = []
        serifu = serifu.replace(new RegExp('[)(]+', 'g'),"#")
        var serifu_sp = serifu.split("#")
        for (let [idx, word] of serifu_sp.entries()){
            if (idx % 2 == 0){
                var cs = ""
                var sm = {word, cs}
                serifu_lst.push(sm)
            }else{ //平假注音
                var cs = "dc-word left-" + word.length
                var sm = {word, cs}
                serifu_lst.push(sm)
            }
        }
        this.setData({
            serifu_lst,
            koner,
            roma,
        })
    },

    initPageData: function (file_id) {
        var that = this
        var openid = App.globalData.openid
        var user_id = openid ? openid : ''
        console.log(file_id, '#', user_id)
        wx.showLoading({title: '加载中...'})
        //查询阴阳师list
        wx.request({
            url: urls.queryDetail,
            method: 'POST',
            data: { cate: 'y', file_id, user_id},
            success: function (res) {
                console.log("queryDetail:")
                wx.hideLoading()
                const data = res.data.data
                if (!data) return
                var list_element = data["list_result"][0]
                var audio_element = data["audio_result"][0]
                var record_result = data["record_result"][0]
                var list_other = data["list_other"][0]
                that.initSerifu(list_element)
                for (let record of record_result) {
                    record["listenStatus"] = "listen-off"
                    record["boxStyle"] = "btn-play-box"
                    record["btnDelStyle"] = "btn-red-hidden"
                    record["btnPoiStyle"] = "btn-red-hidden"
                    record["btnRt"] = ""
                    record["mon"] = "comment-hide"
                    record["comm_word"] = record.comm
                    record["holder"] = "输入文字"
                    if (record.heart_ud){
                        record["heartShape"] = src_heart_full
                        record["heartStatus"] = 1
                    }else{
                        record["heartShape"] = src_heart
                        record["heartStatus"] = 0
                    }
                    
                    record["isListen"] = false
                }
                var other_lst = []
                for (let ot of list_other) {
                    if (ot.file_id == file_id) continue
                    other_lst.push(ot)
                }
                var shadow = audio_element.shadow.split(",").map((item) => { return item + 'rpx' })
                var video_size = list_element.video_size / 1048576
                that.setData({
                    other_lst,
                    list_element,
                    audio_element,
                    list_master:record_result,
                    video_size: video_size.toFixed(2),
                    shadow
                })
            },
            error: function(er) {
                console.log(er)
            }
        })
    },

    onLoad: function (option) {
        //页面初始参数
        var file_id = option['file_id']
        this.initPageData(file_id)
        this.setData({
            file_id,
            loged:App.globalData.hasLogin,
        })
        setTimeout(()=>{this.setData({an_in:true,show_other:false})},300)
    },
    onPullDownRefresh: function () {
        const file_id = this.data.file_id
        const option = {file_id}
        this.onLoad(option)
        wx.stopPullDownRefresh()
    },

    setOriStop: function(){
        this.setData({
            slider: 'bar-ori',
            oriPlaying: false,
        });
    },

    setMasterStop: function () {
        var index = this.data.listenIndex
        var audioContextMaster = this.data.audioContextMaster
        //console.log("setMasterStop:", index)
        var list_master = this.data.list_master
        if (index != null && list_master[index]["isListen"]) {
            list_master[index]["isListen"] = false
            list_master[index]["listenStatus"] = "listen-off"
            list_master[index]["anListen"] = ""
            audioContextMaster.stop()
            this.setData({
                list_master,
                listenIndex:null
            }) 
        }
    },

    setMineStop: function () {
        this.setData({
            isPlaying: false,
            isPlayed: true
        })
    },

    playOri: function(e) {
        var audioContextOri = this.data.audioContextOri
        var audio_element = this.data.audio_element
        audioContextOri.src = audio_element.src_audio
        if (!this.data.oriPlaying){
            audioContextOri.play()
        }else{
            this.stopOri()
        }
    },

    stopOri: function (e) {
        var audioContextOri = this.data.audioContextOri
        audioContextOri.stop()
    },

    showMore: function(e){
        var that = this
        var currData = e.currentTarget.dataset
        var index = currData.idx
        var list_master = this.data.list_master
        var master_id = list_master[index]["master_id"]
        var isSelf = false
        if (master_id == App.globalData.openid) isSelf = true
        //console.log(isSelf)
        //console.log(list_master[index])
        if (list_master[index]["btnRt"] == "rt-90"){
            list_master[index]["boxStyle"] = "btn-play-box"
            list_master[index]["btnRt"] = ""
            if(isSelf){
                list_master[index]["btnDelStyle"] = "btn-red-hidden"
            }else{
                list_master[index]["btnPoiStyle"] = "btn-red-hidden"
            }
        }else{
            list_master[index]["boxStyle"] = "btn-play-box-sm"
            list_master[index]["btnRt"] = "rt-90"
            if (isSelf) {
                list_master[index]["btnDelStyle"] = "btn-red"
            } else {
                list_master[index]["btnPoiStyle"] = "btn-red"
            }
        }
        that.setData({
            list_master
        }) 
    },

    //弃用
    playFoo: function (e) {
        var ch = this.data.list_master
        var dataset = e.currentTarget["dataset"]
        var idx = dataset["idx"]
        ch[idx]["isListen"] = !ch[idx]["isListen"]
        this.setData({
            list_master: ch
        })
        console.log(ch[idx])
    },

    //录音
    startRecord: function (e) {
        if (this.data.isPlaying) {
            this.stopMyVoice()
        }
        if (this.data.hasTmp){
            this.data.tempFile = undefined
            this.setData({
                hasTmp: false,
                progress_record: 0
            })
            return
        }
        this.stopOri()
        if (!this.data.isRecording){
            recorderManager.start(options)
        }else{
            recorderManager.stop()
            this.setData({
                isRecording: false,
                hasTmp: true,
            })
        }
        
    },

    playMyVoice: function (e) {
        if (this.data.isRecording) {
            return false
        }
        var audioContextMine = this.data.audioContextMine
        var tempFile = this.data.tempFile
        if (tempFile != undefined) {
            console.log(tempFile.tempFilePath)
            audioContextMine.src = tempFile.tempFilePath
            if (!this.data.isPlaying){
                audioContextMine.play()
                this.setData({
                    isPlaying: true,
                    recordFile: tempFile.tempFilePath
                })
            }else{
                audioContextMine.stop()
            }

        }
    },

    delMine: function (record_id){
        wx.request({
            url: urls.updateRecord,
            method: 'POST',
            data: {
                record_id,
                status:0
            },
            success: function (res) {
                console.log('updateRecord:')
                console.log(res)
            },
            fail: (res) => {
                console.log('updateRecord.fail:')
                console.log(res)
            }
        });
    },

    delConfirm: function (e) {
        var that = this
        var currData = e.currentTarget.dataset
        var record_id = currData.record_id
        var index = currData.idx
        wx.showModal({
            title: '删除录音?',
            content: '不可逆操作,请再次确认',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                //console.log(res);
                if (res.confirm) {
                    var list_master = that.data.list_master
                    list_master.splice(index, 1)
                    that.setData({list_master})
                    that.delMine(record_id)
                } else {
                    //console.log('用户点击辅助操作')
                }
            }
        });
    },

    delCommConfirm: function (e) {
        var that = this
        var currData = e.currentTarget.dataset
        var comm_id = currData.cid
        var index = currData.idx
        wx.showModal({
            title: '删除评论?',
            content: '不可逆操作,请再次确认',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                //console.log(res);
                if (res.confirm) {
                    that.delComment(index, comm_id)
                } else {
                    //console.log('用户点击辅助操作')
                }
            }
        });
    },


    listen: function(e){
        var that = this
        var currData = e.currentTarget.dataset
        var record_id = currData.record_id
        var index = currData.idx
        var list_master = this.data.list_master
        var src_record = list_master[index]["src_record"]
        var audioContextMaster = this.data.audioContextMaster
        if (!src_record) return
        if (list_master[index]["isListen"]){
            list_master[index]["isListen"] = false
            list_master[index]["listenStatus"] = "listen-off"
            list_master[index]["anListen"] = ""
            audioContextMaster.stop()
        }else{
            that.setMasterStop()
            list_master[index]["isListen"] = true
            list_master[index]["listenStatus"] = "listen-on"
            list_master[index]["anListen"] = "an-listen-on"
            console.log(index,src_record)
            audioContextMaster.src = src_record
            that.setData({
                listenIndex: index
            })
            audioContextMaster.play()
        }
        this.setData({
            list_master
        }) 
    },

    //--点心--
    updateHeart: function(e){
        var that = this
        var currData = e.currentTarget.dataset
        var status = currData.status
        var url = ""
        var index = currData.idx
        var list_master = this.data.list_master
        var curr_master = list_master[index]
        if (status == 0) {
            url = urls.updateHeart
            curr_master["heartShape"] = src_heart_full
            curr_master["heartStatus"] = 1
            curr_master["heart"] += 1
        } else {
            url = urls.cancelHeart
            curr_master["heartShape"] = src_heart
            curr_master["heartStatus"] = 0
            curr_master["heart"] -= 1
        }
        console.log(curr_master)
        var record_id = curr_master["record_id"]
        var master_id = curr_master["master_id"]
        var file_id = curr_master["file_id"]
        var openid = App.globalData.openid
        var user_id = openid
        wx.request({
            url: url,
            method: 'POST',
            data: {
                record_id,
                master_id,
                file_id,
                user_id
            },
            success: function (res) {
                console.log('updateHeart:')
                console.log(res)
                that.setData({
                    list_master
                })
            },
            fail: (res) => {
                console.log('updateHeart fail:')
                console.log(res)
            }
        });
    },

    uploadRecord: function (e) {
        var that = this
        var recordFile = this.data.recordFile
        console.log("recordFile:")
        console.log(recordFile)
        var openid = App.globalData.openid
        var file_id = this.data.file_id
        wx.uploadFile({
            url: urls.uploadRecord,
            filePath: recordFile,
            name: 'file',
            formData: {
                file_id: file_id,
                openid: openid,
            },
            header: {
                'content-type': 'multipart/form-data'
            },
            success: function (res) {
                console.log(res)
                that.onPullDownRefresh()
            }
        })
    },
    showComment: function(e){
        var openid = App.globalData.openid
        var user_id = openid
        var that = this
        var currData = e.currentTarget.dataset
        var index = currData.idx
        var list_master = this.data.list_master
        this.clearInput()
        if (list_master[index]["mon"] == "comment-show"){
            list_master[index]["mon"] = "comment-hide"
            list_master[index]["comm_word"] = list_master[index]["comm"]
            that.setData({list_master})
        }else{
            list_master[index]["mon"] = "comment-show"
            list_master[index]["comm_word"] = "收起"
            const record_id = list_master[index]["record_id"]
            wx.showLoading({title: '加载中...'})
            wx.request({
                url: urls.queryComment,
                method: 'POST',
                data: {
                    record_id,
                    user_id
                },
                success: function (res) {
                    const comments = res.data.data[0]
                    for (let v of comments) {
                        v["zanShape"] = v.zid ? src_zan_fu : src_zan_em
                        v["self"] = v.user_id === user_id
                    }
                    list_master[index]["comments"] = comments
                    wx.hideLoading()
                    that.setData({list_master})
                }
            });
        }
    },
    addComment: function(e) {
        var that = this
        const content = e.detail.value
        var currData = e.currentTarget.dataset
        var index = currData.idx
        var list_master = this.data.list_master
        for (let v of list_master){
            v["focus"] = false
            v["holder"] = "输入文字"
        }
        const master = list_master[index]
        const record_id = master.record_id
        const master_id = master.master_id
        const file_id = master.file_id
        var openid = App.globalData.openid
        var user_id = openid
        const re_id = this.data.re_id
        const re_name = this.data.re_name
        const re_content = this.data.re_content
        const comment = {record_id, master_id, file_id, user_id, content, re_id, re_name, re_content}
        wx.request({
            url: urls.saveComment,
            method: 'POST',
            data: comment,
            success: function (res) {
                const comments = res.data.data[0]
                for (let v of comments) {
                    v["zanShape"] = v.zid ? src_zan_fu : src_zan_em
                    v["self"] = v.user_id === user_id
                }
                list_master[index]["comments"] = comments
                list_master[index]["comm"] = comments.length
                list_master[index]["inputValue"] = ""
                that.setData({list_master})
            }
        });
    },
    reply: function(e) {
        var that = this
        var currData = e.currentTarget.dataset
        const index = currData["idx"]
        const re_id = currData["cid"]
        const re_name = currData["name"]
        const re_content = currData["content"]
        var list_master = this.data.list_master
        this.clearInput()
        list_master[index]["holder"] = "回复:"+re_name
        list_master[index]["focus"] = true
        that.setData({list_master,re_id,re_name,re_content})

    },
    clearInput: function(){
        var list_master = this.data.list_master
        for (let v of list_master){
            v["focus"] = false
            v["holder"] = "输入文字"
        }
        const re_id = ''
        const re_name = ''
        const re_content = ''
        this.setData({list_master,re_id,re_name,re_content})
    },
    delComment: function(index, comm_id){
        var openid = App.globalData.openid
        var user_id = openid
        var that = this
        var list_master = this.data.list_master
        this.clearInput()
        const record_id = list_master[index]["record_id"]
        wx.showLoading({title: '...'})
        wx.request({
            url: urls.deleteComment,
            method: 'POST',
            data: {
                comm_id,
                record_id,
                user_id
            },
            success: function (res) {
                const comments = res.data.data[0]
                for (let v of comments) {
                    v["zanShape"] = v.zid ? src_zan_fu : src_zan_em
                    v["self"] = v.user_id === user_id
                }
                list_master[index]["comments"] = comments
                list_master[index]["comm"] = comments.length
                wx.hideLoading()
                that.setData({list_master})
            }
        });
    },

    //--留言点赞--
    updateZan: function(e){
        var that = this
        var currData = e.currentTarget.dataset
        const idx = currData["idx"]
        const midx = currData["midx"]
        const comm_id = currData["cid"]
        var list_master = this.data.list_master
        var stars = list_master[idx]["comments"][midx]["stars"]
        var zid = list_master[idx]["comments"][midx]["zid"]
        const url = zid ? urls.cancelZan : urls.updateZan
        list_master[idx]["comments"][midx]["zanShape"] = zid ? src_zan_em : src_zan_fu
        list_master[idx]["comments"][midx]["stars"] = zid ? stars -1 : stars +1
        list_master[idx]["comments"][midx]["zid"] = zid ? '' : 1
        that.setData({list_master})
        var openid = App.globalData.openid
        var user_id = openid
        wx.request({
            url: url,
            method: 'POST',
            data: {user_id, comm_id},
            success: function (res) {
                console.log(res)
            }
        });
    },

    showOther: function(){
        var show_other = !this.data.show_other
        this.setData({
            show_other
        })
    },

    reload: function(e){
        var currData = e.currentTarget.dataset
        var file_id = currData.fid
        console.log(file_id)

        var _url = '../detail/detail?file_id=' + file_id
        wx.redirectTo({
            url: _url
        })
    },
    onShareAppMessage() {
        return {
            title: '阴阳师·式神台词语音',
            path: '/page/skami/skami',
        }
    }

})