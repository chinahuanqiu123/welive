// pages/teacher/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     teacherinfo:'',
     firstname:'',
     papercourses:[],
     coursenum:0,
     papercoursenum:0,
     livecoursenum:0,
    livecourses:[],
     
     
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        that.setData({
          teacherinfo: res.data
        }, function () {
          that.setData({
            firstname: 'x'
          })
          that.getpaper_courses()
          that.getlive_courses()
        });

      },
    })

    



  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
  getpaper_courses:function(){
     var that=this;
    wx.request({
      url: 'https://exam.alivefun.cn/teacher/' + that.data.teacherinfo.id + '/mypapercourses',
      method:'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          papercourses: res.data.has_paper_courses
        },function(){

          wx.setStorage({
            key: 'papercourses',
            data: res.data.has_paper_courses,
          })

        })
      }
    })

  },
  getlive_courses:function(){
    var that = this;
    wx.request({
      url: 'https://exam.alivefun.cn//teacher/'+that.data.teacherinfo.id+'/mylivecourses' ,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          livecourses: res.data.has_live_courses
        },function(){
           wx.setStorage({
             key: 'livecourses',
             data:res.data.has_live_courses,
           })

        })
      }
    })

  }
})