import config from './config'
export default (url, data = {}, method = "GET") => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      header: {
        cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1):''
      },
      success: (res) => {
        //如果是登录请求，本地存储cookies
        if (data.isLogin) {
          wx.setStorage({
            key: 'cookies',
            data: res.cookies
          })
        }
        //console.log('请求成功', res)
        resolve(res.data)
      },
      fail: (err) => {
        //console.log('请求失败', err)
        reject(err)
      },
    })
  })
}