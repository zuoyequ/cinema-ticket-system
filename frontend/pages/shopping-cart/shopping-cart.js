// pages/shopping-cart/shopping-cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allDefault:false,
    sum:0,
    address:'浙江省杭州市杭电路一号',
    cartList:[
      {name:'漫威钢铁侠反浩克装甲雕塑MK7MK50模型手办',select:'钢铁侠一号',type:'极速退款',price:3119,isDefault:false,},
      {url:"/icon/songshu.jpg",name:"可爱松鼠小玩偶~",price:43,select:'松鼠毛绒玩具',type:'破损包退',isDefault:false,},
    ],
    lp:["浙江省杭州市杭电路一号","北京东城区天安门11号"],
    payment_password:'905123',
    showPayPwdInput: false,  //是否展示密码输入层
    pwdVal: '',  //输入的密码
    payFocus: true, //文本框焦点
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
            isBuy:false,
          },
        })
      }else{
        wx.showToast({
          title: "密码错误",
          icon:'error'
        })
      }
    });
  },
  /**
   * 获取焦点
   */
  getFocus(){
    this.setData({ payFocus: true });
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
  clickDefault(e){
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var res=e.currentTarget.dataset.res;
    let indexx=res[index].id
    console.log(indexx)
    var s=0;
    if(res[index].isDefault==false){
      res[index].isDefault=true;
    }else{
      res[index].isDefault=false;
    }
    for(var i=0;i<res.length;i++){
      if(res[i].isDefault==false){
        s+=res[i].price
      }
    }
    // this.data.cartList.forEach(function(v){
    //   v.isDefault=false;
    // })
    // this.data.cartList[index].isDefault=true;
    // console.log(index);
    this.setData({
      shopping_cart:res,
      sum:s,
      indexx:indexx,
    })
  },
  clickDefaultAll(e){
    var ad = this.data.allDefault;
    var res1=e.currentTarget.dataset.res1;
    var s=0;
    if(ad==false){
      for(var i=0;i<res1.length;i++){
        res1[i].isDefault=false;
        s+=res1[i].price
      }
      ad=true
    }else{
      for(var i=0;i<res1.length;i++){
        res1[i].isDefault=true;
      }
      s=0;
      ad=false
    }
    this.setData({
      shopping_cart:res1,
      sum:s,
      allDefault:ad
    })
  },
  // cancelDefaultAll(e){
  //   var s=0;
  //   if(this.data.allDefault==true){
  //     for(var i=0;i<this.data.cartList.length;i++){
  //       this.data.cartList[i].isDefault=false;
  //     }
  //   }
  //   this.setData({
  //     cartList:this.data.cartList,
  //     allDefault:false
  //   })
  // },
  send :function(e)
  { 
    var that=this;
    var lp = e.currentTarget.dataset.street;
    wx.showActionSheet({
      itemList: lp,
      itemColor: '',
      success: function(res) 
      {
        console.log(res.tapIndex); 
        console.log(lp[res.tapIndex]);
        that.setData({
          address:lp[res.tapIndex]
        })
      },
      fail: function(res) {},
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      var id=this.options.id
      console.log(id)
      var that=this
      wx.request({
        url: 'http://127.0.0.1:8080/shopping_cart',
        data:{
          id:id
        },
        success:function(res){
          let payment=res.data[0].payment
          console.log(payment)
            console.log(res.data)
            that.setData({
              shopping_cart:res.data,
              payment:payment,
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