import request from '../../untils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList: [],
    topList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let bannerListData = await request('/banner', { type: 2 })
    this.setData({
      bannerList: bannerListData.banners
    })
    let recommendListData = await request('/personalized', { limit: 10 })
    //console.log(recommendListData);
    this.setData({
      recommendList: recommendListData.result
    })
    let index = 0
    let resultArr = []
    while (index < 5) {
      let topListData = await request('/top/list', { idx: index++ })
      //console.log(topListData);
      let topListItem = { name: topListData.playlist.name, tracks: topListData.playlist.tracks.slice(0, 3) }
      resultArr.push(topListItem)
      this.setData({
        topList: resultArr
      })

    }
  },
  goRecommend() {
    wx.navigateTo({
      url: '/songPackages/pages/recommendSong/recommendSong',
    })
  },
  gotoPlay(event) {
    let { song } = event.currentTarget.dataset
    wx.navigateTo({
      url: '/songPackages/pages/songDetail/songDetail?musicId=' + song
    })

  },
  toRecommendList(event) {
    let musicId = event.currentTarget.id
    wx.navigateTo({
      url: '/pages/recommendList/recommendList?id=' + musicId
    })
  },
  toPlayList(){
   wx.navigateTo({
     url: '/pages/playList/playList'
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