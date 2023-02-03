// pages/songDetail/songDetail.js
import PubSub from "pubsub-js"
import request from "../../../utils/request"
import moment from "moment"
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //是否播放
    song: {}, //歌曲详情对象
    musicId: "", //音乐ID
    musicLink: "", //音乐链接
    currentTime:"00:00",  //实时时间
    durationTime:"00:00",  //总时长
    currentWidth:0,  //实时进度条宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // options 用于接收路由传参的query值
    let musicId = options.musicId
    this.setData({
      musicId
    })
    // 获取歌曲详情
    this.getMusicInfo(musicId)

    //判断当前页面音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      //如果全局属性中显示该音乐在播放，则设置该音乐播放状态为true
      this.setData({
        isPlay: true
      })
    }
    // 创建音乐播放实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    // 监视音乐播放/暂停/停止
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true)
      // 设置全局音乐播放属性
      appInstance.globalData.musicId = musicId
    })
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false)
    })
    // 监听音乐自动播放结束
    this.backgroundAudioManager.onEnded(()=>{
      //自动切换下一首
      PubSub.publish("switchType", "next")
      //设置进度条为0
      // this.setData({
      //   currentTime:"00:00",
      //   currentWidth:0
      // })
    })
    //监听音乐播放，进度条更新
    this.backgroundAudioManager.onTimeUpdate(()=>{
      //将时间转化为ms
      let currentTime=moment(this.backgroundAudioManager.currentTime*1000).format("mm:ss")
      let currentWidth=(this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration)*450;
      this.setData({
        currentTime,currentWidth
      })
    })
  },

  // 封装修改播放状态的功能函数
  changePlayState(isPlay) {
    // 修改音乐的播放状态
    this.setData({
      isPlay
    })
    //修改全局音乐的播放状态
    appInstance.globalData.isMusicPlay = isPlay
  },
  // 获取歌曲详情的函数
  async getMusicInfo(musicId) {
    let songData = await request("/song/detail", {
      ids: musicId
    })
    console.log(songData);
    // songData.songs[0].dt 数据中的总时长单位为ms
    let durationTime=moment(songData.songs[0].dt).format("mm:ss")
    this.setData({
      song: songData.songs[0],
      durationTime
    })
  },

  // 点击播放/暂停的回调函数
  handleMusicPlay() {
    let isPlay = !this.data.isPlay
    // this.setData({
    //   isPlay
    // })
    let {
      musicId,
      musicLink
    } = this.data
    this.musicControl(isPlay, musicId, musicLink);
  },

  //控制音乐暂停播放的功能函数
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {
      if (!musicLink) {
        // 获取音乐播放链接
        let musicLinkData = await request("/song/url", {
          id: musicId
        })
        musicLink = musicLinkData.data[0].url
        this.setData({
          musicLink
        })
      }
      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.song.name
    } else {
      this.backgroundAudioManager.pause()
    }
  },

  // 点击切歌的回调
  handleSwitch(event) {
    // 获取切换的类型
    let type = event.currentTarget.id
    // 发布消息之前关闭当前页面音乐
    this.backgroundAudioManager.stop()
    // 发布消息给recommendSong页面
    PubSub.publish("switchType", type)
    // 订阅来自recommendSong发来的消息
    PubSub.subscribe("musicId", (msg, musicId) => {
      // 获取音乐详情
      this.getMusicInfo(musicId)
      // 自动播放当前音乐
      this.musicControl(true, musicId)
      // 取消订阅，因为每点击一次就会累加一个函数，这样会导致执行多个重复函数，所以增加一次删除一次
      PubSub.unsubscribe("musicId")
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})