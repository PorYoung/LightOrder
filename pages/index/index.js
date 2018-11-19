//index.js
//获取应用实例
const app = getApp()
const searchSuggestionData = require('../../data/searchSuggestion.js')
const canteenList = require('../../data/canteens.js')
const config = Object.assign({

}, app.config)
Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    location: {
      address: '获取位置'
    },
    hasLocation: false,
    searchValue: null,
    searchFocus: false,
    searchHistory: [],
    searchSuggestionData: searchSuggestionData,
    searchSuggestionResult: [],
    canteenList: canteenList
  },
  onLoad: function () {
    let that = this
    /*get canteen list
    */
    wx.request({
      url: config.serverUrl + '/rest/getAllCanteen',
      success: function(res){
        console.log(res)
        if(res.data && res.data.data){
          let data = res.data.data
          data.forEach((item)=>{
            item.avatar = config.serverUrl + item.avatar
          })
          that.setData({
            canteenList: res.data.data
          })
          wx.setStorageSync('canteenList', that.data.canteenList)
        }
      }
    })
    /* 
      check login
    */
    let state = app.checkLogin()
    if (state == false) {
      // switch to user login
    } else {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    }
  },
  searchBoardOn: function () {
    let that = this
    that.setData({
      searchFocus: true
    })
  },
  searchBoardOff: function () {
    let that = this
    that.setData({
      searchFocus: false
    })
  },
  searchSuggestion: function (e) {
    let that = this
    /*request for data

    */
    let key = e.detail.value
    if (key === '') {
      that.setData({
        searchSuggestionResult: []
      })
      return
    }
    let ssData = that.data.searchSuggestionData
    let ssResult = ssData.filter(item => {
      return item.indexOf(key) != -1
    }).sort((a, b) => {
      return a.indexOf(key) - b.indexOf(key)
    })
    that.setData({
      searchSuggestionResult: ssResult
    })
  },
  searchSubmit: function (e) {
    let that = this
    let dataset = e.currentTarget.dataset
    let sv = null
    //search from suggestion
    if (dataset.hasOwnProperty('ssid')) {
      sv = that.data.searchSuggestionResult[dataset.ssid]
    }
    //search from history
    else if (dataset.hasOwnProperty('shid')) {
      sv = that.data.searchHistory[dataset.shid]
    }
    //search directly
    else {
      sv = e.detail.value
    }
    that.setData({
      searchValue: sv
    })
    console.log('search submit:' + sv)
    /*request

    */
    that.searchBoardOff()
    //add to search history and delete history
    let sh = that.data.searchHistory
    if (!sh.includes(sv)) {
      sh = [sv].concat(sh).slice(0, config.MaxHistoryLength)
    } else {
      sh = sh.splice(sh.indexOf(sv), 1).concat(sh)
    }
    that.setData({
      searchHistory: sh
    })
    wx.setStorageSync('searchHistory', sh)

    //navigate to search page
    wx.navigateTo({
      url: '../search/search?sv='.concat(sv),
      fail: function (res) {
        wx.showToast({
          title: '请求失败，请重试',
        })
      },
    })
  },
  deleteHistory: function () {
    let that = this
    that.setData({
      searchHistory: []
    })
    wx.setStorageSync('searchHistory', [])
    console.log('delete history')
  },
  getLocation: function () {
    let that = this
    if (app.globalData.hasLocation === true) {
      that.setData({
        location: app.globalData.location,
        hasLocation: true
      })
    } else {
      app.getLocation(location => {
        that.setData({
          location: location,
          hasLocation: true
        })
      })
    }
  },
  tapToGetLocation: function () {
    let that = this
    that.getLocation()
    wx.chooseLocation({
      success: function (res) {
        app.globalData.location = res
        that.setData({
          location: res
        })
        console.log(that.data.location)
      },
    })
  },
  navToOrder: function(e){
    let that = this
    let cid = e.currentTarget.dataset.cid
    wx.navigateTo({
      url: '../single/single?cid='.concat(cid),
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onShow: function () {
    let that = this
    // get user location
    that.getLocation()
    // get user info
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
    //get user local search history
    let searchHistory = wx.getStorageSync('searchHistory') || []
    that.setData({
      searchHistory: searchHistory
    })
  }
})
