//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    role: true,
    no:0,
    college_list:[],
    password:'',
    college_id:1,
    canIUse: wx.canIUse('button.open-type.getUserInfo')

    
  },
  bindpassInput(e) {
    this.setData({
      password: e.detail.value
    })
  },
  bindnoInput(e) {
    this.setData({
      no: e.detail.value
    })
  },
  onroleChange(event) {
    var that=this;
    const detail = event.detail;
    this.setData({
      role: !that.data.role
    })

  },
  bindcollegeChange(e) {
    var that=this;
    const val = e.detail.value
    this.setData({
     college_id:that.data.college_list[val]['id']
    })
  },
  handleloginClick:function(){
    var that=this;
    wx.request({
      url: 'https://exam.alivefun.cn/live/getmysection', // 仅为示例，并非真实的接口地址
      data: {
        sid: that.data.no,
        password:that.data.password,
        role:that.data.role?'student':'teacher',
        collegeid:that.data.college_id
      },
      method:'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.student_info ==null){
          wx.showToast({
            title: '登录信息有误!',
            icon: 'loading',
            duration: 2000
          })
          return 0;
        }
        wx.setStorageSync('userinfo',res.data.student_info)
        wx.setStorageSync('role', that.data.role?'student':'teacher')
              if (that.data.role) {

                wx.navigateTo({
                  url: '/pages/student/index',
                })
              }
              else {
                wx.navigateTo({
                  url: '/pages/teacher/index',
                })
              }
           
        
       
      }
    })

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var userinfo = wx.getStorageSync('userinfo');
    var role = wx.getStorageSync('role');
    if (userinfo&&role=='student') {
      wx.navigateTo({
        url: '/pages/student/index',
      })
      return 0;
    }
    else if (userinfo &&role=='teacher') {
      wx.navigateTo({
        url: '/pages/teacher/index',
      })
      return 0;
    }
  
  },
  onReady:function(){
    var that = this;
    wx.request({
      url: 'https://exam.alivefun.cn/college/show/', // 仅为示例，并非真实的接口地址
      type: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          college_list: res.data.college_list
        })
      }
    })


  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  
  
})
