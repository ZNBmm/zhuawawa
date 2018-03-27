// pages/mineChild/coinsBill/coinsBill.js
const util = require('../../../utils/util.js');
var page = 1
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userMode: {},
    dataArr: [],
    screenW: 375,
    screenH: 667,
    timeArr:[]
  },
  /// 加载用户信息
  loadUserData: function () {
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
  /// 加载娃娃币账单
  loadCoinsData: function () {
    wx.showNavigationBarLoading()

    wx.showLoading({
      title: '正在加载',
    })

    page = 1
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "get_coins_bills",
      data: {
        account: wx.getStorageSync('account'),
        page: page
      },
      success: function (res) {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        wx.hideLoading()
        console.log(res)
        page++
        let dataArr = res.data.data
        that.setData({
          dataArr: dataArr,
          timeArr: dataArr.map(data => {
            return util.formatTime(new Date(data.time))
          })
        })
      }
    })
  },
  loadMoreCoinsData: function () {
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '正在加载',
    })
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "get_coins_bills",
      data: {
        account: wx.getStorageSync('account'),
        page: page
      },
      success: function (res) {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        wx.hideLoading()
        console.log(res)
        page++
        let dataArr = [...that.data.dataArr,...res.data.data]
        let timeArr = dataArr.map(data => {
          return util.formatTime(new Date(data.time))
        })
        that.setData({
          dataArr: dataArr,
          timeArr:timeArr
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    let title = JSON.parse(options.mode).title
    console.log(title)
    wx.setNavigationBarTitle({
      title: title,
    })

    this.loadCoinsData()
    this.loadUserData()


    wx.getSystemInfo({
      success: function (res) {
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
    this.loadCoinsData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMoreCoinsData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})