import { suggest } from "../../../api/mine.js";

Page({
  data: {
    value: "",
  },
  onLoad(options) {},

  onShow() {},

  bindTextAreaBlur: function (e) {
    this.setData({ value: e.detail.value });
  },

  // 提交
  submit: function () {
    if (!this.data.value) {
      return wx.showToast({
        title: "请先输入意见",
        icon: "none",
      });
    }

    suggest({ message: this.data.value }).then((res) => {
      const { code, message } = res?.data;

      if (code !== 0) {
        return wx.showToast({
          title: message,
          icon: "none",
        });
      }
      wx.showToast({
        title: "提交成功",
        icon: "none",
      });

      // 发表成功回到我的页面
      setTimeout(() => {
        wx.switchTab({ url: "/pages/main/mine/index" });
      }, 2000);
    });
  },
});
