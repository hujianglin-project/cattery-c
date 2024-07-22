import { catteryList } from "../../../api/cattery.js";

Page({
  data: {
    getListFunc: catteryList,
  },

  onReady: function () {
    this.catteryListComponent = this.selectComponent("#catteryListComponent");
    this.catteryListComponent.getPageData();
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
});
