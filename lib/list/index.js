/**
 * @Desc: List Behavior
 * @Author: yanjiao.lu
 * @Date: 2019-08-21 19:04:56
 * @Last Modified by: yanjiao.lu@zhenai.com
 * @Last Modified time: 2020-05-13 11:07:55
 */

/**
 * @param Number size 分页数
 * @param Object params 列表其他请求参数
 * @param Function getListFunc 获取列表数据方法
 * @param Function formatFunc 格式化数据方法
 * @param Function formatListFunc 格式化数据数组方法
 * @param Function detailParams 查询详情参数
 * @return Behavior
 */
export const pageListBehavior = function (
  size = 5,
  params = {},
  getListFunc = null,
  formatFunc = null,
  formatListFunc = null,
  detailParams = null
) {
  return Behavior({
    properties: {
      size: {
        type: Number,
        value: size,
      },
      getListFunc: {
        type: Function,
        value: getListFunc,
      },
      formatFunc: {
        type: Function,
        value: formatFunc,
      },
      formatListFunc: {
        type: Function,
        value: formatListFunc,
      },
      detailParams: {
        type: {},
        value: detailParams,
      },
      params: {
        type: {},
        value: params,
      },
    },

    data: {
      showReachBottom: false, // 是否显示底部正在加载中
      showLoading: false, // 是否正在请求数据列表
      lists: [], // 列表
      seeChannel: false, // 是否有查看文章（如果item内容，需要刷新数据）
      lastIndex: 0, // 当前页
      total: 0, // 总量
      lastIndexFollowUp: 0, // 用户当前查看的列表数据
    },

    methods: {
      /**
       * 获取list列表数据
       * @praram Boolean refresh 是否是查看当前的文章（是的话，只用更新当前文章数据）
       */
      getPageData: function (refresh = false) {
        const that = this;
        const lists = that.data.lists;
        const lastIndexFollowUp = that.data.lastIndexFollowUp;
        let params = that.data.params;
        const formatFunc = this.data.formatFunc;
        const formatListFunc = this.data.formatListFunc;

        // refresh 请求第n个用户
        const size = refresh ? 1 : that.data.size;
        let lastIndex = refresh ? lastIndexFollowUp + 1 : that.data.lastIndex;
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

        return (
          this.data.getListFunc &&
          this.data
            .getListFunc({
              size,
              lastIndex,
              ...params,
            })
            .then(({ data }) => {
              wx.stopPullDownRefresh();
              wx.hideLoading();

              if (data && data.code === 0 && data.data && data.data.records) {
                formatPairList = data.data.records || [];

                //格式化数组数据
                if (formatListFunc && typeof formatListFunc === "function") {
                  if (lastIndex === 1) {
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
                    [`lists[${lastIndexFollowUp}]`]: formatPairList[0],
                  });
                } else {
                  that.setData({
                    lists:
                      lastIndex > 1
                        ? lists.concat(formatPairList)
                        : formatPairList,
                    showLoading: false,
                    total: data.data.total,
                  });
                }
              } else {
                // 请求失败继续请求当前页数据
                that.data.lastIndex = lastIndex > 0 ? lastIndex - 1 : 1;
                that.setData({
                  showLoading: false,
                });
              }
              that.triggerEvent("ready", data && data.data ? data.data : "");
            })
            .catch((err) => {
              console.log(err);
            })
        );
      },

      /**
       * 跟进页返回列表页回调
       */
      onRefresh: function (e) {
        this.data.seeChannel = true;
        this.data.lastIndexFollowUp = e.lastIndexTarget.dataset.idx;
      },

      /**
       * 立即刷新当前数据
       * @param {Event}} e
       */
      refeshData(e) {
        this.onRefresh(e);
        this.onPageShow();
      },

      /**
       * 查看当前item项
       */
      onItemTap: function (e) {
        const idx = e.lastIndexTarget.dataset.idx;
        const item = this.data.lists[idx];

        this.data.seeChannel = true;
        this.data.lastIndexFollowUp = idx;

        this.triggerEvent("click", { item });
      },

      /**
       * 删除数据项
       * @param {Number} id
       */
      onItemDelete(e) {
        this.setData({
          [`lists[${this.data.lastIndexFollowUp}].isDel`]: true,
          total: this.data.total - 1,
        });

        this.triggerEvent("delete", this.data.total - 1);
      },

      /**
       * 页面显示时
       */
      onPageShow: function () {
        if (this.data.seeChannel) {
          // 阅读文章后，刷新当前数据
          this.getPageData(true);
          this.data.seeChannel = false;
        }
      },

      /**
       * 列表请求恢复初始化
       */
      setPageDataToInit: function () {
        // 数据恢复初始化
        this.setData({
          showReachBottom: false,
          showLoading: false,
        });
        this.data.seeChannel = false;
        this.data.lastIndex = 1;
        this.data.lists = []; //切换tab 重新加载第一页的时候，如若接口报错，先清空前tab历史数据，再请求

        this.getPageData();
      },

      /**
       * 获取更多数据，一般用户上滑动到顶部的时候
       */
      getMorePageData: function () {
        const size = this.data.size;
        const total = this.data.total;
        const lastIndex = this.data.lastIndex;

        if (total >= 0 && lastIndex * size >= total) {
          // 显示已经到底了
          this.setData({
            showReachBottom: true,
            showLoading: false,
          });
        } else {
          // 获取下一页数据
          this.setData({ showLoading: true });
          this.data.lastIndex = lastIndex + 1;
          this.getPageData();
        }
      },
    },
  });
};
