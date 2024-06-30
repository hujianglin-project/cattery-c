Page({
  data: {
    checked: 1,
    navList: [
      {
        title: "全部",
        id: 1,
      },
      {
        title: "在售",
        id: 2,
      },
      {
        title: "已售",
        id: 3,
      },
      {
        title: "种猫",
        id: 4,
      },
      {
        title: "领养",
        id: 5,
      },
    ],

    catList: [{}],
  },
  onLoad(options) {},

  onShow() {},
  toDetail: function () {
    wx.navigateTo({ url: "/pages/cattery/cat-detail/index" });
  },
});
