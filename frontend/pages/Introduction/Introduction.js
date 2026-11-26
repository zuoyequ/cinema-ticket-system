// pages/Introduction/Introduction.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ellipsis: true,
    dyList:[
      {
        type:1,
        img:"/icon/13 (2).jpg"
    }
    ],
    artistList:[
      {
        img:"/icon/sa.png",
        Rname:"申奥",
        name:"导演"
      },
      {
        img:"/icon/zyx.png",
        Rname:"张艺兴",
        name:"饰：潘生"
      },
      {
        img:"/icon/jc.png",
        Rname:"金晨",
        name:"饰：梁安娜"
      },
      {
        img:"/icon/ym.png",
        Rname:"咏梅",
        name:"饰：赵东冉"
      },
      {
        img:"/icon/ze.png",
        Rname:"周也",
        name:"饰：宋雨"
      },
      {
        img:"/icon/brs.png",
        Rname:"孙杨",
        name:"饰：安俊才"
      },
      {
        img:"/icon/wcj.png",
        Rname:"王传君",
        name:"饰：陆秉坤"
      },
    ]
  },
  ellipsis: function () {  
    this.setData({
      ellipsis: !this.data.ellipsis
    }) 
  },
  gotoBuy:function(e){
    let _this=this;
    this.setData({
      active:e.currentTarget.dataset.index
    })
    var id=e.currentTarget.dataset.index;
    console.log(id)
    wx.navigateTo({
      url: '/pages/buyTicket/buyTicket?index='+id,
    })
  },
  gotoComment(ex){
    let id=this.data.id 
    var movie_name = ex.currentTarget.dataset.movie_name;
    console.log(id)
    wx.navigateTo({
      url: '/pages/comment/comment?index='+id,
    })
  },

  Detail(id){
    var that=this
   
    console.log(id)
    wx.request({
        url: 'http://127.0.0.1:8080/get_moviecontent',
        data:{
            id:id,
        },
        success:function(res){
            console.log(res.data)
            that.setData({
              get_movie_content:res.data,
            });
        }
       })  
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var id = this.options.id;  
    console.log(id); 
    this.Detail(id);
    this.setData({
      id:id,
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