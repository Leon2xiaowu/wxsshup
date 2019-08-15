//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cloudStyle:{}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    this.connectStyleService()
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 通过ws连接动态调整UI服务
   *
   */
  connectStyleService() {
    wx.connectSocket({
      // 192.168.123.75
      url: 'ws://localhost:3000/listener',
      // header:{
      //   'content-type': 'application/json'
      // },
      // protocols: ['protocol1'],
      method:"GET"
    })
    wx.onSocketMessage(this.updateStyle.bind(this))
  },

  updateStyle(style) {
    if (!style) return

    console.log('收到了样式更新的消息',style)

    try {
      const s = JSON.parse((style.data || {}))

      this.setData({
        cloudStyle:s
      })

    } catch (error) {
      console.error('接收到了错误的数据结构',error);
    }
  }
})
