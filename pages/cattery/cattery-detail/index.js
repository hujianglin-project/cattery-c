import { catteryInfo, albumList } from "../../../api/cattery";
import { catType, tagList } from "../../../utils/dict";

// 数据格式化
const formatFunc = (item) => {
  if (item.tag) {
    item.tagLabel = tagList.filter((data) => data.value == item.tag)?.[0].name;
  }

  return item;
};

let leftList = []; //左侧集合
let rightList = []; //右侧集合
let leftHight = 0,
  rightHight = 0,
  itemWidth = 0,
  maxHeight = 0;

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
    leftList: [], //左侧集合
    rightList: [], //右侧集合
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

    // 计算比例
    wx.getSystemInfo({
      success: (res) => {
        let percentage = 750 / res.windowWidth;
        let margin = 20 / percentage;
        itemWidth = (res.windowWidth - margin) / 2;
        maxHeight = itemWidth / 0.8;
      },
    });
  },

  onShow() {
    // 是否需要重新加载数据
    const refresh = wx.getStorageSync("albumRefresh");
    if (refresh) {
      leftList.length = 0;
      rightList.length = 0;
      leftHight = 0;
      rightHight = 0;
      this.setData({
        leftList: [],
        rightList: [],
      });
      wx.removeStorageSync("albumRefresh");
    }
  },

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
    this.setPageDataToInit();
  },

  onPullDownRefresh: function () {
    leftList.length = 0;
    rightList.length = 0;
    leftHight = 0;
    rightHight = 0;

    this.setPageDataToInit();
  },

  loadImage(cover) {
    return new Promise((resolve) => {
      wx.getImageInfo({
        src: cover,
        success: (res) => {
          resolve(res);
        },
      });
    });
  },

  setPageDataToInit: function () {
    // 数据恢复初始化
    this.setData({
      showReachBottom: false,
      showLoading: false,
    });
    this.data.seeChannel = false;
    this.data.lastIndex = 0;
    this.data.lists = []; //切换tab 重新加载第一页的时候，如若接口报错，先清空前tab历史数据，再请求

    this.getPageData();
  },
  /**
   * 获取更多数据，一般用户上滑动到顶部的时候
   */
  getMorePageData: function () {
    const lastIndex = this.data.lastIndex;
    if (this.data.stop) {
      wx.showToast({
        title: "已经到底啦！",
        icon: "none",
      });
      // 显示已经到底了
      this.setData({
        showReachBottom: true,
        showLoading: false,
      });
    } else {
      wx.showToast({
        title: "加载中...",
        icon: "none",
      });
      // 获取下一页数据
      this.setData({ showLoading: true });
      this.data.lastIndex = lastIndex;
      this.getPageData();
    }
  },
  getPageData: function (refresh = false) {
    const that = this;
    const lists = that.data.lists;
    const currentFollowUp = that.data.currentFollowUp;
    let params = that.data.params;
    const formatFunc = this.data.formatFunc;
    const formatListFunc = this.data.formatListFunc;

    // refresh 请求第n个用户
    const size = refresh ? 1 : that.data.size;
    let lastIndex = refresh ? currentFollowUp + 1 : that.data.lastIndex;
    let formatPairList = [];

    if (!this.data.getListFunc) {
      console.error(
        `Function Error: getListFunc is not defined in the Component. Please check your code!`
      );
    }

    if (!refresh) {
      that.setData({ showLoading: true });
    }

    if (refresh && this.data.detailParams) {
      params = Object.assign({}, params, this.data.detailParams);
    }

    // 去掉为空的参数
    if (params && typeof params === "object") {
      for (let key in params) {
        if (!params[key]) {
          delete params[key];
        }
      }
    }

    // 是否需要重新加载数据
    const refresh1 = wx.getStorageSync("albumRefresh");
    if (refresh1) {
      this.fillData(true, []);
      wx.setStorageSync("albumRefresh", null);
    }

    return (
      this.data.getListFunc &&
      this.data
        .getListFunc({
          lastIndex,
          ...params,
        })
        .then(({ data }) => {
          wx.stopPullDownRefresh();
          wx.hideLoading();

          if (data && data.code === 0 && data.data && data.data.list) {
            formatPairList = data.data.list || [];

            //格式化数组数据
            if (formatListFunc && typeof formatListFunc === "function") {
              if (lastIndex === 0) {
                this.data.lists = [];
              }
              formatPairList = formatListFunc(
                formatPairList,
                this.data.lists[this.data.lists.length - 1]
              );
            }

            // 格式化数据
            if (formatFunc && typeof formatFunc === "function") {
              formatPairList = formatPairList.map((res) => {
                // return formatFunc(res)
                return formatFunc(res, data.data);
              });
            }

            if (refresh) {
              // 刷新当前进入列表详情页数据
              that.setData({
                [`lists[${currentFollowUp}]`]: formatPairList[0],
              });
            } else {
              that.setData({
                lists:
                  lastIndex > 0 ? lists.concat(formatPairList) : formatPairList,
                total: data.data.list.length,
                stop: data.data.stop,
                lastIndex: data.data.lastIndex,
              });

              that.fillData(false, formatPairList);
            }
          } else {
            // 请求失败继续请求当前页数据
            that.data.lastIndex = lastIndex > 0 ? lastIndex - 1 : 0;
            that.setData({
              showLoading: false,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        })
    );
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 获取更多数据
    this.getMorePageData();
  },

  // 切换tab
  chooseNav(e) {
    wx.setStorageSync("albumRefresh", true);
    const id = e.currentTarget.dataset.id;

    this.setData({
      checked: id,
      params: {
        catteryId: this.catteryId,
        tag: id,
      },
    });

    this.setPageDataToInit();
  },

  async fillData(isPull, listData) {
    if (isPull) {
      //是否下拉刷新，是的话清除之前的数据
      leftList.length = 0;
      rightList.length = 0;
      leftHight = 0;
      rightHight = 0;
    }

    for (let i = 0, len = listData.length; i < len; i++) {
      let tmp = listData[i];
      // 获取图片尺寸
      const { width, height } = await this.loadImage(listData[i].cover);
      tmp.width = parseInt(width);
      tmp.height = parseInt(height);
      tmp.itemWidth = itemWidth;
      let per = tmp.width / tmp.itemWidth;
      tmp.itemHeight = tmp.height / per;
      if (tmp.itemHeight > maxHeight) {
        tmp.itemHeight = maxHeight;
      }

      if (leftHight <= rightHight) {
        leftList.push(tmp);
        leftHight = leftHight + tmp.itemHeight;
      } else {
        rightList.push(tmp);
        rightHight = rightHight + tmp.itemHeight;
      }
    }

    this.setData({
      leftList: leftList,
      rightList: rightList,
      showLoading: false,
    });
  },
});
