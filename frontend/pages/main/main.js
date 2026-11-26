// 滑块校验仅用于本次登录，主页切换不创建验证码组件。
Page({
  data: {
    islogin: '1',
    loginbtnstate: 'true',
    telephone: '',
    password: '',
    type: '',
    btn_disabled: true,
    Number: true,
    text: '',
    showVerify: false,
    submitting: false
  },

  submitLogin(event) {
    if (this.data.showVerify || this.data.submitting) return;
    const form = event.detail.value;
    const telephone = (form.telephone || '').trim();
    const password = form.password || '';
    const type = String(form.type || '');
    if (!telephone || !password || ['1', '2', '3'].indexOf(type) < 0) {
      wx.showToast({ title: '请填写手机号、密码并选择角色', icon: 'none' });
      return;
    }
    // 密码不写入页面数据或本地存储，关闭/通过校验后清除本次待提交信息。
    this._pendingLogin = { telephone, password, type };
    this.setData({ showVerify: true });
  },

  verifySuccess() {
    const credentials = this._pendingLogin;
    if (!credentials || this.data.submitting) return;
    this._pendingLogin = null;
    this.setData({ showVerify: false, submitting: true });
    wx.request({
      url: 'http://127.0.0.1:8080/check_login',
      data: credentials,
      success: (res) => {
        if (res.statusCode !== 200 || !res.data || !res.data.id) {
          wx.showModal({ title: '登录失败', content: '手机号、密码或所选角色不正确，请重试。', showCancel: false });
          return;
        }
        getApp().globalData.myData = res.data;
        // 先保存登录信息，再切换首页，避免首页初始化读到上一个账号。
        wx.setStorageSync('user', credentials.type);
        wx.setStorageSync('id', res.data.id);
        const homePages = {
          '1': '/pages/work-index/work-index',
          '2': '/pages/work-index2/work-index2',
          '3': '/pages/work-index3/work-index3'
        };
        wx.switchTab({ url: homePages[credentials.type] });
        wx.showToast({ title: '登录成功', icon: 'success', duration: 900 });
      },
      fail: () => {
        wx.showToast({ title: '登录连接失败，请稍后重试', icon: 'none' });
      },
      complete: () => {
        this.setData({ submitting: false });
      }
    });
  },

  verifyError() {
    wx.showToast({ title: '验证失败，请重新滑动', icon: 'none' });
  },

  verifyClose() {
    this._pendingLogin = null;
    this.setData({ showVerify: false });
  },

  register() {
    wx.navigateTo({ url: '../register/register' });
  },

  onLoad() {
    getApp().globalData.myData = null;
    this._pendingLogin = null;
  },

  onHide() {
    this.verifyClose();
  },

  onUnload() {
    this._pendingLogin = null;
  }
});
