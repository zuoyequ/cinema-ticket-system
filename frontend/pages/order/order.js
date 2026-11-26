Page({
  data: {
    tab: [{name: '商品订单', isclick: true}, {name: '影票订单', isclick: false}],
    active: 0, isOpen: false, notifications: [], shopping_order: [], ticketList: [],
    ticketLoading: false, ticketError: ''
  },
  onLoad(options) {
    this.setData({id: wx.getStorageSync('id') || options.id});
    if (Number(options.active) === 1) {
      this.setData({active: 1, tab: this.data.tab.map((item, i) => ({name: item.name, isclick: i === 1}))});
    }
  },
  onShow() {
    this.loadOrders();
    this.loadNotifications();
    clearInterval(this._notificationTimer);
    this._notificationTimer = setInterval(() => this.loadNotifications(), 5000);
  },
  loadOrders() {
    const id = wx.getStorageSync('id') || this.data.id;
    const type = wx.getStorageSync('user') || 1;
    if (!id) return;
    wx.request({
      url: 'http://127.0.0.1:8080/shopping_order', data: {id},
      success: (res) => {
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          this.setData({shopping_order: res.data, payment: res.data.length ? res.data[0].payment : ''});
        }
      }
    });
    this.setData({ticketLoading: true, ticketError: ''});
    wx.request({
      url: 'http://127.0.0.1:8080/ticket_orders', data: {id, type},
      success: (res) => {
        if (res.statusCode === 200 && Array.isArray(res.data)) this.setData({ticketList: res.data});
        else this.setData({ticketError: '影票订单加载失败，请重试'});
      },
      fail: () => this.setData({ticketError: '影票订单加载失败，请重试'}),
      complete: () => this.setData({ticketLoading: false})
    });
  },
  loadNotifications() {
    const id = wx.getStorageSync('id') || this.data.id;
    if (!id) return;
    wx.request({
      url: 'http://127.0.0.1:8080/order_notifications', data: {id},
      success: (res) => {
        if (res.statusCode === 200 && Array.isArray(res.data)) this.setData({notifications: res.data});
      }
    });
  },
  changetab(e) {
    const active = Number(e.currentTarget.dataset.index);
    this.setData({active, isOpen: false, tab: this.data.tab.map((item, i) => ({name: item.name, isclick: i === active}))});
    this.loadOrders();
  },
  edit() { this.setData({isOpen: true}); },
  trunFalse() { this.setData({isOpen: false}); },
  clickDefault(e) {
    const index = Number(e.currentTarget.dataset.index);
    const orders = this.data.shopping_order.slice();
    orders[index] = Object.assign({}, orders[index], {isDefault: !orders[index].isDefault});
    this.setData({shopping_order: orders, indexx: orders[index].id});
  },
  shouhuo(e) {
    wx.request({
      url: 'http://127.0.0.1:8080/update_order', data: {id: e.currentTarget.dataset.id},
      success: () => this.loadOrders()
    });
  },
  onHide() { clearInterval(this._notificationTimer); },
  onUnload() { clearInterval(this._notificationTimer); }
});
