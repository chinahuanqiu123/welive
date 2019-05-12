// pages/teacher/ppt.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      pptinfo:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getpptinfo();
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
 getpptinfo:function(){
   var that=this;
   wx.request({
     url: 'http://exam.alivefun.cn/live/7/pptinfo', // 仅为示例，并非真实的接口地址
     method: 'GET',
     header: {
       'content-type': 'application/json' // 默认值
     },
     success(res) {
       var result = res.data.pptinfo;
       that.setData({
         pptinfo: result
       })
     }
   })


 }

})