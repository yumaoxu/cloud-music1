// pages/search/search.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', //默认搜索值
    hotList: [], //热搜数据榜
    searchContent: "", //用户输入的表单项数据
    searchList: [], //关键字模糊匹配数据
    historyList: [], //搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInitData()

    // 获取本地历史记录
    this.getSearchHistory()
  },


  // 获取初始化搜索数据
  async getInitData() {
    let placeholderContent = await request("/search/default")
    let hotListData = await request("/search/hot/detail")
    this.setData({
      placeholderContent: placeholderContent.data.showKeyword,
      hotList: hotListData.data
    })
  },

  // 获取本地历史记录的功能函数
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory')
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },

  // 表单项内容发生改变的回调
  handleInputChange(event) {
    this.setData({
      // trim 移出首尾的空格
      searchContent: event.detail.value.trim()
    })
    // this.getSearchList()
    // //函数节流  发送请求获取关键字模糊匹配数据
    this.throttle(this.getSearchList, 300)()
  },
  //发送请求获取关键字模糊匹配数据
  async getSearchList() {
    if (!this.data.searchContent) {
      this.setData({
        searchList: []
      })
      return;
    }
    let {
      searchContent,
      historyList
    } = this.data
    //发送请求获取关键字模糊匹配数据
    let searchListData = await request("/search", {
      keywords: searchContent,
      limit: 10
    })
    this.setData({
      searchList: searchListData.result.songs
    })

    // 将搜索的关键字添加到搜索历史记录中
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent)
    this.setData({
      historyList
    })
    wx.setStorageSync('searchHistory', historyList)
  },

  // 函数节流封装
  throttle(fn, delay) {
    // 记录上一次触发函数时的时间，初始值为0
    let lastTime = 0
    return function (...args) {
      // 获取现在的时间
      const nowTime = new Date().getTime()
      // 如果现在的时间减去上次触发的事件大于等于interval，则可以执行函数了
      if (nowTime - lastTime >= delay) {
        fn.apply(this, args)
        // 将上次触发函数的时间赋值成当前时间
        lastTime = nowTime
      }
    }
  },

  // 清空搜索框
  clearSearchContent() {
    this.setData({
      searchContent: ""
    })
  },

  // 删除历史记录
  deleteSearchHistory() {
    wx.showModal({
      content: '确认删除吗？',
      success: (res) => {
        if (res.confirm) {
          // 清空data中的historyList
          this.setData({
            historyList: []
          })
          // 移除本地的历史记录缓存
          wx.removeStorageSync('searchHistory')
        }
      }
    })
  },

  // 跳转至播放界面
  toSongDetail(event){
    // console.log(event.currentTarget.id);
    let musicId=event.currentTarget.id
    console.log(musicId);
    wx.navigateTo({
      url: '/songPackage/pages/songDetail/songDetail?musicId=' + musicId,
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