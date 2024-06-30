Page({
  data: {
    phone: "", // 用户手机号
  },

  onLoad() {},

  onShow() {},

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
