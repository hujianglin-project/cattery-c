import { catteryMine, savePhone } from "../../../api/common.js";

Page({
  data: {
    clocked: false,
  },

  onLoad(option) {
    this.currentCatteryId = option.id || "";
  },

  onShow() {},

  // 跳转
  loginSuccess: () => {
    wx.switchTab({ url: "/pages/main/mine/index" });
  },

  // 一键登录接口
  async wxPhoneLogins(encryptedData, iv, code) {
    savePhone({
      encryptedData: encryptedData,
      iv: iv,
      code: code,
    }).then((res) => {
      wx.hideLoading();
      //解锁
      this.setData({
        clocked: false,
      });

      if (res.data.code === 0) {
        this.loginSuccess();
        wx.setStorageSync('bindPhone', true)
      } else {
        wx.showToast({
          title: res?.data?.message || "请重试",
          icon: "none",
        });
      }
    });
  },

  jumpMain: function() {
    wx.switchTab({ url: "/pages/main/mine/index" });
  },

  // 获取用户手机号
  getPhoneNumber: function (e) {
    if (!this.data.clocked) {
      // 上锁
      this.setData({
        clocked: true,
      });
      if (e.detail.errMsg === "getPhoneNumber:ok") {
        // 用户同意授权
        wx.showLoading({
          mask: true,
          title: "跳转中",
        });
        //将code 其他参数传给后台
        this.wxPhoneLogins(e.detail.encryptedData, e.detail.iv, e.detail.code);
      } else {
        // 用户拒绝授权
        // this.setData({
        //   phoneNumber: "",
        // });
        //解锁
        this.setData({
          clocked: false,
        });
      }
    }
  },
});
