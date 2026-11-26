// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  denglu(){
    wx.navigateTo({
        url:'../main/main',
    })
},
formsubmit(ex){
    console.log("注册");
    var trName = ex.detail.value.trName;
    var telephone = ex.detail.value.telephone; 
    var password = ex.detail.value.password; 
    var type=1
    console.log('telephone value changed', ex.detail.value.telephone)
    console.log('password value changed', ex.detail.value.password)
    console.log('radio value changed', ex.detail.value.type)
    var that=this
    wx.request({
        url: 'http://127.0.0.1:8080/check_Register',
        data:{
           trName:trName,
            telephone:telephone,
            password:password,
            type: type
        },
        success:function(res){
            wx.showToast({
                   title: '注册成功',
                            icon:'success',
                            duration:900
              });
              wx.navigateTo({
                url: '../main/main',
              })
            
        }
       })  
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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