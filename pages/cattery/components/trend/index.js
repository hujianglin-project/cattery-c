import { trendLike } from "../../../../api/cattery";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
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
    // 喜欢或者不喜欢
    async like() {
      const res = await trendLike({
        id: this.data.data.postId,
        status: this.data.data.isLike ? 0 : 1,
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

      this.setData({
        [`data.isLike`]: !this.data.data.isLike,
      });
    },

    // 预览图片
    previewImage(e) {
      let current = e.target.dataset.src;

      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: this.data.data.mediaList, // 需要预览的图片http链接列表
      });
    },
  },
});
