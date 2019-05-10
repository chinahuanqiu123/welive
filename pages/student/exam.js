// pages/student/exam.js
var nowanswer=[];
var pid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     choicelist:[],
     currentchoice:[],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    position:'left',
    choice_record:[],
    userinfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     pid=options.index;
     var userinfo=wx.getStorageSync('userinfo');
     this.setData({
          userinfo:userinfo

     });
    this.getchoice(pid);

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
  handleFruitChange:function(e){
    var that=this;
    let currentlist=that.data.currentchoice;
    let index = e.currentTarget.dataset['index'];
    for(let i=0;i<currentlist.length;i++){
      if(i==index){
        
        nowanswer[index]=e.detail.value;
        continue;
      }
      nowanswer[i]=currentlist[i];

    }
    
    that.setData({
       currentchoice:nowanswer
    });
  },
  submit:function(){
    var that=this;
    var nowanswerindex=[];
    var choice_record=[];
    for (let i = 0; i <that.data.currentchoice.length; i++) {
      if (that.data.currentchoice[i]==that.data.choicelist[i].choice_a){
            
           nowanswerindex[i]=1;
      }
      else if (that.data.currentchoice[i] == that.data.choicelist[i].choice_b) {

        nowanswerindex[i] = 2;
      }
      else if (that.data.currentchoice[i] == that.data.choicelist[i].choice_c) {

        nowanswerindex[i] = 3;
      }
      else if (that.data.currentchoice[i] == that.data.choicelist[i].choice_d) {

        nowanswerindex[i] = 4;
      }
    }
    for (let i = 0; i < that.data.currentchoice.length; i++) {
      let record={};
      record['qid']=that.data.choicelist[i].id;
      record['true_answer'] = that.data.choicelist[i].answer;
      record['user_answer'] = nowanswerindex[i];
      choice_record.push(record);
      that.setData({
        choice_record:choice_record
      })
    }

    wx.request({
      url: 'http://horizon.alivefun.cn/paper/'+pid+'/record', 
      method: 'POST',
      data:{
        choice_record:choice_record,
        userid:that.data.userinfo.id,
        paperid:pid

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



  },
  getchoice: function (pid) {
    var that = this;
    wx.request({
      url: 'http://exam.alivefun.cn/paper/choice/'+pid, // 仅为示例，并非真实的接口地址
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
         that.setData({
           choicelist:res.data.question,
          currentchoice: Array(res.data.question.length).fill('A')
         })
      }
    })


  }
})