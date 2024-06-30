Page({
  data: {
    avater: "", //头像
    name: "点击登录", // 用户名
    desc: "登录后填写简介~", // 用户简介
  },

  onLoad() {},

  onShow() {},

  // 去反馈
  feedback: () => {
    wx.navigateTo({ url: "/pages/mine/feedback/index" });
  },
});
