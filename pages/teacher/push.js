// pages/student/room.js
var socketOpen = true;
var frameBuffer_Data, session, SocketTask;
var url = 'ws://socket.alivefun.cn';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomid: 0,
    teacherinfo: '',
    num: 0,
    messageList: [],
    tab: '3',
    tab1: false,
    tab2: false,
    tab3: true,
    msg: '',
    members: [],
    scrollTop: 0,
    targetTime: 0,
    myFormat: ['天', '时', '分', '秒'],
    send_visible:false,
    questions:[],
    resourcequestion:[],
    livecourses:[],
    live_course_index:'',
    latestudents:[],
    allstudents:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    this.setData({
      roomid: options.courseid,
      live_course_index: options.index,
     
    }, function () {
      wx.getStorage({
        key: 'userinfo',
        success: function (res) {
          that.setData({
            teacherinfo: res.data,
          }, function () {
            that.webSocket()
          })
        },
      })
      wx.getStorage({
        key: 'livecourses',
        success: function (res) {
          that.setData({
             livecourses: res.data
          },function(){
           that.setData({
             targetTime: new Date(that.data.livecourses[options.index].liveroom.live_time).getTime()

           })

          })
        },
      })


    })

  },
  handleOpen1() {
    this.setData({
      send_visible: true
    });
  },

  handleClose1() {
    this.setData({
      send_visible: false
    });
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
        tab3: false
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
  msgInput: function (e) {

    this.setData({
      msg: e.detail.value

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
    SocketTask.close(function (close) {
      console.log('关闭 WebSocket 连接。', close)
    })
  },
  // 页面加载完成
  onReady: function () {

  },
  sendMsg: function () {
    var that = this;
    var socketMsgQueue = JSON.stringify({
      roomid: that.data.roomid,
      username: that.data.teacherinfo.name,
      type: 1,
      message: that.data.msg,
      role: 'teacher',
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
        userid: 111000+that.data.teacherinfo.no,
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
      if (onMessage_data.type == 1) {

        obj.push(onMessage_data);
        that.setData({
          messageList: obj
        }, function () {
          this.setData({
            scrollTop: that.data.scrollTop + 50
          })

        })
      }
    })


  },
  getNumber: function () {
    var that = this;
    wx.request({
      url: 'http://exam.alivefun.cn/live/' + that.data.roomid + '/members', // 仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        that.setData({
          members: res.data.members
        },function(){
          let allstus=[];
          let latestus= [];
          let  allstudent= that.data.livecourses[that.data.live_course_index].sections;
          allstudent.forEach(function (section, index) {
            section.students.forEach(function (student, index) {
              allstus.push(student);
            })    
          })
          for (let i = 0; i < allstus.length; i++) {
            for (let j = 0; j <res.data.members.length; j++) {
              if (res.data.members[j].id != allstus[i].id) {
                latestus.push(allstus[i])
              }
            }
          }  
          that.setData({
            allstudents:allstus,
            latestudents:latestus
          })
        })
      }
    })


  },
  handlequeston:function(){
    
     var that=this;
     that.setData({
     send_visible:true

     },function(){

        that.getChoicepaper();

     })

  },
  handlebackquestion:function(){
    var that = this;
    var socketMsgQueue = JSON.stringify({
      roomid: that.data.roomid,
      type: 5
    })
    wx.sendSocketMessage({
      data: socketMsgQueue,
      success: function () {
        
      }
    })


  },
  getChoicepaper:function(){
    var con=[];
    var that = this;
    wx.request({
      url: 'http://exam.alivefun.cn/live/' + that.data.roomid + '/questions', // 仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var result = res.data.live_questions;
        var ondate=[];
        for (var i=0;i<result.length;i++){
          ondate.push({
                name:result[i]['name'],
                 color:'#19be6b'
          });
        }
   
        that.setData({
          questions:ondate,
          resourcequestion:result
        })
      }
    })
  },
  handlechoicequestClick({ detail }){
    const index = detail.index;
    var that = this;
    var socketMsgQueue = JSON.stringify({
      roomid: that.data.roomid,
      type: 4,
      questioninfo: that.data.resourcequestion[index]
    })
    wx.sendSocketMessage({
      data:socketMsgQueue,
      success:function(){
        that.setData({
          send_visible: false
        });

      }
    })


  }



})