import PubSub from 'pubsub-js'
import request from '../../../untils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: [],
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageInfoSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login',
          });
        }
      })
    }
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    this.getRecommendList()
    //订阅来自音乐详情的信息

    PubSub.subscribe('switchtype', (msg, type) => {
      let { recommendList, index } = this.data
      if (type === 'prev') {
        (index == 0) && (index = recommendList.length)
        index -=1
      } else {
        (index ==recommendList.length-1) && (index==-1)
        index += 1
      }
      // 更新下标
      this.setData({
        index
      })
      let musicId = recommendList[index].id
      // 将musicId回传给songDetail页面
      PubSub.publish('musicId', musicId)
    })
  },
  async getRecommendList() {
    let result = await request('/recommend/songs')
    this.setData({
      recommendList: result.recommend
    })
  },
  goSongDetail(event) {
    let { song, index } = event.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/songPackages/pages/songDetail/songDetail?musicId=' + song
    })
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