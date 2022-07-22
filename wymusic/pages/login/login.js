// pages/login/login.js
import request from '../../untils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //输入的回调
  handleInput(event) {
    let type = event.currentTarget.id
    this.setData({
      [type]: event.detail.value
    })
  },
  //登录按钮的回调
  async login() {
    let { phone, password } = this.data
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return;
    }
    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return;
    }
    let result = await request('/login/cellphone', { phone, password ,isLogin:true})
    if (result.code == 200) {
      wx.showToast({
        title: '登录成功',
      })
      wx.setStorageSync('userInfo',JSON.stringify(result.profile))
      //页面跳转
      wx.reLaunch({
        url: '/pages/personal/personal'
      })
    } else if (result.code == 400) {
      wx.showToast({
        title: '手机号码不正确',
        icon: 'none'
      })
    } else if (result.code == 502) {
      wx.showToast({
        title: '密码输入不正确',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '登录错误，请重试',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})