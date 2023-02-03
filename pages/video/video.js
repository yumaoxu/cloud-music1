// pages/video/video.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], //标签导航数据
    navId: "", //导航标识
    videoList: [], //视频列表数据
    videoId: '', //视频标识ID
    videoUpdateTime: [], //记录播放时长
    isTriggered:false, //下拉刷新状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取导航数据
    this.getVideoGroupListData();
  },
  // 获取导航数据
  async getVideoGroupListData() {
    let videoGroupListData = await request("/video/group/list")
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id
    })
    this.getVideoList(this.data.navId);
  },

  // 点击切换导航的回调
  changeNav(event) {
    let navId = event.currentTarget.id;
    this.setData({
      navId: navId * 1,
      videoList: []
    })
    //显示正在加载
    wx.showLoading({
      title: "正在加载"
    })
    this.getVideoList(this.data.navId)
  },

  //获取视频列表数据
  async getVideoList(navId) {
    let videoListData = await request("/video/group", {
      id: navId,
      time:Date.now()
    })
    let index = 0;
    let videoList = videoListData.datas.map(item => {
      item.id = index++;
      return item;
    })
    for (let i = 0; i < videoList.length; i++) {
      let videoUrldata = await request("/video/url", {
        id: videoList[i].data.vid
      })
      videoList[i].url = videoUrldata.urls[0].url
    }
    //关闭消息提示框
    wx.hideLoading()
    this.setData({
      videoList,
      isTriggered:false  //关闭下拉刷新
    })
  },

  // 点击播放/继续播放的回调
  handlePlay(event) {
    let vid = event.currentTarget.id;
    // // 关闭上一个播放的视频
    // this.vid!==vid&&this.videoContext&&this.videoContext.stop()
    // this.vid=vid;
    this.setData({
      videoId: vid
    })
    // 创建控制video标签的实例对象
    this.videoContext=wx.createVideoContext(vid)
    let {
      videoUpdateTime
    } = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid)
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }
  },

  // 监听视频播放进度的回调
  handleTimeUpdate(event) {
    let videoTimeObj = {
      vid: event.currentTarget.id,
      currentTime: event.detail.currentTime
    };
    let {
      videoUpdateTime
    } = this.data;
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid);
    if (videoItem) {
      videoItem.currentTime = event.detail.currentTime
    } else {
      videoUpdateTime.push(videoTimeObj);
    }
    this.setData({
      videoUpdateTime
    })
  },

  // 视频播放结束的回调
  handleEnded(event){
    let {videoUpdateTime}=this.data;
    videoUpdateTime.splice(videoUpdateTime.findIndex(item=>item.vid===event.currentTarget.id),1)
    this.setData({
      videoUpdateTime
    })
  },

  // 自定义下拉刷新的回调
  handleRefresher(){
    this.getVideoList(this.data.navId)
  },

  // 自定义上拉触底的回调
  handleToLower(){
    //用offset做，暂时不做
  },

  //跳转至搜索页
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
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
  onShareAppMessage({from}) {
    return{
      title:"许东明好帅",
      page:"/pages/video/video",
      imageUrl:"/static/images/小丑.jpeg"
    }
  }
})