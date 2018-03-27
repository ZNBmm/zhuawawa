
const util = require('../../utils/util.js')
const itemArr = require('../source/mineItem.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode:{},
    itemArr:['我的娃娃币']
  },

// 加载用户信息
  loadUserData:function(){
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "get_user_info",
      data: {
        account: wx.getStorageSync('account'),
      },
      success:function(res){
        console.log(res)
        wx.stopPullDownRefresh()
        wx.hideLoading()
        that.setData({
          mode:res.data.data
        })
      }
    })
  },

 // 加载本地json
 loadItemData:function(){
    this.setData({
      itemArr: itemArr.itemArr.data
    })
    console.log(itemArr.itemArr.data)
 },
  // row 点击 事件
  rowDidClick:function(res) {
    console.log(res.currentTarget.dataset.rowdata)
    let title = res.currentTarget.dataset.rowdata.title
    let mode = res.currentTarget.dataset.rowdata
    switch (title) {
      case '我的娃娃币': {
          wx.navigateTo({
            url: '../mineChild/mycoins/mycoins?mode='+JSON.stringify(mode),
          })
      }
        break;
      case '娃娃币账单': {
        wx.navigateTo({
          url: '../mineChild/coinsBill/coinsBill?mode=' + JSON.stringify(mode),
        })
      }
        break;
      case '我的积分': {

      }
        break;
      case '我的订单' : {

      }
        break;
      case '我的娃娃': {

      }
        break;
      case '我的邀请码': {

      }
        break;
      case '输入邀请码': {

      }
        break;
      case '游戏记录': {

      }
        break;
      case '消息': {

      }
        break;
      case '客服': {
        wx.navigateTo({
          url: '../mineChild/contact/contach?mode=' + JSON.stringify(mode),
        })
      }
        break;
      case '设置': {

      }
        break;
      case '反馈': {

      }
        break;
      case '地址': {

      }
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载...',
    })
    this.loadUserData()
    this.loadItemData()
    console.log('fasdfasdfasd')

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