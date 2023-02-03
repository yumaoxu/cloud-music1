// pages/songSheet/songSheet.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sheetList: [], //用户歌单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //判断是否登陆
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
        success: () => {
          //跳转至登陆界面
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }

    //  获取用户歌单
    this.getSheet()
  },

  async getSheet() {
    let id = JSON.parse(wx.getStorageSync('userInfo')).userId
    let sheetListData = await request("/user/playlist", {
      uid: id
    })
    this.setData({
      sheetList:sheetListData.playlist
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