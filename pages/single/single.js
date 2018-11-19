// pages/single/single.js
const foodData = require('../../data/food.js')
const app = getApp()
const config = Object.assign({

}, app.config)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rpxRatio: 0.5,
    canteen: {
      'cid': 1002,
      'name': '2号测试餐厅',
      'address': '重庆市 荣昌区 学院路 160号',
      'tel': '023-' + 2333333,
      'admin': 'PorYoung',
      'avatar': '/images/avatar/2.jpg',
      'notice': '欢迎光临本餐厅，本餐厅为民族餐厅，好吃不贵，快快选购吧！',
      'category': '民族餐厅',
      'specialBreakfast': '1',
      'startBreakfast': '7:00',
      'endBreakfast': '9:00',
      'specialLunch': '1',
      'startLunch': '11:00',
      'endLunch': '13:00',
      'specialDinner': '1',
      'startDinner': '18:00',
      'endDinner': '21:00',
      'startTime': '6:00',
      'closeTime': '21:00',
      'status': '1',
      'delivery': '0',
      'monthSale': 1230
    },
    showPopBusState: false,
    foodData: foodData,
    canteenList: [],
    canteenOrderId: 0,
    showCanteenDetail: false,
    categoryHeight: 48,
    foodHeight: 200,
    scrollCategoryID: 0,
    toView: null,
    showFood: null,
    showfoodDetail: false,
    switchComment: false,
    foodSelected: [],
    totalSelectCount: 0,
    totalPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    //get rpx tp px ratio
    that.getSystemRpxRatio()

    //get canteen
    let cid = options.cid
    //初始化foodData
    //get foodData
    let foodData = that.data.foodData
    wx.request({
      url: config.serverUrl + '/rest/getAllFood',
      success: function (res) {
        if (res.data && res.data.data) {
          let data = res.data.data
          let cate1 = {
            "categoryID": 1,
            "name": "凉菜",
            "foods": []
          }
          let cate2 = {
            "categoryID": 2,
            "name": "热/素菜",
            "foods": []
          }
          let cate3 = {
            "categoryID": 3,
            "name": "热/荤菜",
            "foods": []
          }
          let cate4 = {
            "categoryID": 4,
            "name": "干锅/汤锅",
            "foods": []
          }
          let cate5 = {
            "categoryID": 5,
            "name": "炒饭/盖饭",
            "foods": []
          }
          let cate6 = {
            "categoryID": 6,
            "name": "主食",
            "foods": []
          }
          let cate7 = {
            "categoryID": 7,
            "name": "其他",
            "foods": []
          }
          data.forEach((item) => {
            if (item.imgUrl.indexOf('static')) {
              item.imgUrl = config.serverUrl + item.imgUrl
              item.count = 0
            }
            switch (item.type) {
              case '1':
                cate1.foods.push(item)
                break
              case '2':
                cate2.foods.push(item)
                break
              case '3':
                cate3.foods.push(item)
                break
              case '4':
                cate4.foods.push(item)
                break
              case '5':
                cate5.foods.push(item)
                break
              case '6':
                cate6.foods.push(item)
                break
              default:
                cate7.foods.push(item)
                break
            }
          })
          foodData = foodData.concat([cate1, cate2, cate3, cate4, cate5, cate6, cate7])
          let canteenList = wx.getStorageSync('canteenList')
          let canteen = null
          let idx = 0
          for (idx; idx < canteenList.length; idx++) {
            if (canteenList[idx].cid == cid) {
              Object.assign(canteenList[idx], { 'foodData': foodData })
              canteen = canteenList[idx]
              break
            }
          }
          wx.setStorageSync('canteenList', canteenList)
          console.log(canteenList)
          that.setData({
            canteen: canteen,
            canteenList: canteenList,
            canteenOrderId: idx,
            foodData: foodData
          })

          //初始化右菜单
          that.setData({
            scrollCategoryID: that.data.foodData[0].categoryID
          })
          //初始化foodSelected对象
          let foodSelected = {}
          that.data.foodData.forEach((category, categoryOrderId) => {
            category.foods.forEach((food, foodOrderId) => {
              foodSelected[food.fid] = {
                count: 0,
                foodId: food.fid,
                foodOrderId: foodOrderId,
                categoryId: category.categoryID,
                categoryOrderId: categoryOrderId
              }
            })
          })
          that.setData({
            foodSelected: foodSelected
          })
        }
      }
    })
  },
  getSystemRpxRatio() {
    let that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          rpxRatio: res.screenWidth / 750
        })
      }
    })
  },
  showCanteenDetail: function() {
    let that = this
    that.setData({
      showCanteenDetail: !that.data.showCanteenDetail
    })
  },
  rightListScroll: function(e) {
    let that = this
    let categoryCount = that.data.foodData.length
    let foodCount = 0
    that.data.foodData.forEach(item => {
      foodCount += item.foods.length
    })

    let heightList = [0];
    let curHeight = 0;
    let rCategoryHeight = Math.floor(that.data.categoryHeight * that.data.rpxRatio)
    let rFoodHeight = Math.floor(that.data.foodHeight * that.data.rpxRatio)

    that.data.foodData.forEach(item => {
      curHeight += (rCategoryHeight + item.foods.length * rFoodHeight) - 1;
      heightList.push(curHeight);
    });
    // console.log(heightList)
    // console.log(e.detail.scrollTop)
    for (let i = 0; i < heightList.length; i++) {
      if (e.detail.scrollTop >= heightList[i] && e.detail.scrollTop < heightList[i + 1]) {
        this.setData({
          scrollCategoryID: that.data.foodData[i].categoryID
        });
      }
    }
    console.log(e)
  },
  scrollToCategory: function(e) {
    let that = this
    let ctid = e.currentTarget.dataset.categoryId
    that.setData({
      toView: 'category-' + ctid,
      scrollCategoryID: ctid
    })
  },
  showFoodDetail: function(e) {
    let that = this
    let categoryOrderId = e.currentTarget.dataset.categoryOrderId
    let foodOrderId = e.currentTarget.dataset.foodOrderId
    let foodId = e.currentTarget.dataset.foodId
    let showFood = that.data.foodData[categoryOrderId].foods[foodOrderId]
    showFood.foodOrderId = foodOrderId
    showFood.categoryOrderId = categoryOrderId
    showFood.foodId = foodId
    that.setData({
      showfoodDetail: true,
      foodDetailPanelTop: 0,
      showFood: showFood
    })
  },
  collapseFoodDetail: function() {
    let that = this
    that.setData({
      showfoodDetail: false,
      foodDetailPanelTop: '-100%',
      showFood: null
    })
  },
  switchToContent: function(e) {
    console.log(e, this.data.switchComment)
    if (this.data.switchComment == false) {
      return
    }
    this.setData({
      switchComment: false
    })
  },
  switchToComment: function(e) {
    console.log(e, this.data.switchComment)
    if (this.data.switchComment == true) {
      return
    }
    this.setData({
      switchComment: true
    })
  },
  triggerSelect: function(e) {
    let that = this
    console.log(e);
    let foodOrderId = e.currentTarget.dataset.foodOrderId
    let foodId = e.currentTarget.dataset.foodId
    let categoryOrderId = e.currentTarget.dataset.categoryOrderId
    let selectType = e.currentTarget.dataset.selectType
    let foodSelected = that.data.foodSelected
    let totalSelectCount = that.data.totalSelectCount
    let totalPrice = that.data.totalPrice
    let foodData = that.data.foodData
    if (selectType == 'add') {
      foodSelected[foodId].count++
        totalSelectCount++
        totalPrice += foodData[categoryOrderId].foods[foodOrderId].price
    } else if (selectType == 'remove') {
      foodSelected[foodId].count = foodSelected[foodId].count <= 0 ? 0 : foodSelected[foodId].count - 1
      totalSelectCount--
      totalPrice -= foodData[categoryOrderId].foods[foodOrderId].price
    }
    that.setData({
      foodSelected: foodSelected,
      totalPrice: totalPrice,
      totalSelectCount: totalSelectCount
    })
  },
  showPopBus: function() {
    let that = this
    if (that.data.showPopBusState == true) {
      that.collapsePopBus()
    } else {
      that.setData({
        popBusPosition: '90rpx',
        showPopBusState: true
      })
    }
  },
  collapsePopBus: function() {
    let that = this
    that.setData({
      popBusPosition: '-100vh',
      showPopBusState: false
    })
  },
  goToOrder: function() {
    let that = this
    that.data.canteenList[that.data.canteenOrderId].foodSelected = that.data.foodSelected
    wx.setStorageSync('canteenList',that.data.canteenList)
    wx.navigateTo({
      url: '../order/order?selectedid='+that.data.canteen.cid
    })
  },
  returnNull: () => {
    return null
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