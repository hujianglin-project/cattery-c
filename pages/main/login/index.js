import { wxLogin } from "../../../api/common.js";

Page({
  data: {
    phone: "", // 用户手机号
  },

  onLoad() {},

  onShow() {},

  // 跳转
  loginSuccess: () => {
    wx.switchTab({ url: "/pages/main/mine/index" });
  },

  // 登录
  login: function () {
    const that = this;
    console.log(this);
    wx.login({
      success(res) {
        if (res.code) {
          console.log(res.code, 11);
          //发起网络请求
          wxLogin({ code: res.code }).then((loginRes) => {
            if (loginRes?.data?.code !== 0) {
              return wx.showToast({
                title: loginRes?.data?.message,
                icon: "none",
              });
            }
            const { avatar, bindPhone, nickName, token } = loginRes?.data?.data;

            // 登录成功保存信息
            wx.setStorageSync("avatar", avatar);
            wx.setStorageSync("bindPhone", bindPhone);
            wx.setStorageSync("nickName", nickName);
            wx.setStorageSync("X-Token", token);

            // 如果没有绑定手机号，则进行绑定提示

            // 登录成功，去我的
            that.loginSuccess();
          });
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      },
    });
  },

  // 获取用户手机号
  getPhoneNumber: (e) => {
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      // 用户同意授权
      this.setData({
        phoneNumber: e.detail.encryptedData,
      });
      console.log(e.detail.encryptedData);
    } else {
      // 用户拒绝授权
      this.setData({
        phoneNumber: "",
      });
    }
  },
});
