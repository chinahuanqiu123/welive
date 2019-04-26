// pages/student/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentinfo:'',
    livecourses:[],
    rec_list:[],
    rec_rate:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
       that.setData({
         studentinfo:res.data
       },function(){
         that.getLiveinfo();
        that.getreclive();
       });
        
      },
    })

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
  getLiveinfo:function(){
     var that=this;
    wx.request({
      url: 'http://exam.alivefun.cn/live/', // 仅为示例，并非真实的接口地址
      data: {
        class_id:that.data.studentinfo.section_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
          
         that.setData({
          livecourses:res.data.livecourses
         })


      }
    })


  },
  getreclive:function(){
    var that = this;
    wx.request({
      url: 'http://exam.alivefun.cn/live/recommend', // 仅为示例，并非真实的接口地址
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          rec_list: res.data.livecourses,
          rec_rate: res.data.rec_rates
        })
      }
    })


  }
})