// pages/proDetails/proDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lp1:["7天无理由退款","运费险","极速退款"],
    lp2:["复古式宝盒","钢铁侠2号","钢铁侠3号"],
    baoxian:'7天无理由退款',
    chose:'复古式宝盒',
    payment_password:'905123',
    showPayPwdInput: false,  //是否展示密码输入层
    pwdVal: '',  //输入的密码
    payFocus: true, //文本框焦点
  },
  send :function(e)
  { 
    var that=this;
    var lp = this.data.lp1;
    wx.showActionSheet({
      itemList: this.data.lp1,
      itemColor: '',
      success: function(res) 
      {
        console.log(res.tapIndex); 
        console.log(lp[res.tapIndex]);
        that.setData({
          baoxian:lp[res.tapIndex]
        })
      },
      fail: function(res) {},
    })
  },
  send2 :function(e)
  { 
    var that=this;
    var lp = this.data.lp2;
    wx.showActionSheet({
      itemList: this.data.lp2,
      itemColor: '',
      success: function(res) 
      {
        console.log(res.tapIndex); 
        console.log(lp[res.tapIndex]);
        that.setData({
          chose:lp[res.tapIndex]
        })
      },
      fail: function(res) {},
    })
  },
  showInputLayer(){
    this.setData({ showPayPwdInput: true, payFocus: true });
  },
  hidePayLayer(payment,id,index){
    /**获取输入的密码**/
    var val = this.data.pwdVal;
    console.log(val)
    
    var that = this; // 保存正确的 this 上下文
    
    console.log(payment)
    /**在这调用支付接口**/
    that.setData({ showPayPwdInput: false, payFocus: false, pwdVal: '' }, function(){
        /**弹框**/
        if(val==payment){
            wx.showToast({
                title: "支付成功",
                icon:'success'
            })
            wx.request({
              url: 'http://127.0.0.1:8080/insert_shoppingorder',
              data:{
                id:id,
                index:index,
                address_id:id,
                isDefault:false,
              },
            })
        }else{
            wx.showToast({
                title: "密码错误",
                icon:'none' // 将 icon 的值改为 'none'
            })
        }
    });
},

  /**
   * 获取焦点
   */
  getFocus(){
    var that=this
    that.setData({ payFocus: true });
  },
  /**
   * 输入密码监听
   */
  inputPwd(e){
    var payment = e.currentTarget.dataset.payment;
    var id=e.currentTarget.dataset.id;
    var index=e.currentTarget.dataset.index;
    console.log(index)
    var that=this
      that.setData({ pwdVal: e.detail.value });
      if (e.detail.value.length >= 6){
        this.hidePayLayer(payment,id,index);
      }
      
  },
  getLocation(){
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var id=this.options.id;
    console.log(id)
    var name = this.options.name;
    console.log(name)
    var that=this
    wx.request({
      url: 'http://127.0.0.1:8080/chaxun1',
      data:{
        id:id,
      },
      success:function(res){
          console.log(res.data)
          let payment=res.data[0].payment
          that.setData({
            payment:payment,
            id:id,
          });
      }
     })
    wx.request({
        url: 'http://127.0.0.1:8080/get_shopping1',
        data:{
          name:name,
        },
        success:function(res){
            console.log(res.data)
            
            that.setData({
              get_shopping1:res.data,
              
            });
        }
       })
  },
  shoppingcart(e){
    var id=e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/shopping-cart/shopping-cart?id='+id,
    })
  },
  addshoppingcart(e){
    var id=e.currentTarget.dataset.id;
    var index=e.currentTarget.dataset.index;
    var baoxian=e.currentTarget.dataset.baoxian;
    var chose=e.currentTarget.dataset.chose;
    console.log(baoxian)
    console.log(chose)
    var that=this
    wx.request({
      url: 'http://127.0.0.1:8080/insert_shoppingcart',
      data:{
        id:id,
        index:index,
        address_id:id,
        typee:baoxian,
        select:chose,
        isDefault:false,
        isBuy:false,
      },
      success:function(res){
          console.log(res.data)
          wx.navigateTo({
            url: '/pages/shopping-cart/shopping-cart?id='+id,
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