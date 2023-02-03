// pages/index/index.js
import request from "../../utils/request"
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
  async onLoad(options) {
    //获取轮播图列表
    let bannerListData = await request("/banner", {
      type: 2
    })
    this.setData({
      bannerList: bannerListData.banners
    })
    //获取推荐列表
    let recommendListData = await request("/personalized", {
      limit: 10
    })
    this.setData({
      recommendList: recommendListData.result
    })
    
    //获取排行榜
    let resArr = []
    let topListData = await request("/toplist/detail", )
    for(let i=0;i<=2;i++){
      let topListItem = {
        name: topListData.list[i].name,
        tracks: topListData.list[i].tracks
      }
      resArr.push(topListItem)
      this.setData({
        topList: resArr
      })
    }

  },
  //点击跳转每日推荐页面
  toRecommendSong(){
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/recommendSong',
    })
  },

  // 
  toSongSheet(){
    wx.navigateTo({
      url: '/pages/songSheet/songSheet',
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