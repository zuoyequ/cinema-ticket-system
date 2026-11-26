// pages/shopping/shopping.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSearch:true,
    isClear:false,
    val:'',
    pro_list:[
      {id:1,url:"/icon/gangtiex.jpg",txt:"漫威钢铁侠反浩克装甲雕塑MK7MK50模型手办",price:"￥3119",vip:"VIP￥2999",category:'影视手办'},
      {id:3,url:"/icon/songshu.jpg",txt:"可爱松鼠小玩偶~",price:"￥43",vip:"VIP￥29",category:'毛绒玩具'},
      {id:2,url:"/icon/leimu.jpg",txt:"从零开始的异世界生活和服雷姆手办",price:"￥86",vip:"VIP￥69",category:'影视手办'},
      {id:4,url:"/icon/manghe1.jpg",txt:"5m高RICO来了！现场拆盲盒，还能拍大片！",price:"￥86",vip:"VIP￥69",category:'盲盒'},
    ],
    nav_list: ['默认', '影视手办', '毛绒玩具', '抱枕','零食','印花衣服','盲盒'],
    open: false,
    chose:'1',
  },
  open_list: function (opts) {
    let a=opts.currentTarget.dataset.title;
    console.log(a)
    if(a!='默认'){
    var that=this
    wx.request({
      url: 'http://127.0.0.1:8080/get_shopping2',
      data:{
        type_name:a,
      },
      success:function(res){
          console.log(res.data)
          that.setData({
            get_shopping:res.data,
          });
      }
     })
      this.setData({ chose: '1', open: false });
    }else{
      var that=this
      wx.request({
        url: 'http://127.0.0.1:8080/get_shopping',
        success:function(res){
            console.log(res.data)
            that.setData({
              get_shopping:res.data,
              
            });
        }
       })
      this.setData({ chose: '1', open: false });
    }
  },
  //左侧导航的开关函数
  proDetail(e){
    var id=e.currentTarget.dataset.id;
    console.log(id)
    var name=e.currentTarget.dataset.name;
    console.log(name)
     wx.navigateTo({
       url: '/pages/proDetails/proDetails?name='+name+'&&id='+id,
     })
     
  },
  off_canvas: function () {
    this.data.open ? this.setData({ open: false }) : this.setData({ open: true });
  },
  getInput:function(e){
    this.setData({
      val:e.detail.value
    })
    if(this.data.val.length>0){
      this.setData({
        isSearch:false,
        isClear:true
      })
    }else{
      this.setData({
        isSearch:true,
        isClear:false
      })
    }
  },
  shoppingcart(e){
    var id=e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/shopping-cart/shopping-cart?id='+id,
    })
  },
  clearTap:function(e){
    this.setData({
      val:'',
      isSearch:true,
      isClear:false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var id=this.options.id
    var that=this

    wx.request({
        url: 'http://127.0.0.1:8080/get_shopping',
        success:function(res){
            console.log(res.data)
            that.setData({
              get_shopping:res.data,
              id:id,
            });
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
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