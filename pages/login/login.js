// pages/login/login.js
const app = getApp()
const requestAnimationFrame = require('../../libs/requestAnimationFrame.js')
const config = Object.assign({

}, app.config)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginFlag: false,
    loadFinish: false,
    loadingText: '绑定/登陆',
    gradientStop: 1,
    timer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
      wx.switchTab({
        url: '../index/index',
      })
    }
    let timer = requestAnimationFrame(that.autoLoad)
    that.setData({
      timer: timer
    })
  },
  autoLoad: function () {
    if (this.data.loadFinish === false) {
      let timer = requestAnimationFrame(this.autoLoad)
      let gradientStop = this.data.gradientStop
      if (gradientStop < 95) {
        gradientStop += 0.5
      } else {
        gradientStop = 0
      }
      this.setData({
        gradientStop: gradientStop,
        timer: timer
      })
    } else {
      clearTimeout(this.data.timer);
      this.setData({
        loadFinish: true
      })
    }
  },
  accountUidInputHandle:function(e){
    let val = e.detail.value
    this.setData({
      accountUid: val
    })
  },
  accountPhoneInputHandle: function (e) {
    let val = e.detail.value
    this.setData({
      accountPhone: val
    })
  },
  onGotUserInfo: function (res) {
    let that = this
    let detail = res.detail
    if (detail.userInfo) {
      //授权成功
      that.setData({
        loadingText: 'waiting',
      })
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              url: app.config.serverUrl + '/rest/customsLogin',
              data: {
                code: res.code,
                userInfo: detail.userInfo,
                uid: that.data.accountUid,
                phone: that.data.accountPhone
              },
              method: 'POST',
              success: function (res) {
                if (res.data && res.data == 1) {
                  // 登陆成功，存入缓存
                  app.globalData.userInfo = {
                    saveDate: new Date().getTime()
                  }
                  Object.assign(app.globalData.userInfo, detail.userInfo)
                  app.globalData.userInfo.phone = that.data.accountPhone
                  app.globalData.userInfo.uid = that.data.accountUid
                  wx.setStorage({
                    key: 'userInfo',
                    data: app.globalData.userInfo
                  })
                  that.loginSuccess()
                } else{
                  console.log('server response error:', res.data)
                  that.loginFail()
                }
              },
              fail: function (err) {
                console.log('server error:', err)
                that.loginFail()
              }
            })
          }
        }
      })
    } else {
      //授权失败
      wx.showModal({
        title: '提示',
        content: '你需要授权获取用户信息才能正常使用，请重新授权',
        showCancel: false
      })
    }

    console.log(res)
  },

  loginFail: function () {
    this.setData({
      loadingText: '登陆/绑定'
    })
    wx.showToast({
      title: '登录失败，请重试',
      icon: 'none'
    })
  },
  loginSuccess: function () {
    clearTimeout(this.data.timer)
    this.setData({
      loadingText: '开始使用'
    })
    setTimeout(function () {
      wx.switchTab({
        url: '../index/index',
      })
    }, 1000)
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