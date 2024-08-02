import { catteryInfo, albumList } from "../../../api/cattery";
import { catType, tagList } from "../../../utils/dict";

// 数据格式化
const formatFunc = (item) => {
  if (item.tag) {
    item.tagLabel = tagList.filter((data) => data.value == item.tag)?.[0].name;
  }

  return item;
};

Page({
  data: {
    detailInfo: {},
    checked: 0,
    navList: catType,
    getListFunc: albumList,
    formatFunc: formatFunc,
    params: {
      tag: 0,
    },

    catList: [{}],
  },
  onLoad(options) {
    this.catteryId = options.catteryId;
    this.setData({
      params: {
        catteryId: this.catteryId,
        tag: 0,
      },
    });
    this.getDetail(this.catteryId);
  },

  onShow() {},

  async getDetail(catteryId) {
    wx.showLoading();
    const res = await catteryInfo({ id: catteryId });
    wx.hideLoading();
    const { code, message, data } = res?.data;

    if (code !== 0) {
      return wx.showToast({
        title: message,
        icon: "none",
      });
    }

    this.setData({ detailInfo: data });
  },

  onReady: function () {
    this.albumCatComponent = this.selectComponent("#albumCatComponent");
    this.albumCatComponent.setPageDataToInit();
  },

  onPullDownRefresh: function () {
    this.albumCatComponent.setPageDataToInit();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 获取更多数据
    this.albumCatComponent.getMorePageData();
  },

  // 切换tab
  chooseNav(e) {
    const id = e.currentTarget.dataset.id;

    this.setData({
      checked: id,
      params: {
        catteryId: this.catteryId,
        tag: id,
      },
    });

    this.albumCatComponent && this.albumCatComponent.setPageDataToInit();
  },
});
