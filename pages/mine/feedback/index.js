Page({
  data: {
    value: "",
  },
  onLoad(options) {},

  onShow() {},

  bindTextAreaBlur: function (e) {
    console.log(e);
    this.setData({ value: e.detail.value });
  },

  // 提交
  submit: () => {},
});
