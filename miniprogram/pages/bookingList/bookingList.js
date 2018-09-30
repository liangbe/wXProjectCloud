// pages/bookingList/bookingList.js
const db = wx.cloud.database();
const _ = db.command;
const today = new Date();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arry: [],
    userName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userName: options.userName
    },()=>this.loadData())
  },
  loadData:function(){
    var _this=this;
    db.collection('record').where({
      userName: _.eq(this.data.userName),
      year: _.eq(today.getFullYear()),
      month: _.eq(today.getMonth() + 1)

    }).get({
      success: res => {
        _this.setData({
          arry:res.data
        })
      },
      fail: err => {

        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
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