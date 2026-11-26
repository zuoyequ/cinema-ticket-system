// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:false,
    changeStyle:0,
    x:1,
    qianm:'',
    name:'name',
    gender:'男',
    birthday:'2004-2-29',
    email:'1212121212@qq.com',
    address:'浙江省杭州市临安区杭电路一号',
    work:'学生',
    lp:['男','女'],
    image:'/icon/touxiang.png',
  },
  changeImg(e){
    var  _this = this;
    wx.chooseImage({
      count:1,
      sizeType:['original','compressed'],
      sourceType:'album',
      success:function(res){
        _this.setData({
          image:res.tempFilePaths,
          cang:0,
        })
      }
    })
  },
  edit(e){
    this.setData({ isShow:true,changeStyle:1 })
  },
  save(e){
    this.setData({ isShow:false,changeStyle:0 })
  },
  inputEdit(e){
    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          this.setData({ x:0, qianm:res.content })
          console.log(res.content)//用户输入的值
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  inputEdit2(e){
    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          this.setData({ name:res.content })
          console.log(res.content)//用户输入的值
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  inputEdit3(e){
    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          this.setData({ birthday:res.content })
          console.log(res.content)//用户输入的值
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  inputEdit4(e){
    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          this.setData({ address:res.content })
          console.log(res.content)//用户输入的值
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  inputEdit5(e){
    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          this.setData({ email:res.content })
          console.log(res.content)//用户输入的值
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  inputEdit6(e){
    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          this.setData({ work:res.content })
          console.log(res.content)//用户输入的值
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  changeGender(e){
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
            gender:lp[res.tapIndex]
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
    var type=this.options.type
    console.log(type)
    var that=this
    wx.request({
      url: 'http://127.0.0.1:8080/chaxun4',
      data:{
        id:id,
        type:type
      },
      success:function(res){
          console.log(res.data)
          that.setData({
            chaxun1:res.data,
            
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