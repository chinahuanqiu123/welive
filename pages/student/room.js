// pages/student/room.js
var socketOpen=true;
var frameBuffer_Data, session, SocketTask,string_base64;
var recorder = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext() 
var url = 'ws://socket.alivefun.cn';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomid:0,
    studentinfo:'',
    num:0,
    messageList:[],
    tab: '3',
    tab1: false,
    tab2:false,
    tab3:true,
    msg:'',
    members:[],
    scrollTop:0,
    targetTime: 0,
    myFormat:['天','时','分','秒'],
    questioninfo:'',
    currentchoice:'null',
    checked:true,
    question_visable:false,
    on_live:false,
    recodePath:'',
    isRecode:false,
    voice_ing_start_date:0,
    now_record:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    
    this.setData({
      roomid:options.courseid,
      targetTime: new Date(options.livetime).getTime()
    },function(){
       wx.getStorage({
         key: 'userinfo',
         success: function(res) {
           that.setData({
           studentinfo:res.data,
           },function(){
             this.webSocket()
           })
         },
       })


    })

    wx.setKeepScreenOn({
      keepScreenOn: true
    })
   
  },

  handletabChange({ detail }) {
    var index = detail.key
    console.log(index)
    this.setData({
      tab: detail.key
    });
    if (index == 1) {
      this.setData({
        tab1: true,
        tab2: false,
        tab3:false
      })
    } else if (index == 2) {
      this.setData({
        tab1: false,
        tab2: true,
        tab3: false
      })
    }
    else if (index == 3) {
      this.setData({
        tab1: false,
        tab2: false,
        tab3: true
      })
    }
  },
  onUnload: function () {
    var that=this;
    var socketMsgQueue = JSON.stringify({
      roomid: that.data.roomid,
      type: 3
    })
    wx.sendSocketMessage({
      data: socketMsgQueue,
      success:function(){
        SocketTask.close(function (close) {
          console.log('关闭 WebSocket 连接。', close)
        })

      }
    })
     
   
  },
   msgInput:function(e){

    this.setData({
       msg:e.detail.value

    })

},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onShow: function () {

   
     

  },
  onHide: function () {

    var that = this;
    var socketMsgQueue = JSON.stringify({
      roomid: that.data.roomid,
      type: 3
    })
    wx.sendSocketMessage({
      data: socketMsgQueue,
      success: function () {
        SocketTask.close(function (close) {
          console.log('关闭 WebSocket 连接。', close)
        })

      }
    })
    
  },
  // 页面加载完成
  onReady: function () {
    this.on_recorder();
  },
  livestatechange:function(e){
    var that=this;
      if(e.detail.code==2003){
        this.setData({
           on_live:true
        })

      }
  },
  sendMsg:function(){
         var that=this;
    var socketMsgQueue = JSON.stringify({
      roomid: that.data.roomid,
      username: that.data.studentinfo.name,
      type: 1,
      message:that.data.msg,
      role:'student',
      time: new Date().toLocaleTimeString()

    })
    wx.sendSocketMessage({
      data: socketMsgQueue
    })

  },
  webSocket: function () {
    // 创建Socket
    
    SocketTask = wx.connectSocket({
      url: url,
      data: 'data',
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        console.log('WebSocket连接创建', res)
        
      },
      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
        })
        console.log(err)
      },
    })
    var obj = [];
    var that = this;
    SocketTask.onOpen(res => {
      socketOpen = true;
      console.log('监听 WebSocket 连接打开事件。', res)
      var socketMsgQueue = JSON.stringify({
        roomid: that.data.roomid,
        userid: that.data.studentinfo.id,
        type: 0

      })
      wx.sendSocketMessage({
        data: socketMsgQueue
      })

    })
    SocketTask.onClose(onClose => {
      console.log('监听 WebSocket 连接关闭事件。', onClose)
      socketOpen = false;
     
    })
    SocketTask.onError(onError => {
      console.log('监听 WebSocket 错误。错误信息', onError)
      socketOpen = false
    })
    SocketTask.onMessage(onMessage => {
      
      console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', JSON.parse(onMessage.data))
      var onMessage_data = JSON.parse(onMessage.data)
      if (onMessage_data.type == 0) {
        that.setData({
          num: onMessage_data.num
        })
       
         that.getNumber();
      }
      else if(onMessage_data.type==1){
         
        obj.push(onMessage_data);
        that.setData({
          messageList:obj
        },function(){
          this.setData({
            scrollTop: that.data.scrollTop + 50
          })

        })
      }
      else if(onMessage_data.type==4){
        this.setData({
          questioninfo:onMessage_data.questioninfo,
          question_visable:true
        })

      }
      else if (onMessage_data.type == 5) {
        this.setData({
          question_visable:false
        })
        wx.request({
          url: 'http://exam.alivefun.cn/live/question/record/save',
          method:'POST',
          data: {
            student_id: that.data.studentinfo.id,
            answer: that.data.currentchoice,
            question_choice_id: that.data.questioninfo.id
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            wx.showToast({
              title: '交卷成功',
              icon: 'success',
              duration: 2000
            })
          }

        })

      }
      else if(onMessage_data.type==6){
     
            that.download_record(onMessage_data,obj);


      }
    })


  },
  handleFruitChange({ detail = {} }) {
    this.setData({
      currentchoice: detail.value
    });
  },
  getNumber:function(){
    var that=this;
    wx.request({
      url: 'http://exam.alivefun.cn/live/'+that.data.roomid+'/members', // 仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        that.setData({
          members: res.data.members
        })


      }
    })

  },
  startRecode: function () {

    this.setData({
      voice_ing_start_date: new Date().getTime(), //记录开始点击的时间
    })
    const options = {
      duration: 10000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 24000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 12, //指定帧大小，单位 KB
    }
    recorder.start(options) //开始录音
  

   
    
  },
  on_recorder: function () {
    var that = this;
    recorder.onStart((res) => {
      console.log('开始录音');
    })
    recorder.onStop((res) => {
      console.log('停止录音,临时路径', res.tempFilePath);
      // _tempFilePath = res.tempFilePath;
      var x = new Date().getTime() - this.data.voice_ing_start_date
   
    })
    recorder.onFrameRecorded((res) => {
      var x = new Date().getTime() - this.data.voice_ing_start_date
      if (x > 1000) {
        console.log('onFrameRecorded  res.frameBuffer', res.frameBuffer);
        string_base64 = wx.arrayBufferToBase64(res.frameBuffer)

       //  console.log('string_base64--', wx.arrayBufferToBase64(string_base64))
        if (res.isLastFrame) {
          
            var data2 = {
              audioType: 3,
              username:that.data.studentinfo.name,
              type: 6,
              roomid:that.data.roomid,
              signType: 'BASE64',
              body: string_base64,
              time: new Date().toLocaleTimeString()
            }
          console.log('录音上传的data:', data2)
            data2=JSON.stringify(data2)
          wx.sendSocketMessage({
            data: data2,
            success: function (res) {
              console.log(res);

            }
          })
            
          
          // 进行下一步操作
        } else {
          
            var data1 = {
              audioType: 2,
              type: 6,
              roomid: that.data.roomid,
              signType: 'BASE64',
              body: string_base64
            }
            console.log('录音上传的data:', data1)
          data1 = JSON.stringify(data1)
          wx.sendSocketMessage({
            data: data1,
            success: function () {
              console.log('cussess');

            }
          })
        
        }
      }
    })
  },
  endRecode: function () {//结束录音 
    var s = this;
    recorder.stop();
   
  },
  download_record: function (messge,tempmes) {
    var _this = this;
    const downloadTask = wx.downloadFile({
      url: 'http://exam.alivefun.cn/download/record', //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        console.log(res)
        if (res.statusCode === 200) {
          _this.setData({
             now_record: res.tempFilePath //将下载的图片临时路径赋值给img_l,用于预览图片
          },function(){
            tempmes.push({
               username:messge.username,
               time:messge.time,
              type: messge.type,
              src: res.tempFilePath

            })
            _this.setData({
              messageList:tempmes
            }, function () {
              this.setData({
                scrollTop: _this.data.scrollTop + 50
              })

            })
           
          })
        }
      }
    })
  }

 
})