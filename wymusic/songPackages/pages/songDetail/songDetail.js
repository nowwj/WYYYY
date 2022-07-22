import PubSub from 'pubsub-js';
import moment from 'moment'
import request from '../../../untils/request'
// 获取全局实例
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    song: {},
    musicId: '',
    musicLink: '',
    currentTime: '00:00',
    totalTime: '00:00',
    currentwidth: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId
    this.setData({
      musicId
    })
    this.getMusicInfo(musicId)

    // 判断当前页面音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId == musicId) {
      this.setData({
        isPlay: true
      })
    }


    // 创建控制音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    // 监视音乐播放/暂停/停止
    this.backgroundAudioManager.onPlay(() => {
      this.changState(true)
      appInstance.globalData.musicId = musicId
    })
    this.backgroundAudioManager.onPause(() => {
      this.changState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      this.changState(false)
    })
    //播放结束切换下一首
    this.backgroundAudioManager.onEnded(() => {
      PubSub.publish('switchtype', 'next')
      this.setData({
        currentTime: '00:00',
        currentwidth: 0,
      })
    })
    //监听音乐播放进度
    this.backgroundAudioManager.onTimeUpdate(()=>{
      let currentTime =  moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss')
     let currentwidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*450
      this.setData({
        currentTime,
        currentwidth
      })
    })

  },
  //修改播放状态的功能函数
  changState(isPlay) {
    this.setData({
      isPlay
    })
    // 修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay = isPlay
  },
  //播放/暂停按钮的回调
  handlePlay() {
    let isPlay = !this.data.isPlay
    // this.setData({
    //   isPlay
    // })
    let { musicId, musicLink } = this.data
    this.musicControl(isPlay, musicId, musicLink)

  },
  //播放/暂停的函数
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {
      if (!musicLink) {
        let musicLinkData = await request('/song/url', { id: musicId })
        let musicLink = musicLinkData.data[0].url
        this.setData({
          musicLink
        })
      }
      this.backgroundAudioManager.src = this.data.musicLink
      this.backgroundAudioManager.title = this.data.song.name
    } else {
      this.backgroundAudioManager.pause()
    }
  },
  //获取音乐详情
  async getMusicInfo(musicId) {
    let result = await request('/song/detail', { ids: musicId })
    let totalTime = moment(result.songs[0].dt).format('mm:ss')
    this.setData({
      song: result.songs[0],
      totalTime
    })
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },
  // 切歌的回调
  handleSwitch(event) {
    // 获取切歌的类型
    let type = event.currentTarget.id
    // 关闭当前播放的音乐
    this.backgroundAudioManager.stop();

    //发布切歌类型数据给推荐页面
    PubSub.publish('switchtype', type)
    // 订阅来自recommendSong页面发布的musicId消息
    PubSub.subscribe('musicId', (msg, musicId) => {
      //获取音乐详情
      this.getMusicInfo(musicId)
      //自动播放
      this.musicControl(true, musicId)
      // 取消订阅
      PubSub.unsubscribe('musicId');
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