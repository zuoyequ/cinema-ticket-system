// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image:'/icon/touxiang.png',
  },
  changeImg(e){
    var  _this = this;
    wx.chooseImage({
      count:1,
      sizeType:['original','compressed'],
      sourceType:'album',
      success:function(res){
        _this.setData({
          image:res.tempFilePaths,
          cang:0,
        })
      }
    })
  },
  gotoShop(e){
     var id=e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/shopping/shopping?id='+id,
    })
  },
  gotoDingdan(e){
    var id=e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/order/order?id='+id,
    })
  },
  gotoEdit(e){
    var id=e.currentTarget.dataset.id
    var type=e.currentTarget.dataset.type
    console.log(type)
    wx.navigateTo({
      url: '/pages/personal/personal?id='+id+'&&type='+type,
    })
  },
  gotoPerson(e){
    var id=e.currentTarget.dataset.id
    var type=e.currentTarget.dataset.type
    console.log(type)
    wx.navigateTo({
      url: '/pages/personal/personal?id='+id+'&&type='+type,
    })
  },
  gotoAddress(e){
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  exit(e){
    wx.navigateTo({
      url: '/pages/main/main',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var id = wx.getStorageSync('id');
    var type = wx.getStorageSync('user');
    console.log('Received user:', type);
    var that=this
    wx.request({
      url: 'http://127.0.0.1:8080/chaxun1',
       data:{id:id},
        success:function(res){
        that.setData({
          chaxun1:res.data,
         id:id
 })
}
  })
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log("ddd")
   
    if(typeof this.getTabBar==='function' && this.getTabBar()){
      this.getTabBar().setData({
          selected:"02"
      })
  }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})