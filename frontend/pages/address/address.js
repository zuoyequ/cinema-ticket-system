// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[],
  },
  clickDefault(e){
    var index = e.currentTarget.dataset.index;
    this.data.addressList.forEach(function(v){
      v.isDefault=false;
    })
    this.data.addressList[index].isDefault=true;
    var address = this.data.addressList.splice(index,1)[0];
    this.data.addressList=[address,...this.data.addressList];
    this.setData({
      addressList:this.data.addressList
    })
  },
  clickDelete(e){
    var id=e.currentTarget.dataset.index
       console.log(id)
    var that=this
    wx.request({
        url: 'http://127.0.0.1:8080/delete_address',
        data:{
          id:id
        }
       })
       wx.navigateTo({
        url: '/pages/address/address',
      })
  },
  clickEdit(e){
    var id=e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/EditAddress/EditAddress?id='+id,
    })
  },
  clickAdd(e){
    wx.navigateTo({
      url: '/pages/addAddress/addAddress',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that=this
    wx.request({
        url: 'http://127.0.0.1:8080/get_address',
        success:function(res){
          
            console.log(res.data)
            console.log(res.data.length)
            for(var i=0;i<res.data.length;i++){
              var address={};
              address.id=res.data[i].id;
              console.log(address.id)
              address.name=res.data[i].name;
              address.mobile=res.data[i].telephone;
              address.address=res.data[i].street;
              address.street=res.data[i].address;
              address.isDefault=false;
              address.checked=false;
              if(i==0){
                address.isDefault=true;
              }
              that.data.addressList.push(address);
            }
            that.setData({
              get_address:res.data,
              addressList:that.data.addressList,
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