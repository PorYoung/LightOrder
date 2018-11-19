// pages/order/order.js
const app = getApp()
const config = Object.assign({

}, app.config)
const foodData = require('../../data/food.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canteen: null,
    totalPrice: 0,
    totalCount: 0,
    note: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let cid = options.selectedid
    let canteenList = wx.getStorageSync('canteenList')
    let canteen = null
    let idx = 0
    for(idx;idx<canteenList.length;idx++){
      if(canteenList[idx].cid==cid){
        canteen = canteenList[idx]
        break
      }
    }
    that.setData({
      canteen: canteen
    })
    console.log(canteen)
    let foodSelected = canteen.foodSelected
    let foodData = canteen.foodData
    let selectedData = []
    let totalPrice = that.data.totalPrice
    let totalCount = that.data.totalCount
    foodData.forEach((category, categoryOrderId) => {
      category.foods.forEach((food, foodOrderId) => {
        if(foodSelected[food.fid].count>0){
          selectedData.push(Object.assign({},food,foodSelected[food.fid]))
          totalPrice += food.price * foodSelected[food.fid].count
          totalCount += foodSelected[food.fid].count
        }
      })
    })
    that.setData({
      selectedData: selectedData,
      totalPrice: totalPrice,
      totalCount: totalCount
    })
  },
  submitOrder: function(){
    let that = this
    let order = {}
    order.canteenCid = that.data.canteen.cid
    order.foodSelected = that.data.canteen.foodSelected
    order.selectedData = that.data.selectedData
    order.totalPrice = that.data.totalPrice
    order.totalCount = that.data.totalCount
    order.note = that.data.note
    // order.userCid = that.data.userInfo.cid
    /* 
      submit order
     */
    let oid = new Date().getTime()+that.data.canteen.cid
    order.id = oid
    let orderList = wx.getStorageSync('orderList')
    if(orderList){
      orderList.push(order)
    }else{
      orderList = []
      orderList.push(order)
    }
    wx.setStorageSync('orderList', orderList)
    wx.redirectTo({
      url: '../user/detail/detail?oid='+oid,
    })
  },
  getInputNote: function(e){
    let that = this
    let note = e.detail.value
    that.setData({
      note: note
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})