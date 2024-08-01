Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    dialogData: {
      type: Object,
      value: {},
    },
    zIndex: {
      type: Number,
      value: 100,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    dialog: {
      canOverFlow: false, // 是否可以超出弹框显示
      title: "提示",
      titleStyle: "",
      content: "",
      showCancel: true,
      confirmColor: "",
      cancelColor: "",
      contentColor: "",
      sureBtn: "确定",
      cancelBtn: "取消",
      border: false,
    },
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
  },

  attached() {
    this.setData({
      dialog: Object.assign({}, this.data.dialog, this.data.dialogData),
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel() {
      this.triggerEvent("cancel");
    },
    sure() {
      this.triggerEvent("sure");
    },
    bindGetUserInfo(e) {
      this.login().then((code) => {
        // 查看是否授权
        this.getUserInfo().then((res) => {
          const decryptData = res.encryptedData;
          const iv = res.iv;
          this.triggerEvent("auth", { decryptData, iv, code });
        });
      });
    },
    getUserInfo() {
      return new Promise((reslove) => {
        // 查看是否授权
        wx.getSetting({
          success(res) {
            if (res.authSetting["scope.userInfo"]) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function (res) {
                  reslove(res);
                },
              });
            }
          },
        });
      });
    },
    login() {
      return new Promise((resolve) => {
        wx.login({
          success: function (res) {
            if (res.code) {
              resolve(res.code);
            }
          },
        });
      });
    },
  },
});
