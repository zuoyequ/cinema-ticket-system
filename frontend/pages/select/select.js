// 下拉弹窗选择列表
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    selectData: {
      type: Array,
      value: [],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    index: 0 //选择的下拉列表下标
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //展示或隐藏弹框
    selectTap: function () {
      console.log("显示==》")
      this.setData({
        show: !this.data.show
      })
    },

    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _optionTap(e) {
      //触发取消回调
      // console.log("回调optionTap==》", e.currentTarget.dataset.index)
      this.setData({
        index: e.currentTarget.dataset.index
      })
      this.selectTap() //展示或隐藏弹框
      // 为了能在indes里面拿到选择了哪个项而加入  selectId
      this.triggerEvent("optionTap",{'selectId':e.currentTarget.dataset.index})
    },

  }
})
