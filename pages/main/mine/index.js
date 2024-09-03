Page({
  data: {
    avater:
      wx.getStorageSync("avatar") ||
      "https://duoduo-cattery.oss-cn-shenzhen.aliyuncs.com/common/c-mine-user.png", //头像
    name: wx.getStorageSync("nickName") || "点击登录", // 用户名
    desc: "hello，铲屎官~", // 用户简介
    bindPhone: true,
    isLogin: false,
  },

  onLoad() {
    if (!wx.getStorageSync('X-Token')) {
      // setTimeout(() => {
      //   wx.reLaunch({
      //     url: "/pages/main/login/index",
      //   });
      // }, 500);
    } else {
      this.setData({
        isLogin: true,
      })
    }
    const bindPhone = wx.getStorageSync('bindPhone');
    this.setData({
      avater: wx.getStorageSync("avatar") || "https://duoduo-cattery.oss-cn-shenzhen.aliyuncs.com/common/c-mine-user.png", //头像
      name: wx.getStorageSync("nickName") || "点击登录", // 用户名
      desc: "hello，铲屎官~", // 用户简介
      bindPhone: bindPhone == true,
    })
  },

  onShow() {
    const isBindPhone = wx.getStorageSync('bindPhone');
    this.setData({
      avater: wx.getStorageSync("avatar") || "https://duoduo-cattery.oss-cn-shenzhen.aliyuncs.com/common/c-mine-user.png", //头像
      name: wx.getStorageSync("nickName") || "点击登录", // 用户名
      desc: "hello，铲屎官~", // 用户简介
      bindPhone: isBindPhone == true,
    })
  },

  // 去反馈
  feedback: () => {
    wx.navigateTo({ url: "/pages/mine/feedback/index" });
  },

  goBindPhone: () => {
    wx.navigateTo({
      url: "/pages/main/bindPhone/index",
    })
  },

  goLogin: () => {
    wx.reLaunch({
      url: "/pages/main/login/index",
    });
  },
});
