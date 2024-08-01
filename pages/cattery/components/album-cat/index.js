Component({
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
    toDetail: function () {
      wx.navigateTo({
        url:
          "/pages/cattery/cat-detail/index?albumId=" + this.data.data.albumId,
      });
    },
  },
});
