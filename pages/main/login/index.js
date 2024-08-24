import { wxLogin, catteryMine } from "../../../api/common.js";

Page({
  data: {
    phone: "", // 用户手机号
    checked: false, // 是否同意保密协议
    showDialog: false,
    dialogData: {
      canOverFlow: true,
      title: "用户协议和隐私政策",
      confirmColor: "#576B95",
      cancelColor: "",
      sureBtn: "确认",
      cancelBtn: "不同意",
      border: true,
    },
  },

  onLoad(option) {},

  onShow() {},

  // 跳转
  loginSuccess: () => {
    wx.switchTab({ url: "/pages/main/mine/index" });
  },

  sure() {
    this.setData({ checked: true, showDialog: false });
    this.login();
  },

  // 登录
  login: function () {
    // 如果没有勾选隐私协议
    if (!this.data.checked) {
      return this.setData({ showDialog: true });
    }

    const that = this;
    wx.showLoading({ title: "登录中..." });

    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wxLogin({ code: res.code }).then((loginRes) => {
            wx.hideLoading();
            if (loginRes?.data?.code !== 0) {
              return wx.showToast({
                title: loginRes?.data?.message,
                icon: "none",
              });
            }
            const {
              avatar,
              bindPhone,
              nickName,
              token,
              sessionKey,
              currentCatteryId,
            } = loginRes?.data?.data;

            console.log(loginRes)

            // 登录成功保存信息
            wx.setStorageSync("avatar", avatar);
            wx.setStorageSync("bindPhone", bindPhone);
            wx.setStorageSync("nickName", nickName);
            wx.setStorageSync("X-Token", token);
            wx.setStorageSync("sessionKey", sessionKey);
            // 如果没有绑定手机号，则进行绑定提示
            if (!bindPhone) {
              wx.navigateTo({
                url: "/pages/main/bindPhone/index?id=" + currentCatteryId,
              });
              return;
            }

            that.loginSuccess();
          });
        } else {
          console.log("登录失败！" + res.errMsg);
          wx.hideLoading();
        }
      },
    });
  },

  // 勾选隐私协议
  privacyChecked() {
    this.setData({ checked: !this.data.checked });
  },

  cancel() {
    this.setData({ showDialog: false, checked: false });
  },
});
