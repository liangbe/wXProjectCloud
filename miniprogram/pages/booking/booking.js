// pages/booking/booking.js
const db = wx.cloud.database();
const _ = db.command;
const today = new Date();
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
    _id:'',
    userName:"",
    role:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    // 获取用户信息
    

   
    wx.getSetting({
      success: res => {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              _this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              }, () => { 

                _this.getUser(function(){
                  _this.loadDateData(); _this.loadMonthData();
                })
                
              })
            },
            fail: (res) =>{
              console.log(res);
            }
          })
        }
        
        
      }
    });

    

  

  },
  //判断今天是否已经订餐了
  loadDateData:function(){
    db.collection('record').where({
      userName: _.eq(this.data.userName),
      year: _.eq(today.getFullYear()),
      month: _.eq(today.getMonth()+1),
      date: _.eq(today.getDate()),

    }).get({
      success: res => {
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
    var _this=this;
   db.collection('record').where({
     userName: _.eq(this.data.userName),
     year: _.eq(today.getFullYear()),
      month: _.eq(today.getMonth()+1), 
    }).count({
      success: res => {
        _this.setData({
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
        userName: this.data.userName,
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        date: today.getDate()
      },
      success: function (res) {
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

  },
  getUser:function(callback){
    var _this=this;
    db.collection('user').where({
      weiXinName: _.eq(_this.data.userInfo.nickName)
    })
    .get({
      success: function (res) {
        _this.setData({
          userName: res.data[0].userName,
          role: res.data[0].role
        },()=>{callback()})
      }
    })
  },
  openBooKingList:function(){
    wx.navigateTo({
      url: '../bookingList/bookingList?userName='+this.data.userName,
    })
  }
})