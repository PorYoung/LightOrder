// pages/user/orders/orders.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    /* get orders data */
    let orderList = wx.getStorageSync('orderList')
    if(orderList){
      that.setData({
        orderList: orderList
      })
    }
  },
  goToDetail: function(e){
    let that = this
    let orderid = e.currentTarget.dataset.orderId
    wx.navigateTo({
      url: '../detail/detail?orderid='+orderid,
    })
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