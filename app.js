//app.js
const QQMapWX = require('./libs/qqmap-wx-jssdk.min.js')
const config = {
  MaxHistoryLength: 8,
  serverUrl: 'http://fggv6h.natappfree.cc'
}
App({
  onLaunch: function () {

  },
  qqmapsdk: new QQMapWX({
    key: 'FFOBZ-N6NRU-BD5V5-2QEZU-H6PM5-WQF5F'
  }),
  getLocation: function (callback) {
    let that = this
    let qqmapsdk = that.qqmapsdk
    let getCurrentLocation = ()=>{
      //获取当前位置坐标
      wx.getLocation({
        type: 'wgs84',
        // type: 'gcj02',
        success: res => {
          //根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: addressRes => {
              let address = addressRes.result.formatted_addresses.recommend;
              that.globalData.location = {
                longitude: res.longitude,
                latitude: res.latitude,
                address: address
              }
              that.globalData.hasLocation = true
              typeof callback === 'function' && callback(that.globalData.location)
            },
            fail: err => {
              console.log(err)
            }
          })
        },
        fail: err => {
          wx.showModal({
            title: '位置信息不可用',
            content: '请您打开位置信息，再重新进入小程序',
            showCancel: false
          })
          console.log(err)
        }
      })
    }
    //先获取用户当前的设置
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success(res) {
              //用户授权后执行方法
              getCurrentLocation()
            },
            fail(res) {
              //用户拒绝授权后执行
              wx.showModal({
                title: '提示',
                content: '未授权位置信息,可能会造成您无法正常使用,您可在右上角设置中开启授权',
                confirmText: '了解',
                showCancel: false
              })
            }
          })
        }else{
          getCurrentLocation()
        }
      }
    })
  },
  config: config,
  globalData: {
    userInfo: null,
    location:{
      name:null,
      address: null,
      longitude:null,
      latitude:null
    }
  },
  checkLogin: function (cb, flag) {
    let that = this
    function check() {
      //登录态过期
      //检查本地缓存
      if (that.globalData.userInfo) {
        typeof cb == "function" && cb()
      } else {
        let info = wx.getStorageSync('userInfo')
        //存在缓存，并且缓存时间在一周内
        let dateNow = new Date().getTime()
        let expired = 1000 * 60 * 60 * 24 * 7
        if (info && (dateNow - info.saveDate) < expired) {
          that.globalData.userInfo = info
          typeof cb === "function" && cb()
        } else {
          //无缓存，重新登陆
          return false
          // if (flag === true) {
          //   return false
          // } else {
          //   wx.reLaunch({
          //     url: '/pages/welcome/welcome',
          //   })
          // }
        }
      }
    }
    check()
  }
})