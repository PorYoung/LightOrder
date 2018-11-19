// pages/search/search.js
const app = getApp()
const searchSuggestionData = require('../../data/searchSuggestion.js')
const canteenListData = require('../../data/canteens.js')
const config = Object.assign({

}, app.config)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: null,
    hasLocation: false,
    searchSuggestionData: searchSuggestionData,
    canteenList: [],
    searchHistory: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    //get user location
    that.getLocation()
    //get search value from index
    let sv = options.sv
    if(sv==''){
      wx.showToast({
        title: '搜索内容不能为空',
      })
    }else{
      that.setData({
        searchValue: sv
      })
      that.searchMatch(sv)
    }
    //get user local search history
    let searchHistory = wx.getStorageSync('searchHistory') || []
    that.setData({
      searchHistory: searchHistory
    })
    
  },
  getLocation: function () {
    let that = this
    if (app.globalData.hasLocation === true) {
      this.setData({
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
  searchMatch: function(sv,options){
    let that = this
    /*request for search result

    */
    wx.showLoading({
      title: '努力获取中',
    })
    setTimeout(()=>{
      wx.hideLoading()
    },1000)
    //have gotten search result
    let list = canteenListData
    let searchResult = []
    if(list.length>0){
      searchResult = list.filter(item => {
        return item.name.indexOf(sv) != -1 || item.category.indexOf(sv) != -1
      }).sort((a, b) => {
        //order by status
        if(b.status==a.status){
          //order by name
          if (a.name.indexOf(sv) == b.name.indexOf(sv)){
            //order by category
            return a.category.indexOf(sv) - b.category.indexOf(sv)
          }
          return a.name.indexOf(sv) - b.name.indexOf(sv)
        }
        return b.status - a.status
      })
    }
    that.setData({
      canteenList: searchResult
    })
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
    if (dataset.hasOwnProperty('ssid')) {
      sv = that.data.searchSuggestionResult[dataset.ssid]
    } else if (dataset.hasOwnProperty('shid')) {
      sv = that.data.searchHistory[dataset.shid]
    } else {
      sv = e.detail.value
    }
    that.setData({
      searchValue: sv
    })
    console.log('search submit:' + sv)
    /*request

    */
    //search for data
    that.searchMatch(sv)

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
  },
  deleteHistory: function () {
    let that = this
    that.setData({
      searchHistory: []
    })
    wx.setStorageSync('searchHistory', [])
    console.log('delete history')
  },
  navToOrder: function (e) {
    let that = this
    let uid = e.currentTarget.dataset.uid
    wx.navigateTo({
      url: '../single/single?uid='.concat(uid),
    })
  }
})