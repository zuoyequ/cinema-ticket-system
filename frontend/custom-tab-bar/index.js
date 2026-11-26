// custom-tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
allList:[
    [{
      "pagePath": "/pages/work-index/work-index",
      "text": "首页",
      "iconPath": "/icon/home.png",
      "selectedIconPath": "/icon/home_.png",
      "selected":"00"
    },
    {
      "pagePath": "/pages/unity/unity",
      "text": "游戏",
      "iconPath": "/icon/work.png",
      "selectedIconPath": "/icon/work_.png",
      "selected":"01"
    },
    {
      "pagePath": "/pages/me/me",
      "text": "我的",
      "iconPath": "/icon/mine.png",
      "selectedIconPath": "/icon/mine_.png",
      "selected":"02"
    }],
    [
      {
        "pagePath": "/pages/work-index2/work-index2",
        "text": "首页",
        "iconPath": "/icon/home.png",
        "selectedIconPath": "/icon/home_.png",
        "selected":"03"
      },
      {
        "pagePath": "/pages/unity/unity",
        "text": "游戏",
        "iconPath": "/icon/work.png",
        "selectedIconPath": "/icon/work_.png",
        "selected":"01"
      },
      {
        "pagePath": "/pages/me2/me2",
        "text": "我的",
        "iconPath": "/icon/mine.png",
        "selectedIconPath": "/icon/mine_.png",
        "selected":"04"
      }
    ],
    [{
      "pagePath": "/pages/work-index3/work-index3",
      "text": "首页",
      "iconPath": "/icon/home.png",
      "selectedIconPath": "/icon/home_.png",
      "selected":"05"
    },
    {
      "pagePath": "/pages/unity/unity",
      "text": "游戏",
      "iconPath": "/icon/work.png",
      "selectedIconPath": "/icon/work_.png",
      "selected":"01"
    },
    {
      "pagePath": "/pages/me3/me3",
      "text": "我的",
      "iconPath": "/icon/mine.png",
      "selectedIconPath": "/icon/mine_.png",
      "selected":"06"
    }]

],
selectList:[],
// 当前选中的 nav 标识（对应 allList 中的 selected 字段）
selected:"",
// 手动引入本组件时（me2/me3）没有框架注入的颜色配置，这里补上默认值
color:"#333",
selectedColor:"#007fff",
// 修正：微信规定 tabBar.list 最少 2 项、最多 5 项，
// 因此 me2/me3（会员、管理员的“我的”）改为普通页面，不在 tab 列表中，
// 这里记录真正的 tab 页路径，用于决定使用 switchTab 还是 redirectTo
tabPaths:[
  "/pages/work-index/work-index",
  "/pages/unity/unity",
  "/pages/me/me",
  "/pages/work-index2/work-index2",
  "/pages/work-index3/work-index3"
],
  },
attached(){
    // 按登录角色（wx.getStorageSync('user')）选择对应的三项底部导航
    var role = wx.getStorageSync('user');
    var selectList = [];
    if(role=="1"){
      selectList = this.data.allList[0];
    }else if(role=="2"){
      selectList = this.data.allList[1];
    }else if(role=="3"){
      selectList = this.data.allList[2];
    }

    // 按当前页面路径查找选中项，保证 tab 页和手动引入本组件的普通页面都能正确高亮
    var pages = getCurrentPages();
    var currentPath = pages.length ? '/' + pages[pages.length - 1].route : '';
    var currentItem = selectList.filter(function (item) {
      return item.pagePath === currentPath;
    })[0];

    this.setData({
      selectList: selectList,
      selected: currentItem ? currentItem.selected : ''
    });
},
  /**
   * 组件的方法列表
   */
  methods: {
    swichTo(e){
        var path = e.currentTarget.dataset.path;
        // 修正：me2/me3 不在 tabBar.list 中（微信最多 5 项），
        // 普通页面用 redirectTo 跳转（不保留页面栈，效果等同于切换 tab），
        // 其余页面仍用 switchTab，保留 tab 页的切换特性
        if (this.data.tabPaths.indexOf(path) > -1) {
          wx.switchTab({
            url: path,
          })
        } else {
          wx.redirectTo({
            url: path,
          })
        }
    }
  }
})
