// pages/login/login.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  handleInput(event) {
    
  },
  async login(){
    let{phone,password}=this.data;
    if(!phone||!password){
      wx.showToast({
        title: '手机号/密码不能为空',
        icon:"none"
      })
      //showToast是异步任务,return之后后面代码就不走了，即验证手机号为空后不验证之后的验证了
      return;
    }
    let phoneReg=/^1[3-9][0-9]{9}$/;
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号不正确',
        icon:"none"
      })
      return;
    }
    let result=await request("/login/cellphone",{phone,password,isLogin:true})
    if(result.code===200){
      wx.showToast({
        title: '登陆成功',
      })
      wx.setStorageSync('userInfo',JSON.stringify(result.profile))
      // 跳转至个人中心页面
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    }else if(result.code===400||result.code===502){
      wx.showToast({
        title: '手机号/密码不正确',
        icon:"none"
      })
      return;
    }else{
      wx.showToast({
        title:"登陆失败，请稍后再试",
        icon:"none"
      })
    }
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