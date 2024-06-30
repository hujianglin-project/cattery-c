Page({
  data: {
    checked: 1,
    navList: [
      {
        title: "动态",
        id: 1,
      },
      {
        title: "评论",
        id: 2,
      },
    ],
  },
  onLoad(options) {},

  onShow() {},
  choose: function (e) {
    this.setData({
      checked: e.currentTarget.dataset.id,
    });
  },
});
