const util = require('../../../utils/util.js');

const base64 = require('../../../utils/base64.js');
const app = getApp();

var timeProcess;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode:{},
    userMode:{},
    playUrl:'',
    coverShow:1,
    recordArr:[],
    rankArr:[],
    screenH:0,
    livePlayH:0,
    livePlayW:0,
    recordTime:[],
    playPreparePanShow:true,
    playPanShow:false,
    playUserInfo:{},
    result:{},
    loadingPath:'',
    chatList:['夏天抓到了']
  },
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
  loadRecordData:function(mac_addr){
    let that = this
    console.log(mac_addr)
    wx.request({
      url: app.globalData.baseUrl + "get_success_records_in_room",
      data:{
        account: wx.getStorageSync('account'),
        mac_addr: mac_addr,
      },
      success:function(res){
        let records = res.data.data
        that.setData({
          recordArr: records,
          recordTime: records.map(record => {
            let time = Number (record.time) 
            console.log(time)
            return util.getTime(time)
          })
        })
        console.log(res.data.data)
        console.log(that.data.recordTime)
      }
    })

  },

  // 充值
  toTopUp:function(){
    wx.navigateTo({
      url: '../../mineChild/mycoins/mycoins',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.emit('login',{
      userid: wx.getStorageSync('userid')
    },function(res){

    })
    let loadingPath = wx.getStorageSync('loadingPath')
    console.log(loadingPath +'loadingpath')
    console.log(options.mode)
    this.setData({
      mode:JSON.parse(options.mode),
      loadingPath: loadingPath
      
    })
    let model = JSON.parse(options.mode)
    this.loadRecordData(model.mac_addr)

    this.dealSocket()
    this.loadUserData()
    this.setData({
      livePlayH: app.util.scale * 950,
      screenH: app.util.screenH + 49,
      livePlayW: app.util.scale * 714
    })
  
  },

/// 处理 socket 事件
  dealSocket:function(){

    var that = this
    wx.onSocketMessage(function (res) {
      console.log('娃娃机房间监听')
      console.log(res)
      var data = JSON.parse(res.data)
      console.log(data)

      if (data.event === 'resultCallback') { // resultCallback 
        console.log('resultCallback')
        that.setData({
          playPreparePanShow: true,
          playPanShow: false,
          result:data.data

        })  

      } else if (data.event === 'start_game') { // 游戏开始

      } else if (data.event === 'other_success') { // 其他人抓取成功

      } else if (data.event === 'get_player_info') { // 获取当前玩家信息
          that.setData({
            playUserInfo: data.data
          })
          console.log(data.data)
      } else if (data.event === 'update_room_info') { // 更新房间信息

      } else if (data.event === 'roomBarrage') { // 房间弹幕

      } else if (data.event === 'appBarrage') { // 全局弹幕

      } else if (data.event === 'mac_error') { // 机器故障

      } 

    })
  },
  statechange(e) {
    console.log('live-player code:', e.detail)
    if (e.detail.code === 2003) {
      console.log('拉流成功,开始播放')
      this.setData({
        coverShow: 0
      })
    }
  },

  jumpToUserCatch(e){
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
      url: '../CatchList/catch?mode=' + modeEncode,
    })
  },
  sendAppBarrage: function () {
    var msg = JSON.stringify({
      event: 'appBarrage',
      data: {
        userid: wx.getStorageSync('userid'),
        barrage: '抓到了啊啊啊啊发发'
      },
    })
    wx.sendSocketMessage({
      data: msg,
      success: function (res) {
        console.log(res)
      }
    })
  },
  connectSokket: function () {
    wx.connectSocket({
      url: app.globalData.socketUrl,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res + 'success');
      },
      fail: function (res) {
        console.log(res + 'fail');
      },
      complete: function (res) {
        console.log(res + 'complete');
      },
    })
    var that = this

    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      var msg = JSON.stringify({
        event: "login",
        data: {
          userid: wx.getStorageSync('userid')
        }
      })
      wx.sendSocketMessage({
        data: msg,
        success: function (res) {
          console.log(res)
          
        }
      })
    })

    wx.onSocketMessage(function (res) {
      console.log(res)
      var data = JSON.parse(res.data)
    })
  },
  // 开始游戏
  gameBegin(){
    
    var that = this
    wx.request({
  
      url: app.globalData.baseUrl + 'get_user_info',
      data:{
        account: wx.getStorageSync('account')
      },
      success:function(res){
        console.log('----------------')
        console.log(res.data.data)
        if (parseFloat(res.data.data.coins) >= parseFloat(that.data.mode.price)) {
          console.log('可以开局')
          
          util.emit('start_game',{
            userid: wx.getStorageSync('userid'),
            mac_addr: that.data.mode.mac_addr
          },function(res){
            that.setData({
              playPreparePanShow: false,
              playPanShow: true
            })
          })
 
        }else {
          console.log('金币不够了')

        }
      },
      fail:function(res){
        console.log(res)
      }
    })

    
  },

  moveAction:function(event){
    var that = this
    var i = 0
    timeProcess = setInterval(myInterval, 70)
      function myInterval () {
        console.log(i++)
        util.emit(event, {
          userid: wx.getStorageSync('userid'),
          mac_addr: that.data.mode.mac_addr,
          side: 0
        }, function (res) {
          console.log(res)
        })
      }
      console.log(timeProcess.constructor + 'timeProcess1')
  },
  
  moveStop:function(){
    console.log(typeof (timeProcess) + 'timeProcess2')
    clearInterval(timeProcess )
    console.log('moveStop')
    var that = this
    util.emit('left_stop', {
      userid: wx.getStorageSync('userid'),
      mac_addr: that.data.mode.mac_addr,
      side: 0
    }, function (res) {
      console.log(res)
    })
  },

  lefttouchstart:function(){
    var that = this
    that.moveAction('move_left')
    
  },
  lefttouchend:function(){
    var that = this
    that.moveStop()
  },
  toptouchstart: function () {
    var that = this
    that.moveAction('move_back')

  },
  toptouchend: function () {
    var that = this
    that.moveStop()
  },
  righttouchstart: function () {
    var that = this
    that.moveAction('move_right')

  },
  righttouchend: function () {
    var that = this
    that.moveStop()
  },

  downtouchstart: function () {
    var that = this
    that.moveAction('move_front')

  },
  downtouchend: function () {
    var that = this
    that.moveStop()
  },

  catchtouchstart:function(){
    var that = this
    that.moveAction('move_down')
  },
  catchtouchend: function () {
    var that = this
    that.moveStop()
  },
 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    this.setData({
      playUrl: this.data.mode.rd_url1
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
    wx.stopPullDownRefresh()
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