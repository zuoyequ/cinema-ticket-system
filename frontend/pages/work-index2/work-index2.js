// pages/work-index/work-index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSearch:true,
    isClear:false,
    val:'',
    tab:[
      {name:'正在热映',isclick:true},
      {name:'即将上映',isclick:false},
    ],
    active:'0',
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
  clearTap:function(e){
    this.setData({
      val:'',
      isSearch:true,
      isClear:false
    })
  },
  buyTicket:function(e){
    let _this=this;
    this.setData({
      active:e.currentTarget.dataset.index
    })
    var index=e.currentTarget.dataset.index;
    console.log(index)
    wx.navigateTo({
      url: '/pages/buyTicket/buyTicket?index='+index,
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
  gotoIntroduction(e){
    let _this=this;
    this.setData({
      active:e.currentTarget.dataset.index
    })
    var id=e.currentTarget.dataset.index;
    console.log(id)
    wx.navigateTo({
      url: '/pages/Introduction/Introduction?id='+id,
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
                  
    var id = wx.getStorageSync('id');
    console.log('Received id:', id);

    var that=this
    wx.request({
        url: 'http://127.0.0.1:8080/get_moviecontent3',
        success:function(res){
          
            console.log(res.data)
            that.setData({
              get_moviecontent3:res.data,
              id:id
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
    if(typeof this.getTabBar==='function' && this.getTabBar()){
      this.getTabBar().setData({
          selected:"03"
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
