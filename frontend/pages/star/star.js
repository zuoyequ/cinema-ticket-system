Page({
  data: {
    fullStarUrl: '/icon/huangxing.png', //满星图片
    nullStarUrl: '/icon/heixing.png', //空星图片
    score: 0, //评价分数
    scoreArray: [1, 2, 3, 4, 5], //分为1-5个评分层次
    scoreText: ['1星', '2星', '3星', '4星', '5星'], //评分列表
    scoreContent: '', //文字显示评分情况
    pinglun:''
  },
  onLoad(options) {
    const data = options.id;
    console.log(data+"------------"); // 打印传递过来的参数
    this.setData({
      id:data,
    })
    var that=this
       wx.request({
         url: 'http://127.0.0.1:8080/get_moviecontent',
          data:{id:data},
           success:function(res){
           that.setData({
            get_movie_comment:res.data
    })
      }
          })
  },
  changeScore: function(e) {
    var that = this;
    var num = 0;//临时数字,动态确定要传入的分数
    var touchX = e.touches[0].pageX;//获取当前触摸点X坐标
    var starMinX = 0;//最左边第一颗星的X坐标,假设距离页面距离为0
    var starWidth = 30;//星星图标的宽度,假设30(已在wxss文件中设置".star")
    var starLen = 10;//星星之间的距离假设为10(已在wxss文件中设置".starLen")
    var starMaxX = starWidth * 5 + starLen * 4;//最右侧星星最右侧的X坐标,需要加上5个星星的宽度和4个星星间距

    if (touchX > starMinX && touchX < starMaxX) {//点击及触摸的初始位置在星星所在空间之内
    //使用Math.ceil()方法取得当前触摸位置X坐标相对于(星星+星星间距)之比的整数,确定当前点击的是第几个星星
      num = Math.ceil((touchX - starMinX) / (starWidth + starLen));
      if (num != that.data.score) {//如果当前得分不等于刚设置的值,才赋值,因为touchmove方法刷新率很高,这样做可以节省点资源
        that.setData({
          score: num,
          scoreContent: that.data.scoreText[num - 1]
        })
      }
    } else if (touchX < starMinX) {//如果点击或触摸位置在第一颗星星左边,则恢复默认值,否则第一颗星星会一直存在
      that.setData({
        score: 0,
        scoreContent: ''
      })
    }
  },
  submit:function(e){
      var pinglun=e.detail.value.pinglun;
      var id=e.detail.value.id;
      var movie_name=e.detail.value.movie_name;
      var star=e.detail.value.star;
      console.log(pinglun);
      console.log(id);
      console.log(star);
      console.log(e.detail.value)
      wx.request({
        url: 'http://127.0.0.1:8080/insert_Aevaluate',
        data:{
            movie_name:movie_name,
            pinjia:pinglun,
            yonghu_name:"name4",//这里需要改成姓名
            star:star,
        },
        success:function(){
          wx.navigateTo({
                url:'../comment/comment?index='+id,
            })
        }
      })
  }
})


