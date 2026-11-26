// pages/another/cust-swiper/index.js
Page({

  data: {
    isSearch:true,
    isClear:false,
    val:'',
    tab:[
      {name:'3月7号',isclick:true},
      {name:'3月8号',isclick:false},
      {name:'3月9号',isclick:false},
      {name:'3月10号',isclick:false},
      {name:'3月11号',isclick:false},
      {name:'3月12号',isclick:false},

    ],
    active:'0',
    swiperList: [
      {
        type: 'image',
        url: '/icon/13 (2).jpg'
      },{
        type: 'image',
        url: '/icon/11 (2).jpg',
      },{
        type: 'image',
        url: '/icon/12 (2).jpg'
      },{
        type: 'image',
        url: '/icon/14(2).jpg'
      },{
        type: 'image',
        url: '/icon/15(2).jpg'
      },{
        type: 'image',
        url: '/icon/16（2）.jpg'
      },
      {
        type: 'image',
        url: '/icon/17（2）.jpg'
      },
      {
        type: 'image',
        url: '/icon/18(2).jpg'
      },
    ],
  },
  tuichu: function (ex) {
    wx.setStorageSync('user', 1)
                     wx.switchTab({
                     url: '../work-index2/work-index2',
                  });
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
  clearTap:function(e){
    this.setData({
      val:'',
      isSearch:true,
      isClear:false
    })
  },
  Detail(index){
    var that=this
   
    console.log(index)
    wx.request({
        url: 'http://127.0.0.1:8080/get_buyticket',
        data:{
            index:index,
        },
        success:function(res){
            console.log(res.data)
            that.setData({
              get_buyticket_list:res.data,
            });
        }
       })  
},
  onLoad: function (options) {
    var index = this.options.index;  
    console.log(index); 
    this.Detail(index);
    this.tauchSwiper('swiperList',index);
    this.setData({
      index:index,
    })
  },

  onShow: function () {

  },
  // 初始化tauchSwiper
  tauchSwiper(name,index) {
    let list = this.data[name];
    var that=this.index
    console.log(list);
    console.log(index);
    for (let i = 0; i < list.length; i++) {
      // Math.abs(x) 函数返回指定数字 “x“ 的绝对值
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i-parseInt(list.length / 2)
    }
    if(index-1<list.length/2){
      for(let j=1;j<=list.length/2-index+1;j++){
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
    }
    this.setData({
      swiperList: list
    })
  }else{
    for(let j=1;j<=index-1-list.length;j++){
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  }
  },
  // tauchSwiper触摸开始
  tauchStart(e) {
    this.setData({
      tauchStart: e.touches[0].pageX
    })
  },
  // tauchSwiper计算方向
  tauchMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.tauchStart > 0 ? 'right' : 'left'
    })
  },
  // tauchSwiper计算滚动
  tauchEnd(e) {
    var that=this;
    
    
    var index=e.currentTarget.dataset.index;
    console.log("dd"+index)
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      if(index==1){
        index=list.length+1
      }
      this.setData({
        swiperList: list,
        index:--index,
      })
      
      console.log(index)
      
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      if(index==list.length){
        index=0;
      }
      this.setData({
        swiperList: list,
        index:++index,
      })
      console.log(index)
    }
    var that=this
    wx.request({
      url: 'http://127.0.0.1:8080/get_buyticket',
      data:{
          index:index,
      },
      success:function(res){
          
          console.log(res.data)
          that.setData({
            get_buyticket_list:res.data,
          });
      }
     })  
  },
  buyTicket(e){
    var movie_name=e.currentTarget.dataset.movie_name;
    var time_start=e.currentTarget.dataset.time_start;
    var time=e.currentTarget.dataset.time;
    console.log("3月7号，13：40"+movie_name+time_start+time);
    wx.navigateTo({
      url: '/pages/seat/seat?showId='+e.currentTarget.dataset.showId+'&time_start='+encodeURIComponent(time_start)+'&time='+encodeURIComponent(time)+'&movie_name='+encodeURIComponent(movie_name),
    })
  }
})
