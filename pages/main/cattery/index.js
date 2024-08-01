import { catteryList, catteryVisit } from "../../../api/cattery.js";

Page({
  data: {
    getListFunc: catteryList,
    showList: false,
  },

  onLoad(option) {
    const catteryId = option.catteryId;
    wx.setStorageSync("catteryId", catteryId);
    this.getVisit(catteryId);
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
