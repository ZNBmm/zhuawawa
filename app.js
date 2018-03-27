//app.js

App({
  
  connectSocket: function () {
    console.log(this.globalData.socketUrl)
      this.globalData.socket = wx.connectSocket({
        url: this.globalData.socketUrl,
    })
      
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')

    })
    wx.onSocketMessage(function (res) {
      console.log('全局监听')
      console.log(res)
      var data = JSON.parse(res.data)
    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
      
    })

    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })
  },
  
  onLaunch: function () {
    // 展示本地存储能力

    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.setStorageSync('account', 'wx_o5_aPweURZvIkaaUjUVbpCfDD5dk') //wx_o5_aPweURZvIkaaUjUVbpCfDD5dk
    wx.setStorageSync('userid', '797256')

    this.connectSocket()
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else {
          wx.authorize({
            scope: 'scope.userInfo',
            
          })
        }
      }
    })

    
    try {
      var res = wx.getSystemInfoSync()
      console.log(res)
      this.util.scale = (res.screenWidth / 375.0)*0.5,
      this.util.screenH = res.windowHeight,
      this.util.screenW = res.windowWidth
    } catch(res){

    }
  
    wx.downloadFile({
      url: 'http://upload-images.jianshu.io/upload_images/2961660-4d17b76e687e1921.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          console.log(res)
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success:function(res){
              console.log(res.savedFilePath)
              wx.setStorage({
                key: 'loadingPath',
                data: res.savedFilePath,
              })
            }
          })
        }
      }
    })


  },
  onShow: function () {
    console.log('app onShow')
  },
  onHide: function () {
    wx.closeSocket()
  },

  userInfoReadyCallback(data){
    console.log("res");
    
    console.log(data)
  },
  util: {
    scale: 0.0,
    screenH: 375,
    screenW:375
  },
  globalData: {
    socket:null,
    userInfo: null,
    baseUrl:"http://118.31.164.217:9001/",
    socketUrl:"wss://118.31.164.217:10001",
  },
  globalValue:{
    kNavColor:'#4C7EF7'
  },
  
})



// http://47.97.32.55:9001/
// http://118.31.164.217:9001/

