// pages/recommendSong/recommendSong.js
import PubSub from "pubsub-js"
import request from "../../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendList: [], //推荐列表数据
    index:0,  //当前音乐下标
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


    //获取每日推荐数据
    this.getRecommendList()

    // 订阅songDetail的消息
    PubSub.subscribe("switchType",(msg,type)=>{
      let {recommendList,index}=this.data
      if(type ==="pre"){
        // 判断临界值
        (index === 0) && (index= recommendList.length)
        //切换至上一首
        index--
      }else{
        (index===recommendList.length -1 ) && (index = -1 )
        //next
        index++
      }
      // 更新data中的信息
      this.setData({
        index
      })
      let musicId=recommendList[index].id
      //将musicId回传给songDetail页面
      PubSub.publish("musicId",musicId)
    })
  },

  //获取每日推荐数据
  async getRecommendList() {
    let recommendListData = await request("/recommend/songs");
    this.setData({
      recommendList: recommendListData.data.dailySongs.slice(0, 20)
    })
  },

  // 跳转至歌曲详情页面
  toSongDetail(event){
    let {index,song}=event.currentTarget.dataset
    this.setData({
      index
    })
    // 路由传参 query参数
    wx.navigateTo({
      // 如果直接传递的song对象，底层会使用tostring方法转化为字符串这样我们无法使用，所以在传递之前我们就使用方法将其转化为json格式
      url: '/songPackage/pages/songDetail/songDetail?musicId='+song.id,
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