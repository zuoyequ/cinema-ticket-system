// pages/comment/comment.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectData:["全部评论","5星","4星","3星","2星","1星"],
    allStar: 3,
    stars_1: '',
  },
  gotoStar(e){
    var id=e.currentTarget.dataset.index;
    console.log(id)
    wx.navigateTo({
      url: '/pages/star/star?id='+id,
    })
  },

  Detail(index){
    var that=this
    console.log(index)
    wx.request({
        url: 'http://127.0.0.1:8080/get_moviecontent',
        data:{
            id:index,
        },
        success:function(res){
            console.log(res.data)
            that.setData({
              get_movie_comment:res.data,
            });
        }
       })
  },
  Detail1(index){
    var that=this
    console.log(index)
    wx.request({
        url: 'http://127.0.0.1:8080/get_moviecontent1',
        data:{
            id:index,
        },
        success:function(res){
            console.log("detail11"+res.data)
            that.setData({
              get_movie_comment1:res.data,
            });
        }
       })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let t = this;
    console.log("t"+t.data.allStar)
    t.setData({
      stars_1: t.data.allStar,
    })
    
    var index = this.options.index;  
    console.log(index); 
    this.Detail(index);
    this.Detail1(index);
    this.setData({
      index:index,
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