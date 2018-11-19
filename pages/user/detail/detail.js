// pages/user/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid: null,
    orderData: null,
    totalCount: null,
    totalPrice: null,
    canteen: null,
    note: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    console.log(options)
    let orderid = options.orderid
    that.setData({
      orderid: orderid
    })
    let orderList = wx.getStorageSync('orderList')
    let order = null
    for (let i = 0; i < orderList.length; i++) {
      if (orderList[i].id == orderid) {
        order = orderList[i]
        break
      }
    }
    if(order==null){
      wx.navigateBack({
        delta: '1'
      })
      return
    }
    let canteenId = order.canteenUid
    let canteen = null
    let canteenList = wx.getStorageSync('canteenList')
    if (canteenList) {
      for (let i = 0; i < canteenList.length; i++) {
        if (canteenList[i].uid == canteenId) {
          canteen = canteenList[i]
          break
        }
      }
    } else {
      /* get canteenList */
    }
    that.setData({
      order: order,
      orderData: order.selectedData,
      totalPrice: order.totalPrice,
      totalCount: order.totalCount,
      note: order.note,
      canteen: canteen
    })

  },
  submitOrder: function(e){
    wx.navigateTo({
      url: '../comment/comment?orderid='+this.data.orderid,
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