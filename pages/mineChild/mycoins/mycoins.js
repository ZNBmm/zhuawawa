// pages/mineChild/mycoins/mycoins.js


const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userMode:{},
    dataArr:[],
    screenW:375,
    screenH:667
  },

/// 加载用户信息
  loadUserData:function(){
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "get_user_info",
      data: {
        account: wx.getStorageSync('account'),
      },
      success: function (res) {
        console.log(res)
        that.setData({
          userMode: res.data.data
        })
      }
    })
  },
/// 加载金币信息
  loadCoinsData:function(){
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "get_shop_data",
      data: {
        account: wx.getStorageSync('account'),
        shopid:3
      },
      success: function (res) {
        console.log(res)
        that.setData({
          dataArr: res.data.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    wx.setNavigationBarTitle({
      title: '充值娃娃币',
    })

    this.loadCoinsData()
    this.loadUserData()
    

    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          screenW: res.windowWidth,
          screenH: res.windowHeight
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