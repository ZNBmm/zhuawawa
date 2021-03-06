
const app = getApp()
var page = 1

// pages/free/free.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomList: [],
    mode:{}
  },

  // 加载房间列表
  loadData: function (classid) {
    let that = this;
    page = 1
    wx.request({
      url: app.globalData.baseUrl + 'get_classroom_data',
      data: {
        account: wx.getStorageSync('account'),
        classid: classid ,
        page: page
      },
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        let dataArr = res.data.data
        page += 1
        that.setData({
          roomList: dataArr,
        })
        console.log(res.data.data)
      }

    })
  },

  loadMoreData: function (classid) {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + 'get_classroom_data',
      data: {
        account: wx.getStorageSync('account'),
        classid: classid,
        page: page
      },
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        page += 1
        var dataArr = [...that.data.roomList, ...res.data.data]
        that.setData({
          roomList: dataArr,

        })
        console.log(res.data.data)
      }

    })
  },

  toPlayRoom: function (event) {
    console.log(event)
    console.log(event.currentTarget.dataset.mode)
    wx.navigateTo({
      url: '../PlayRoom/Room/Room?mode=' + JSON.stringify(event.currentTarget.dataset.mode),
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let mode = JSON.parse(options.mode)
    this.setData({
      mode:mode
    })
    wx.setNavigationBarTitle({
      title: mode.name,
    })
    this.loadData(mode.class_id)

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
    let mode = this.data.mode
    this.loadData(mode.class_id)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let mode = this.data.mode
    this.loadMoreData(mode.class_id)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})