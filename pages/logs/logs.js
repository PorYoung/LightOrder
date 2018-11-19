//logs.js
const app = getApp()
const util = require('../../utils/util.js')
const logs = require('../../data/logs.js')
Page({
  data: {
    logs: [],
    //默认未获取地址
    hasLocation: false
  },
  onLoad: function () {
    this.setData({
      logs: logs
    })
    this.getLocation()
  },
  //获取经纬度
  getLocation: function (e) {
    console.log(e)
    let that = this
    app.getLocation(location => {
      console.log(location)
      that.setData({
        location: location,
        hasLocation: true
      })
    })
  },
  //根据经纬度在地图上显示
  openLocation: function (e) {
    let value = e.detail.value
    let that = this
    // wx.openLocation({
    //   longitude: Number(value.longitude),
    //   latitude: Number(value.latitude)
    // })
    wx.chooseLocation({
      success: function (res) {
        app.globalData.location = res
        that.setData({
          location: res
        })
        console.log(that.data.location)
      },
    })
  }
})
