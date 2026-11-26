Page({
  data: {
    show: null, seats: [], rowLabels: [],
    radios: [1, 2, 3, 4, 5], radioStr: 1,
    selectedIndex: [], selectedNum: 0, selectedText: '',
    totalPrice: '0.00', buying: false, confirming: false, loading: true, error: ''
  },
  onLoad(options) {
    if (Number(options.showId) > 0) {
      this.loadShow(Number(options.showId));
      return;
    }
    wx.request({
      url: 'http://127.0.0.1:8080/get_moviecontent2',
      data: {time: options.time, time_start: options.time_start, movie_name: options.movie_name},
      success: (res) => {
        if (res.statusCode === 200 && Array.isArray(res.data) && res.data.length && res.data[0].buy_id) {
          this.loadShow(res.data[0].buy_id);
        } else this.setData({loading: false, error: '场次不存在，请返回重新选择'});
      },
      fail: () => this.setData({loading: false, error: '场次加载失败，请稍后重试'})
    });
  },
  onShow() {
    if (this.data.show && !this.data.buying) this.loadSeats();
  },
  loadShow(showId) {
    wx.request({
      url: 'http://127.0.0.1:8080/ticket_show', data: {id: showId},
      success: (res) => {
        if (res.statusCode !== 200 || !res.data.buy_id) {
          this.setData({loading: false, error: '场次加载失败，请返回重选'});
          return;
        }
        const price = String(wx.getStorageSync('user') == 2 ? res.data.vip_price : res.data.price).match(/\d+(?:\.\d{1,2})?/);
        this._unitPrice = price ? Number(price[0]) : 0;
        this.setData({show: res.data, error: ''});
        this.loadSeats();
      },
      fail: () => this.setData({loading: false, error: '场次加载失败，请稍后重试'})
    });
  },
  loadSeats() {
    this.setData({loading: true});
    wx.request({
      url: 'http://127.0.0.1:8080/ticket_seats', data: {showId: this.data.show.buy_id},
      success: (res) => {
        if (res.statusCode !== 200 || !Array.isArray(res.data)) {
          this.setData({error: '座位加载失败，请重试'});
          return;
        }
        this.setData({
          seats: res.data, rowLabels: Array.from({length: Math.ceil(res.data.length / 9)}, (_, i) => i + 1),
          selectedIndex: [], selectedNum: 0, selectedText: '', totalPrice: '0.00', error: ''
        });
      },
      fail: () => this.setData({error: '座位加载失败，请重试'}),
      complete: () => this.setData({loading: false})
    });
  },
  retry() {
    if (this.data.show) this.loadSeats();
    else this.onLoad(this.options);
  },
  radioChange(e) {
    const count = Number(e.detail.value);
    if (this.data.buying || this.data.confirming) return;
    const seats = this.data.seats.map(seat => Object.assign({}, seat, {state: seat.state === 2 ? 1 : seat.state}));
    this._requestId = null;
    this.setData({radioStr: count, seats, selectedIndex: [], selectedNum: 0, selectedText: '', totalPrice: '0.00'});
  },
  selected(e) {
    if (this.data.loading || this.data.buying || this.data.confirming) return;
    const index = Number(e.currentTarget.dataset.index);
    const seat = this.data.seats[index];
    if (!seat || seat.state === 3) return;
    let selectedIndex = this.data.selectedIndex.slice();
    if (selectedIndex.includes(index)) selectedIndex = selectedIndex.filter(value => value !== index);
    else {
      if (selectedIndex.length >= this.data.radioStr) {
        wx.showToast({title: '超出人数限制', icon: 'none'});
        return;
      }
      selectedIndex.push(index);
    }
    const seats = this.data.seats.map((item, i) => Object.assign({}, item, {
      state: item.state === 3 ? 3 : selectedIndex.includes(i) ? 2 : 1
    }));
    this._requestId = null;
    this.setData({
      seats, selectedIndex, selectedNum: selectedIndex.length,
      selectedText: selectedIndex.map(i => seats[i].row + '排' + seats[i].column + '座').join('、'),
      totalPrice: (this._unitPrice * selectedIndex.length).toFixed(2)
    });
  },
  buyll() {
    if (this.data.buying || this.data.confirming || this.data.loading) return;
    if (!this.data.selectedNum) { wx.showToast({title: '请先选择座位', icon: 'none'}); return; }
    this.setData({confirming: true});
    wx.showModal({
      title: '确认购票',
      content: this.data.show.movie_name + '，' + this.data.selectedText + '，合计 ¥' + this.data.totalPrice + '。',
      confirmText: '确认预订',
      success: (res) => { this.setData({confirming: false}); if (res.confirm) this.submitBooking(); },
      fail: () => this.setData({confirming: false})
    });
  },
  submitBooking() {
    if (this.data.buying) return;
    const userId = Number(wx.getStorageSync('id'));
    const userType = Number(wx.getStorageSync('user'));
    if (!userId || !userType) { wx.showToast({title: '请先登录', icon: 'none'}); return; }
    if (!this._requestId) this._requestId = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
    this.setData({buying: true});
    wx.request({
      url: 'http://127.0.0.1:8080/ticket_orders', method: 'POST',
      header: {'content-type': 'application/json'},
      data: {
        userId, userType, showId: this.data.show.buy_id, requestId: this._requestId,
        seatIds: this.data.selectedIndex.map(i => this.data.seats[i].id)
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.id) {
          this._requestId = null;
          this.loadSeats();
          wx.showModal({
            title: '预订成功', content: '影票订单 #' + res.data.id + ' 已保存。',
            confirmText: '查看订单', cancelText: '继续选座',
            success: (result) => {
              if (result.confirm) wx.navigateTo({url: '/pages/order/order?active=1'});
            }
          });
        } else {
          wx.showModal({title: '购票未成功', content: res.data.message || '请稍后重试', showCancel: false});
          if (res.statusCode === 409) { this._requestId = null; this.loadSeats(); }
        }
      },
      fail: () => wx.showToast({title: '连接失败，请重试或查看订单', icon: 'none'}),
      complete: () => this.setData({buying: false})
    });
  }
});
