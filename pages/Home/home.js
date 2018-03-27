const util = require('../../utils/util.js')
const app = getApp()
var page = 1;

Page({

  /**
   * 页面的初始数据
   */
  data:{
    navArr:[],
    bannerArr:[],
    macArr:[],
  },
// 跳转到娃娃机房间
  toPlayRoom: function (event) {
    console.log(event)
    console.log(event.currentTarget.dataset.mode)
    this.sendAppBarrage()
    wx.navigateTo({
      url: '../PlayRoom/Room/Room?mode='+JSON.stringify(event.currentTarget.dataset.mode),
    })

  },
  jumptoclassfiy:function(e){
    console.log(e.currentTarget.dataset.mode)
    wx.navigateTo({
      url: '../nav/nav?mode=' + JSON.stringify(e.currentTarget.dataset.mode),
    })
  },
  /**
   *  加载最新的数据
   * 
   */
  loadData: function () {
    page = 1
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + "index",
      data: {
        account: wx.getStorageSync('account')
      },
      success: function (res) {
        console.log(res.data.data.navArr)
        wx.stopPullDownRefresh()
        wx.hideLoading()
        that.setData({
          navArr: res.data.data.navArr,
          bannerArr: res.data.data.notice,
        })

      }
    })

    wx.request({
      url: app.globalData.baseUrl + "get_room_list",
      data: {
        account: wx.getStorageSync('account'),
        page: page
      },
      success: function (res) {
        console.log(res.data.data)
        page+=1
        wx.stopPullDownRefresh()
        wx.hideLoading()
        that.setData({
          macArr: res.data.data
        })
      }
    })
  },

  loadMoreRoom:function () {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + "get_room_list",
      data: {
        account: wx.getStorageSync('account'),
        page: page
      },
      success: function (res) {
        page += 1
        wx.stopPullDownRefresh()
        wx.hideLoading()
        var dataArr = [...that.data.macArr,...res.data.data]
        console.log(dataArr)
        that.setData({
          macArr: dataArr
        })
      }
    })
  },

  sendAppBarrage:function(){

    util.emit('appBarrage',{
      userid: wx.getStorageSync('userid'),
      barrage: '抓到了啊啊啊啊发发'
    },function(res){
      console.log('发送抓到了')
    })

  },

  connectSokket:function(){
    var that = this
    that.sendAppBarrage()
    
  },
  loginToServer:function(){
    wx.request({
      url: app.globalData.baseUrl + "login",
      data: {
        account: wx.getStorageSync('account'),
      },
      success:function(res){
        console.log(res.data)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.loadData()
    this.connectSokket()
    this.loginToServer()
    console.log(wx.getStorageSync('account'))
    console.log(app.globalData.systemModel)

    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
        util.emit('login', {
          userid: wx.getStorageSync('userid')
        }, function (res) {

        })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setClipboardData({
      data: 'Xo8MXL43fg',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data)
          }
        })
      }
    })
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
    var that = this
    wx.showLoading({
      title: '正在刷新',
      mask: true,
    })
    that.loadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    wx.showLoading({
      title: '正在刷新',
      mask: true,
    })
    that.loadMoreRoom()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title:'我在用手机在线抓娃娃,太有趣了',
      path:'pages/Home/home',
      imageUrl:'../source/image/shareIcon.png'
    }
  },
  
})