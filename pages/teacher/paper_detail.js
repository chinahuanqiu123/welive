// pages/teacher/paper_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      courseinfo:'',
      tab: '1',
      tab1: true,
      choiceinfo:[],
      name2:'',
      name:'',
      i:0,
      paperlist:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;   
    var option=options.course_index
    var historychoice=[];
    var historyanswer=[];
    var history=[];
    var re;
    wx.getStorage({
      key: 'papercourses',
      success: function (res) {
        that.setData({
          courseinfo: res.data[option]
        },function(){
          var re2 = that.data.courseinfo.papers;
          re2.forEach(function (value, index1, arrSelf) {
            
            value.paperrecords.forEach(function (item, index2, arrSelf){
              const choice_answer= item.choice.split(',');
               choice_answer.forEach(function(the_answer,index3,myself){
                 if(index3<myself.length-1){
                   const temphis = the_answer.split(':')[0];
                   const tempanswer = the_answer.split(':')[1];
                   historychoice.push(temphis);
                   historyanswer.push(tempanswer);
                 }
               })       
                console.log(historychoice);
                item['choice_answer']=choice_answer;
                that.setData({
                  papers:re2
                },function(){
                  wx.request({
                    url: 'http://exam.alivefun.cn/paper/record/deal', // 仅为示例，并非真实的接口地址
                    method: 'POST',
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    data:{
                      historychoice:historychoice,
                      paper_id:value.id
                    },
                    success(res) {  
                         re=res.data.choiceinfo;
                         re.forEach(function(value,index){
                           re[index]['user_answer']=historyanswer[index];
                           re[index]['studentname'] =that.data.papers[index1].paperrecords[index2].student.name;
                           re[index]['studentid'] = that.data.papers[index1].paperrecords[index2].student.id;
                           re[index]['paper_name'] = that.data.papers[index1].name
                         })
                      that.setData({
                        choiceinfo:re
                      },function(){
                        that.getpaperlist();
                        that.grouphistory(re);

                      })
                    }
                  })


                })
             //    
             
            })
            

         
          })
        })
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
  grouphistory:function(re){
    var that=this;
    wx.request({
      url: 'http://exam.alivefun.cn/paper/record/group', // 仅为示例，并非真实的接口地址
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        history: re
      },
      success(res) {
            that.setData({
              finalhistory: res.data.grouppaperrecords
            })
      }
    })


  },
  getpaperlist:function(){

    var that = this;
    wx.request({
      url: 'http://exam.alivefun.cn/paper/list', // 仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
            paperlist: res.data.paperlist
        })
      }
    })


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
})