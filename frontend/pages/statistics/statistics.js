// pages/statistics/statistics.js
import * as echarts from '../../ec-canvas/echarts'
function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 解决小程序视图模糊的问题
  });
  canvas.setChart(chart);

  var option = {
    title: {
      text: '用户活跃度', // 主标题文本，支持使用 \n 换行
      top: 10, // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
      left: 'center', // 值: 'left', 'center', 'right' 同上
      textStyle: { // 文本样式
        fontSize: 16,
        fontWeight: 600,
        color: '#000'
      }
    },
    // 设置图表的位置
    grid: {
      x: 5, // 左间距
      y: 70, // 上间距
      x2: 8, // 右间距
      y2: 10, // 下间距
      containLabel: true // grid 区域是否包含坐标轴的刻度标签, 常用于『防止标签溢出』的场景
    },
    // dataZoom 组件 用于区域缩放
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0], // 设置 dataZoom-inside 组件控制的 x 轴
        // 数据窗口范围的起始和结束百分比  范围: 0 ~ 100
        start: 0,
        end: 30
      }
    ],
    tooltip: {
      trigger: 'axis', // 触发类型, axis: 坐标轴触发
      axisPointer: {
        type: 'none' // 指示器类型，可选 'line'、'shadow'、'none'、'cross'
      },
      // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
      // 折线（区域）图、柱状（条形）图、K线图 : {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
      formatter: '{b}\n{a0}: {c0}万\n{a1}: {c1}%'
    },
    legend: { // 图例的数据数组
      data: [ // 图例项的名称 与 series 里的 name 相对应
        { name: '人数' },
        { name: '占比' }
      ],
      itemWidth: 13, // 图例标记的图形宽度
      itemHeight: 13, // 图例标记的图形高度
      // 图例项的 icon  值: 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
      icon: 'roundRect', 
      top: 33, // 定位
      right: 5,
      textStyle: { // 文本样式
        fontSize: 13,
        color: '#000'
      }
    },
    xAxis: {
      // 坐标轴轴线
      axisLine: {
        lineStyle: {
          type: 'solid', // 坐标轴线线的类型 'solid', 'dashed', 'dotted'
          width: 1, // 坐标轴线线宽, 不设置默认值为 1
          color: '#000' // 坐标轴线线的颜色
        }
      },
      // 坐标轴刻度
      axisTick: {
        show: false
      },
      // 分隔线
      splitLine: {
        show: false
      },
      // 坐标轴刻度标签
      axisLabel: {
        fontSize: 12, // 文字的字体大小
        color: '#000', // 刻度标签文字的颜色
        // 使用函数模板   传入的数据值 -> value: number|Array,
        formatter: '{value}'
      },
      data: ['3-26','3-27','3-28','3-29','3-30','3-31','4-1','4-2','4-3','4-4','4-5','4-6']
    },
    yAxis: [{
      type: 'value', // 坐标轴类型,   'value' 数值轴，适用于连续数据
      name: '单位/万', // 坐标轴名称
      nameLocation: 'end', // 坐标轴名称显示位置 'start', 'middle' 或者 'center', 'end'
      nameTextStyle: { // 坐标轴名称的文字样式
        align: 'center', // 文字水平对齐方式，默认自动,可选 'left'、'center'、'right'
        fontSize: 12, // 坐标轴名称文字的字体大小
        fontStyle: 'normal', // 坐标轴名称文字字体的风格, 可选 'normal'、'italic'、'oblique'
        // 坐标轴名称文字字体的粗细, 可选 'normal'、'bold'、'bolder'、'lighter'、100 | 200 | 300 | 400...
        fontWeight: 'normal'
      },
      nameGap: 15, // 坐标轴名称与轴线之间的距离
      // 坐标轴刻度
      axisTick: {
        show: true // 是否显示坐标轴刻度 默认显示
      },
      // 坐标轴轴线
      axisLine: { // 是否显示坐标轴轴线 默认显示
        show: true, // 是否显示坐标轴轴线 默认显示
        lineStyle: { // 坐标轴线线的颜色
          color: '#000'
        }
      },
      // 坐标轴在图表区域中的分隔线
      splitLine: {
        show: false // 是否显示分隔线。默认数值轴显示
      },
      // 坐标轴刻度标签
      axisLabel: {
        show: true, // 是否显示刻度标签 默认显示
        fontSize: 13, // 文字的字体大小
        color: '#000', // 刻度标签文字的颜色
        // 使用字符串模板，模板变量为刻度默认标签 {value}
        formatter: '{value}'
      }
    },
    // 右侧Y轴
    {
      // 坐标轴刻度
      axisTick: {
        show: true // 是否显示坐标轴刻度 默认显示
      },
      // 坐标轴轴线
      axisLine: { // 是否显示坐标轴轴线 默认显示
        show: true, // 是否显示坐标轴轴线 默认显示
        lineStyle: { // 坐标轴线线的颜色
          color: '#000'
        }
      },
      // 坐标轴在图表区域中的分隔线
      splitLine: {
        show: false // 是否显示分隔线 默认数值轴显示
      },
      axisLabel: {
        show: true,
        fontSize: 13,
        color: '#000',
        // 使用字符串模板，模板变量为刻度默认标签 {value}
        formatter: '{value}%'
      }
    }],
    // 系列列表
    series: [
      {
        type: 'bar', // 系列类型
        name: '人数', // 系列名称, 用于tooltip的显示, legend 的图例筛选
        barMaxWidth: 12, // 柱条的最大宽度，不设时自适应
        barGap: 0, // 不同系列的柱间距离, 为百分比  默认值为30%
        // 图形上的文本标签
        label: {
          show: false,
          fontSize: 13,
          color: '#fff'
        },
        // 图形样式
        itemStyle: {
          // 柱条的颜色, 这里是渐变色, 默认从全局调色盘 option.color 获取颜色
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#FAB363' // 0% 处的颜色
            }, {
              offset: 1,
              color: '#FB7C2B' // 100% 处的颜色
            }]
          },
          barBorderRadius: [10, 10, 0, 0] // 圆角半径, 单位px, 支持传入数组分别指定 4 个圆角半径
        },
        // 系列中的数据内容数组
        data: [2, 3.3, 4, 6, 8.3, 6.5, 6.9, 4.3, 5.5, 4.2, 4.2, 3.2]
      },
      {
        type: 'line', // 系列类型
        name: '占比', // 系列名称, 用于tooltip的显示, legend 的图例筛选
        symbol: 'circle', // 标记的图形
        symbolSize: 11, // 标记的大小
        yAxisIndex: 1, // 使用的 y 轴的 index，在单个图表实例中存在多个 y 轴的时候有用
        // 图形的样式
        itemStyle: {
          color: '#11abff'
        },
        // 线的样式, 修改 lineStyle 中的颜色不会影响图例颜色, 一般不设置线的样式
        lineStyle: {
          type: 'solid', // 线的类型 'solid', 'dashed', 'dotted'
          color: '#11abff'
        },
        // 图形上的文本标签
        label: {
          show: false,
          fontSize: 13,
          color: '#fff'
        },
        // 系列中的数据内容数组
        data: [20, 24, 33, 45, 63, 50, 42, 24, 23, 14, 20, 10]
      }
    ]
  };
  chart.setOption(option);
  return chart;
}
function aChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 解决小程序视图模糊的问题
  });
  canvas.setChart(chart);

  var option = {
    title: {
      text: '月销售额', // 主标题文本，支持使用 \n 换行
      top: 10, // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
      left: 'center', // 值: 'left', 'center', 'right' 同上
      textStyle: { // 文本样式
        fontSize: 16,
        fontWeight: 600,
        color: '#000'
      }
    },
    // 设置图表的位置
    grid: {
      x: 5, // 左间距
      y: 70, // 上间距
      x2: 8, // 右间距
      y2: 10, // 下间距
      containLabel: true // grid 区域是否包含坐标轴的刻度标签, 常用于『防止标签溢出』的场景
    },
    // dataZoom 组件 用于区域缩放
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0], // 设置 dataZoom-inside 组件控制的 x 轴
        // 数据窗口范围的起始和结束百分比  范围: 0 ~ 100
        start: 0,
        end: 30
      }
    ],
    tooltip: {
      trigger: 'axis', // 触发类型, axis: 坐标轴触发
      axisPointer: {
        type: 'none' // 指示器类型，可选 'line'、'shadow'、'none'、'cross'
      },
      // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
      // 折线（区域）图、柱状（条形）图、K线图 : {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
      formatter: '{b}\n{a0}: {c0}元\n{a1}: {c1}%'
    },
    legend: { // 图例的数据数组
      data: [ // 图例项的名称 与 series 里的 name 相对应
        { name: '销售额' },
        { name: '增长率' }
      ],
      itemWidth: 13, // 图例标记的图形宽度
      itemHeight: 13, // 图例标记的图形高度
      // 图例项的 icon  值: 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
      icon: 'roundRect', 
      top: 33, // 定位
      right: 5,
      textStyle: { // 文本样式
        fontSize: 13,
        color: '#000'
      }
    },
    xAxis: {
      // 坐标轴轴线
      axisLine: {
        lineStyle: {
          type: 'solid', // 坐标轴线线的类型 'solid', 'dashed', 'dotted'
          width: 1, // 坐标轴线线宽, 不设置默认值为 1
          color: '#000' // 坐标轴线线的颜色
        }
      },
      // 坐标轴刻度
      axisTick: {
        show: false
      },
      // 分隔线
      splitLine: {
        show: false
      },
      // 坐标轴刻度标签
      axisLabel: {
        fontSize: 12, // 文字的字体大小
        color: '#000', // 刻度标签文字的颜色
        // 使用函数模板   传入的数据值 -> value: number|Array,
        formatter: '{value}'
      },
      data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
    },
    yAxis: [{
      type: 'value', // 坐标轴类型,   'value' 数值轴，适用于连续数据
      name: '单位/元', // 坐标轴名称
      nameLocation: 'end', // 坐标轴名称显示位置 'start', 'middle' 或者 'center', 'end'
      nameTextStyle: { // 坐标轴名称的文字样式
        align: 'center', // 文字水平对齐方式，默认自动,可选 'left'、'center'、'right'
        fontSize: 12, // 坐标轴名称文字的字体大小
        fontStyle: 'normal', // 坐标轴名称文字字体的风格, 可选 'normal'、'italic'、'oblique'
        // 坐标轴名称文字字体的粗细, 可选 'normal'、'bold'、'bolder'、'lighter'、100 | 200 | 300 | 400...
        fontWeight: 'normal'
      },
      nameGap: 15, // 坐标轴名称与轴线之间的距离
      // 坐标轴刻度
      axisTick: {
        show: true // 是否显示坐标轴刻度 默认显示
      },
      // 坐标轴轴线
      axisLine: { // 是否显示坐标轴轴线 默认显示
        show: true, // 是否显示坐标轴轴线 默认显示
        lineStyle: { // 坐标轴线线的颜色
          color: '#000'
        }
      },
      // 坐标轴在图表区域中的分隔线
      splitLine: {
        show: false // 是否显示分隔线。默认数值轴显示
      },
      // 坐标轴刻度标签
      axisLabel: {
        show: true, // 是否显示刻度标签 默认显示
        fontSize: 13, // 文字的字体大小
        color: '#000', // 刻度标签文字的颜色
        // 使用字符串模板，模板变量为刻度默认标签 {value}
        formatter: '{value}'
      }
    },
    // 右侧Y轴
    {
      // 坐标轴刻度
      axisTick: {
        show: true // 是否显示坐标轴刻度 默认显示
      },
      // 坐标轴轴线
      axisLine: { // 是否显示坐标轴轴线 默认显示
        show: true, // 是否显示坐标轴轴线 默认显示
        lineStyle: { // 坐标轴线线的颜色
          color: '#000'
        }
      },
      // 坐标轴在图表区域中的分隔线
      splitLine: {
        show: false // 是否显示分隔线 默认数值轴显示
      },
      axisLabel: {
        show: true,
        fontSize: 13,
        color: '#000',
        // 使用字符串模板，模板变量为刻度默认标签 {value}
        formatter: '{value}%'
      }
    }],
    // 系列列表
    series: [
      {
        type: 'bar', // 系列类型
        name: '销售额', // 系列名称, 用于tooltip的显示, legend 的图例筛选
        barMaxWidth: 12, // 柱条的最大宽度，不设时自适应
        barGap: 0, // 不同系列的柱间距离, 为百分比  默认值为30%
        // 图形上的文本标签
        label: {
          show: false,
          fontSize: 13,
          color: '#fff'
        },
        // 图形样式
        itemStyle: {
          // 柱条的颜色, 这里是渐变色, 默认从全局调色盘 option.color 获取颜色
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#FAB363' // 0% 处的颜色
            }, {
              offset: 1,
              color: '#FB7C2B' // 100% 处的颜色
            }]
          },
          barBorderRadius: [10, 10, 0, 0] // 圆角半径, 单位px, 支持传入数组分别指定 4 个圆角半径
        },
        // 系列中的数据内容数组
        data: [2000, 3300, 4000, 6000, 8300, 6500, 6900, 4300, 5500, 4200, 4200, 3020]
      },
      {
        type: 'line', // 系列类型
        name: '增长率', // 系列名称, 用于tooltip的显示, legend 的图例筛选
        symbol: 'circle', // 标记的图形
        symbolSize: 11, // 标记的大小
        yAxisIndex: 1, // 使用的 y 轴的 index，在单个图表实例中存在多个 y 轴的时候有用
        // 图形的样式
        itemStyle: {
          color: '#11abff'
        },
        // 线的样式, 修改 lineStyle 中的颜色不会影响图例颜色, 一般不设置线的样式
        lineStyle: {
          type: 'solid', // 线的类型 'solid', 'dashed', 'dotted'
          color: '#11abff'
        },
        // 图形上的文本标签
        label: {
          show: false,
          fontSize: 13,
          color: '#fff'
        },
        // 系列中的数据内容数组
        data: [65, 21.2, 50, 38.3, -21.6, 6.1, -37.6, 26.6, -23.6, 0, -28, 0]
      }
    ]
  };
  chart.setOption(option);
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart // 初始化并设置
    },
    ac: {
      onInit: aChart // 初始化并设置
    },
    ellipsis:true,
    rankList1:[
      {rank:1,seat:'五排5座',count:732,percent:70},
      {rank:2,seat:'六排5座',count:726,percent:68},
      {rank:3,seat:'五排6座',count:699,percent:66}
    ],
    rankList2:[
      {rank:1,seat:'五排5座',count:732,percent:70},
      {rank:2,seat:'六排5座',count:726,percent:68},
      {rank:3,seat:'五排6座',count:699,percent:66},
      {rank:4,seat:'五排4座',count:659,percent:63},
      {rank:5,seat:'六排4座',count:623,percent:59},
      {rank:6,seat:'六排6座',count:601,percent:54},
      {rank:7,seat:'四排5座',count:583,percent:50},
      {rank:8,seat:'四排6座',count:545,percent:45},
      {rank:9,seat:'四排7座',count:512,percent:43},
      {rank:10,seat:'五排7座',count:497,percent:39},
    ],
    piaofList:[
      {rank:1,name:'孤注一掷',time:'2023-8-11',sum:577534,count:37},
      {rank:2,name:'寒战',time:'2021-9-30',sum:569454,count:22},
      {rank:3,name:'流浪地球',time:'2019-2-15',sum:468736,count:29},
      {rank:4,name:'满江红',time:'2023-1-22',sum:454435,count:24}
    ],
    shopList:[
      {rank:1,name:'漫威钢铁侠反浩克装甲雕塑MK7MK50模型手办',sum:15595,count:5},
      {rank:2,name:'可爱松鼠小玩偶',sum:2666,count:43},
      {rank:3,name:'从零开始的异世界生活和服雷姆手办',sum:2580,count:30},
      {rank:4,name:'5m高RICO来了！现场拆盲盒，还能拍大片！',sum:1806,count:21}
    ],
    tab:[
      {name:'影票数据',isclick:true},
      {name:'商品数据',isclick:false},
    ],
    active:'0',
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
  ellipsis: function () {  
    this.setData({
      ellipsis: !this.data.ellipsis
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