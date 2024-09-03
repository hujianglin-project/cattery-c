import { catteryList, catteryVisit } from "../../../api/cattery.js";

Page({
  data: {
    getListFunc: catteryList,
    showList: false,
  },

  onLoad(option) {

    if (!wx.getStorageSync('X-Token')) {
      return wx.showToast({
        title: "登录后查看关注的猫舍哦~",
        icon: "none",
      });
    }

    const catteryId = option.catteryId;
    wx.setStorageSync("catteryId", catteryId);

    // 如果有id说明是访问某个猫舍，先请求，如果没有id则说明是访问之前访问过的
    if (catteryId) {
      this.getVisit(catteryId);
    } else {
      this.setData({
        showList: true,
      });
    }
  },

  onReady: function () {
    this.catteryListComponent = this.selectComponent("#catteryListComponent");
  },

  onUnload: function () {
    this.catteryListComponent = null;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.catteryListComponent.setPageDataToInit();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 获取更多数据
    this.catteryListComponent.getMorePageData();
  },

  async getVisit(catteryId) {
    const res = await catteryVisit({ id: catteryId });

    const { code, message } = res?.data;

    if (code !== 0) {
      return wx.showToast({
        title: message,
        icon: "none",
      });
    }

    this.setData({ showList: true });
  },
});
