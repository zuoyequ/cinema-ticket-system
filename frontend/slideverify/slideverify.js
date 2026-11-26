Component({
    /**
     * 组件的属性列表
     */
    properties: {
        //是否允许关闭
        enableClose: {
            type: Boolean,
            value: true
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        backImg: [
            '/icon/01.jpg',
            '/icon/02.jpg',
            '/icon/jtmd.jpg'
        ],
        backIndex: 0,
        isShow: true,
        isMove: false, //是否移动中
        status: -1, //状态 -1 初始值，1，成功，0 失败
        box: {
            width: 100,
            height: 100,
            back:''
        }, //背景框大小
        position: {
            left: 200,
            top: 29,
            left2: 0,
        } //滑块位置
    },
    /**
     * 组件的方法列表
     */
    methods: {
        //事件绑定
        //滑块事件
        startClick(e) {
            if (this.data.status >= 0 || !this.data.isShow || !e.touches.length) return;
            this.setData({
                isMove: true
            });
            if (e.touches.length > 0) {
                this._startX = e.touches[0].pageX - this.data.position.left2;
            }
        },
        moveClick(e) {
            if (!this.data.isMove || !e.touches.length) return;
            var _this = this;
            var newX = 0;
            if (e.touches.length > 0) {
                newX = e.touches[0].pageX;
            }
            var span = newX - this._startX;
            span = Math.max(span, 0);
            span = Math.min(span, _this.data.box.width - 50);
            _this.setData({
                'position.left2': span
            });
        },
        endClick() {
            if (!this.data.isMove) return;
            var _this = this;
            //处理结果判断
            var position = _this.data.position;
            var span = Math.abs(position.left2 - position.left);
            // console.info(span);
            if (span > 3) {
                _this.setData({
                    isMove: false,
                    status: 0
                });
                this._resultTimer = setTimeout(() => {
                    _this.refereshClick();
                }, 1000);
                //触发失败
                _this.triggerEvent('onerror', {}, {
                    bubbles: false,
                    composed: false
                });
            } else {
                _this.setData({
                    isMove: false,
                    status: 1
                });
                //1秒后关闭
                this._resultTimer = setTimeout(() => {
                    _this.setData({
                        isShow: false
                    });
                }, 1000);
                //触发成功
                _this.triggerEvent('onsuccess', {}, {
                    bubbles: false,
                    composed: false
                });
            }
        },
        //刷新
        refereshClick() {
            clearTimeout(this._resultTimer);
            var _this = this;
            var box = this.data.box;
            //随机宽度，高度
            var left = Math.round(Math.random() * (box.width - 100)) + 50;
            var top = Math.round(Math.random() * Math.max(0, box.height - 80)) + 20;
            var backIndex = (this.data.backIndex + 1) % this.data.backImg.length;
            _this.setData({
                'position.left': left,
                'position.top': top,
                'position.left2': 0,
                status: -1,
                isMove: false,
                backIndex: backIndex,
                'box.back':_this.data.backImg[backIndex]
            });
        },
        cancelClick() {
            this.setData({ isMove: false, 'position.left2': 0 });
        },
        //关闭
        closeClick() {
            clearTimeout(this._resultTimer);
            this.setData({
                isShow: false,
                isMove: false
            });
            this.triggerEvent('onclose', {}, { bubbles: false, composed: false });
        }
    },
    lifetimes: {
      
        ready() {
            var _this = this;
            //获取系统信息计算图片宽度高度
            wx.getSystemInfo({
                success: (result) => {
                    var width = result.windowWidth - 20 - 20;
                    var height = width / 16 * 9;
                    _this.setData({
                        box: {
                            width: width,
                            height: height
                        }
                    });
                    //随机初始化位置
                    _this.refereshClick();
                },
            })
        },
        detached() {
            clearTimeout(this._resultTimer);
        }
    }
})
