// pages/PlayRoom/CatchList/catch.js
const util = require('../../../utils/util.js');
const base64 = require('../../../utils/base64.js');

const app = getApp()
var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode:{},
    roomList:[],
    timeArr:[]
  },
  // 预览用户头像
  previewUserHeadImage:function(res){
    let heading = this.data.mode.headimg
    wx.previewImage({
      urls: [heading],
    })
  },

  // 加载用户抓取列表
  loadData:function(mode) {
    let that = this;
    page = 1
    wx.request({
      url: app.globalData.baseUrl + 'get_other_play_records',
      data:{
        account: wx.getStorageSync('account'),
        userid: mode.user_id,
        page: page
      },
      success:function(res){
        wx.hideLoading()
        wx.stopPullDownRefresh()
        let dataArr = res.data.data
        page+=1
        that.setData({
          roomList: dataArr,
          timeArr: dataArr.map(data=>{
            return util.formatTime(new Date(data.time))
          })
        })
        console.log(res.data.data)
      }

    })
  }, 

  loadMoreData:function(mode){
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + 'get_other_play_records',
      data: {
        account: wx.getStorageSync('account'),
        userid: mode.user_id,
        page: page
      },
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        page += 1
        var dataArr = [...that.data.roomList,...res.data.data]
        let timeArr = dataArr.map(data=>{
          return util.formatTime(new Date(data.time))
        })
        that.setData({
          roomList: dataArr,
          timeArr:timeArr

        })
        console.log(res.data.data)
      }

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('---------')
    console.log(options)
    let modeEncode = options.mode
    let modeDecode = decodeURIComponent(modeEncode)
    console.log(modeDecode)
    let mode = JSON.parse(base64.decode(modeDecode))
    this.setData({
      mode: mode
    })
    this.loadData(mode)

    
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
    wx.showLoading({
      title: '正在刷新',
      mask: true,
    })
    this.loadData(this.data.mode)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMoreData(this.data.mode)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})