const util = require('../../utils/util.js')
const app = getApp()

const base64 = require('../../utils/base64.js')
var offsetX = 0
// pages/charts/charts.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleArr:['总排行榜','月抓取榜','周抓取榜','富豪榜'],
    rankArr1:[],
    rankArr2: [],
    rankArr3: [],
    rankArr4: [],
    screenH:0,
    screenW:0,
    orders:[[], [], [], []],
    indicateLeft:10,
    animationData: {},
    current:0

  },

  loadData: function (chartstype) {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + "get_ranking",
      data: {
        account: wx.getStorageSync('account'),
        type: chartstype
      },
      success: function (res) {
        wx.stopPullDownRefresh()
        wx.hideLoading()
        if(chartstype === 1){
          that.setData({
            rankArr1: res.data.data
          })
        }else if(chartstype === 2) {
          that.setData({
            rankArr2: res.data.data
          })
        } else if (chartstype === 3) {
          that.setData({
            rankArr3: res.data.data
          })
        } else if (chartstype === 4) {
          that.setData({
            rankArr4: res.data.data
          })
        }
        
      }
    })
  },
  //  scrollview 滚动监听方法
  scrollDidscroll:function(e){
    console.log(e)
    offsetX = e.detail.scrollLeft
  },

  touchend:function(e){
    console.log(e)
    console.log('offsetX = '+ offsetX)
    let tamp = offsetX / app.util.screenW
     tamp = Math.round(tamp)

     this.setData({
       toView:this.data.orders[tamp]
     })
    console.log('tamp = ' + tamp)
  },
  clickCharts:function(e){
  
    console.log(e.currentTarget.dataset.mode)
    let mode = e.currentTarget.dataset.mode
    // 转成json 字符串
    let modeStr = JSON.stringify(mode)
    // base64 encode
    let mode64 = base64.encode(modeStr)
    // url encode
    let modeEncode = encodeURIComponent(mode64)
    console.log(mode64)

    console.log(base64.decode(mode64))
    wx.navigateTo({
      url: '../PlayRoom/CatchList/catch?mode=' + modeEncode,
    })

  },
  transitionend:function(e){
    console.log('transitionend')
  },
  animationend:function(e){
    console.log(e)
  },
  bindchange:function(e){
    console.log(e.detail.current)

    var animation = wx.createAnimation({
      duration: 250,
      timingFunction: 'ease',
    })

    this.animation = animation

    var marginLeft = 0
    let base = ((app.util.screenW - 80 * 4) / 4)
    let current = e.detail.current

    this.loadData(current+1)

    if(e.detail.current === 0){
      marginLeft = 0
    }else {
      marginLeft = base * current + 80 * current
    }
    animation.translateX(marginLeft).step()
    this.setData({
      animationData:this.animation,
      current: current
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载...',
    })
    this.loadData(1)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      this.setData({
        screenH: app.util.screenH-40,
        screenW: app.util.screenW,
        indicateLeft: ((app.util.screenW - 80 * 4) / 4)*0.5
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '正在加载...',
    })
    this.loadData(1)

    
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
    wx.showLoading({
      title: '正在加载...',
    })
    this.loadData(1)
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