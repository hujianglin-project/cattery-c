import { catteryFollow } from "../../api/cattery";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: "",
    },
    data: {
      type: Object,
      value: {},
    },
    index: {
      type: Number,
      value: 0,
    },
  },
  /**
   * 组件的初始数据
   */
  data: {},
  lifetimes: {
    attached() {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 详情
    toDetail: function () {
      if (this.data.type === "detail") return;
      wx.navigateTo({
        url:
          "/pages/cattery/cattery-detail/index?catteryId=" +
          this.data.data.catteryId,
      });
    },

    // 关注，取消关注
    async follow() {
      const catteryId = this.data.data.catteryId;
      const res = await catteryFollow({
        catteryId,
        status: this.data.data.isFocus ? 0 : 1,
      });

      const { code, message } = res?.data;
      if (code !== 0) {
        return wx.showToast({
          title: message,
          icon: "none",
        });
      }
      wx.showToast({
        title: "操作成功",
        icon: "none",
      });
      var focusCount = !this.data.data.isFocus ? this.data.data.fansCount + 1 : this.data.data.fansCount - 1;
      this.setData({
        [`data.isFocus`]: !this.data.data.isFocus,
        [`data.fansCount`]: focusCount,
      });
    },

    // 联系猫舍
    contact() {
      wx.showModal({
        title: "联系猫舍",
        content: this.data.data.contactInfo,
        showCancel: true,
        cancelText: "取消",
        cancelColor: "#000000",
        confirmText: "复制",
        confirmColor: "#576B95",
        success: async (result) => {
          if (result.confirm) {
            wx.setClipboardData({
              data: this.data.data.contactInfo,
              success: function (res) {
                wx.showToast({
                  title: "复制成功",
                  icon: "none",
                });
              },
            });
          }
        },
      });
    },
    // // 实现分享功能
    // onShareAppMessage(options) {
    //   console.log(options);
    //   return {
    //     title: this.data.data.catteryName, // 分享的标题
    //     // path: '/pages/cattery/cattery-detail/index?catteryId=' + this.data.data.catteryId,
    //     path: '/pages/cattery/cat-detail/index?albumId=' + 1,
    //     imageUrl: this.data.data.catteryAvatar, // 自定义分享图片
    //     success: function (res) {
    //       // 分享成功后的回调
    //       console.log('分享成功', res);
    //     },
    //     fail: function (res) {
    //       // 分享失败后的回调
    //       console.log('分享失败', res);
    //     }
    //   };
    // },
  },
});
