// pages/booking/booking.js
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:0,
    sum:0,
    userInfo: {},
    avatarUrl: './user-unlogin.png',
    booked:0,
    _id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              },()=>{this.loadMonthData();this.loadDateData();})
            }
          })
        }
      }
    });
    
  },
  //判断今天是否已经订餐了
  loadDateData:function(){
    db.collection('record').where({
      userName: _.eq("liangbe"),
      year: _.eq(2018),
      month: _.eq(9),
      date: _.eq(28),

    }).get({
      success: res => {
        console.log(res);
        if (res.data.length>0){
          this.setData({
            booked: 1,
            _id:res.data[0]._id
          })
        }
      },
      fail: err => {

        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
  },
  //获取用户订餐基本信息
  loadMonthData: function(){
    var count=db.collection('record').where({
      userName: _.eq("liangbe"),
      
    }).count({
      success: res => {
        console.log(res);
        this.setData({
          count: res.total,
          sum: res.total * 15 + ".00"
        })
      },
      fail: err => {
       
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
    
  },
  onBooking:function(){
    var _this=this;
    db.collection('record').add({
      data: {
        userName:"liangbe",
        year:2018,
        month:9,
        date:28
      },
      success: function (res) {
        console.log(res)
        _this.setData({
          booked: 1,
          _id: res._id
        }, () => _this.loadMonthData())
      },
      fail: console.error
    })
  },
  onCancelBooking:function(){
    var _this=this;
    db.collection('record').doc(_this.data._id).remove({
      success: function (res) {
        console.log(res);
        _this.setData({
          booked: 0
        }, () => _this.loadMonthData())
      },
      fail: console.error
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

  }
})