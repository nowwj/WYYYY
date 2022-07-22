import request from '../../untils/request'
let isSend = false; // 函数节流使用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '',
    hotList: [],
    searchContent: '',
    searchList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData()
  },
  async getInitData() {
    let placeholderData = await request('/search/default')
    let hostData = await request('/search/hot/detail')
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hostData.data
    })
  },
  // 表单项内容发生改变的回调
  handleInputChange(event) {
    this.setData({
      searchContent: event.detail.value.trim()
    })
    if (isSend) {
      return
    }
    isSend = true;
    this.getSearchList();
    // 函数节流
    setTimeout(() => {
      isSend = false;
    }, 300)

  },
  // 获取搜索数据的功能函数
  async getSearchList() {
    //搜素不为空
    if (!this.data.searchContent) {
      this.setData({
        searchList: []
      })
      return;
    }
    let { searchContent } = this.data;
    let searchListData = await request('/search', { keywords: searchContent, limit: 10 });
    this.setData({
      searchList: searchListData.result.songs
    })

  },
  //取消搜索的回调
  cancelSearch() {
    this.setData({
      searchContent: '',
      searchList: [],
    })
  },
   // 清空搜索内容
   clearSearchContent(){
    this.setData({
      searchContent: '',
      searchList: []
    })
  },
  //跳转播放页面
  goDetail(event){
     let {song} = event.currentTarget.dataset
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