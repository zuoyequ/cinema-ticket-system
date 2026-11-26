// pages/me3/me3.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image:'/icon/touxiang.png',
  },
  gotoPlatform(e){
    wx.navigateTo({
      url: '/pages/platformManager/platformManager',
    })
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
  gotoStatitics(e){
    wx.navigateTo({
      url: '/pages/statistics/statistics',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var id = wx.getStorageSync('id');
    var type = wx.getStorageSync('user');
    console.log('Received user:', type);
    console.log('Received id:', id);
    var that=this
    wx.request({
      url: 'http://127.0.0.1:8080/chaxun3',
       data:{id:id},
        success:function(res){
        that.setData({
          chaxun3:res.data,
         id:id,
         type:type
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
    // 修正：me3 已从 tabBar 改为普通页面，getTabBar() 不再生效，
    // 改为直接获取手动引入的底部导航组件，设置“我的”为选中状态
    var tabBar = this.selectComponent('#tab-bar');
    if (tabBar) {
      tabBar.setData({
        selected: "06"
      });
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