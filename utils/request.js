//发送ajax请求
import config from "./config"
export default (url,data={},methods="GET")=>{
  return new Promise ((resolve,reject)=>{
    wx.request({
      url:config.host+url,
      data,
      methods,
      header:{
        cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1):''
      },
      success:(res)=>{
        // console.log("请求成功：",res); 
        //如果是登陆请求，就保存需要的cookie
        if(data.isLogin){
          wx.setStorage({
            key:"cookies",
            data:res.cookies
          })
        }
        resolve(res.data)
      },
      fail:(err)=>{
        // console.log("请求失败：",err);
        reject(err)
      }
    })
  })
}