Page({
  data: {
    avater:
      wx.getStorageSync("avatar") ||
      "https://duoduo-cattery.oss-cn-shenzhen.aliyuncs.com/common/c-mine-user.png", //头像
    name: wx.getStorageSync("nickName") || "点击登录", // 用户名
    desc: "简介~", // 用户简介
  },

  onLoad() {},

  onShow() {},

  // 去反馈
  feedback: () => {
    wx.navigateTo({ url: "/pages/mine/feedback/index" });
  },
});
