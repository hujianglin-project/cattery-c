Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
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
    // 关注
    follow: function () {
      console.log("+");
    },

    // 详情
    toDetail: function () {
      wx.navigateTo({ url: "/pages/cattery/cattery-detail/index" });
    },
  },
});
