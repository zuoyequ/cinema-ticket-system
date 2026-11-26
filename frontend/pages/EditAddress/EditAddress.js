// pages/addAddress/addAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{
      id:0,
      name:'',
      mobile:'',
      city:'',
      street:'',
      isDefault:false,
      checked:false
    }
  },

  inputName(e){
    this.data.address.name=e.detail.value;
    this.setData({
      address:this.data.address
    })
  },
  inputMobile(e){
    this.data.address.mobile=e.detail.value;
    this.setData({
      address:this.data.address
    })
  },
  inputStreet(e){
    this.data.address.street=e.detail.value;
    this.setData({
      address:this.data.address
    })
  },
  bindRegionChange(e){
    var city = e.detail.value;
    this.data.address.city = city.join(" ");
    this.setData({
      address:this.data.address
    })
  },
  clickDefault(e){
    if(this.data.address.isDefault){
     this.data.address.isDefault=false
    }else{
      this.data.address.isDefault=true
    }
    this.setData({
      address:this.data.address
    })
  },
  clickedit(e){
    var id=e.currentTarget.dataset.id;
    //console.log(id)
    var name = e.detail.value.name;
    var telephone = e.detail.value.telephone; 
    var street = e.detail.value.street; 
    var address = e.detail.value.address;
    //console.log(name)
    //console.log(address)
    //console.log(street)
    var that=this
    wx.request({
        url: 'http://127.0.0.1:8080/update_address',
        data:{
          id:id,
          name:name,
          telephone:telephone,
          street:street,
          address:address,
        },
        success:function(res){
            console.log(res.data)
            that.setData({
              edit_address:res.data,
            });
        }
       })
    wx.showToast({
      title: '保存成功',
      icon:'success'
    })
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var id = this.options.id;
    console.log(id)
    var that=this
    wx.request({
      url: 'http://127.0.0.1:8080/get_address1',
      data:{
        id:id,
      },
      success:function(res){
          console.log(res.data)
          that.setData({
            id:id,
            get_address1:res.data,
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