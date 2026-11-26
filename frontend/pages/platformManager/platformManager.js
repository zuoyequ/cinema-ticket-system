// pages/platformManager/platformManager.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cang:1,
    head:  "/icon/shangchuan.jpg",
    name:'',
    type:'',
    during:'',
    choice:'',
    jianjie:'',
    image:'',
    shopname:'',
    price:'',
    shopStyle:'',
    shopType:'影视手办',
    shopJ:'',
    radios:[
      { count:"即将上映", value:1, checked:true },
      { count:"正在热映", value:2, checked:false },
    ],
    lp:["影视手办","毛绒玩具","盲盒","抱枕","零食","印花衣服"],
    tab:[
      {name:'添加影片',isclick:true},
      {name:'添加商品',isclick:false},
    ],
    active:'0',
  },
  send :function(e)
  { 
    var that=this;
    var lp = this.data.lp;
    wx.showActionSheet({
      itemList: this.data.lp,
      itemColor: '',
      success: function(res) 
      {
        console.log(res.tapIndex); 
        console.log(lp[res.tapIndex]);
        that.setData({
          shopType:lp[res.tapIndex]
        })
      },
      fail: function(res) {},
    })
  },
  changetab:function(e){
    let _this=this;
    this.setData({
      active:e.currentTarget.dataset.index
    })
    var index=e.currentTarget.dataset.index;
    var oldlist=this.data.tab
    for(let i=0;i<oldlist.length;i++){
      oldlist[i].isclick=false
      oldlist[index].isclick=true
    }
    _this.setData({
      tab:oldlist
    })
  },
  changeImg(e){
    var  that = this;
    wx.chooseImage({
      count:1,
      sizeType:['original','compressed'],
      sourceType:'album',
      success:function(res){
        let image=res.tempFilePaths[0]

        that.setData({
          head:res.tempFilePaths,
          image:image,
          cang:0,
        })
        console.log(res.tempFilePaths)
      }
    })
    // wx.chooseImage({
    //   count: 1, // 默认9     
    //   sizeType: ['original', 'compressed'],
    //  // 指定是原图还是压缩图，默认两个都有     
    //   sourceType: ['album', 'camera'],
    //  // 指定来源是相册还是相机，默认两个都有   
    //   success: function (res) {   
    //     _this.setData({
    //       head: res.tempFilePaths
    //    })
  },
  submition:function(ex){
    var name = ex.detail.value.name; 
    var type = ex.detail.value.type; 
    var during=ex.detail.value.during;
    var choice = ex.detail.value.choice; 
    var image = this.data.image; 
    var jianjie=ex.detail.value.jianjie;

    var that=this
    
    wx.request({
        url: 'http://127.0.0.1:8080/add_Movie',
        data:{
            name:name,
            type:type,
            during:during,
            choice:choice,
            image:image,
            jianjie:jianjie,
        },
        success:function(res){
            console.log("detail11"+res.data)
            that.setData({
              get_movie_comment1:res.data,
            });
        }
       })
  },
  submition1:function(ex){
    var shopname = ex.detail.value.shopname; 
    var price = ex.detail.value.price; 
    var shopStyle=ex.detail.value.shopStyle;
    var image = this.data.image; 
    var shopJ = ex.detail.value.shopJ; 
    var shopType=this.data.shopType;
    var that=this
    
    wx.request({
        url: 'http://127.0.0.1:8080/add_shopping',
        data:{
          shopname:shopname,
          price:price,
          shopStyle:shopStyle,
          shopJ:shopJ,
            image:image,
            shopType:shopType,
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