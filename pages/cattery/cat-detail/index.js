import {
  albumDetail,
  trendList,
  commentList,
  commentCreate,
  albumLike,
} from "../../../api/cattery";
import { tagList } from "../../../utils/dict";

Page({
  data: {
    checked: 1,
    getListFunc: trendList,
    getListFunc1: commentList,
    params: {},
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
    detailInfo: {}, //详情信息
    comment: "",
  },
  onLoad(options) {
    const albumId = options.albumId;
    this.setData({
      params: {
        albumId,
      },
    });
    this.getDetail(albumId);
  },

  onShow() {},
  onReady: function () {
    this.detailComponent1 = this.selectComponent("#trendComponent");

    this.detailComponent1.setPageDataToInit();
  },

  onPullDownRefresh: function () {
    this[`detailComponent${this.data.checked}`].setPageDataToInit();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 获取更多数据
    this[`detailComponent${this.data.checked}`].getMorePageData();
  },

  choose: function (e) {
    this.setData({
      checked: e.currentTarget.dataset.id,
    });

    this.detailComponent2 = this.selectComponent("#commentComponent");
    this[`detailComponent${this.data.checked}`] &&
      this[`detailComponent${this.data.checked}`].setPageDataToInit();
  },

  // 获取详情
  async getDetail(albumId) {
    wx.showLoading();
    const res = await albumDetail({ id: albumId });

    wx.hideLoading();

    if (res?.data?.code !== 0) {
      return wx.showToast({
        title: res?.data?.message,
        icon: "none",
      });
    }

    if (res?.data?.data.tag) {
      res.data.data.tagLabel = tagList.filter(
        (data) => data.value == res?.data?.data.tag
      )?.[0].name;
    }
    // 数据处理
    this.setData({ detailInfo: res?.data?.data });
  },

  inputComment(e) {
    this.setData({ comment: e.detail.value });
  },

  // 发送评论
  async submit() {
    if (!this.data.comment) {
      return wx.showToast({
        title: "请先输入评论",
        icon: "none",
      });
    }

    wx.showLoading();
    const res = await commentCreate({
      albumId: +this.data.params.albumId,
      message: this.data.comment,
    });

    wx.hideLoading();

    if (res?.data?.code !== 0) {
      return wx.showToast({
        title: res?.data?.message,
        icon: "none",
      });
    }

    wx.showToast({
      title: "发送成功",
      icon: "none",
    });

    // 数据处理
    this.setData({ comment: "" });
  },

  // 喜欢或者不喜欢
  async like() {
    const res = await albumLike({
      id: this.data.params.albumId,
      status: this.data.detailInfo.isLike ? 0 : 1,
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
      [`detailInfo.isLike`]: !this.data.detailInfo.isLike,
    });
  },
});
