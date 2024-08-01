import { commentDelete } from "../../../../api/cattery";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {},
    },
    index: {
      type: Number,
      value: 0,
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
    // 删除
    onDel() {
      wx.showModal({
        title: "",
        content: "确定删除吗？",
        showCancel: true,
        cancelText: "取消",
        cancelColor: "#000000",
        confirmText: "确定",
        confirmColor: "#576B95",
        success: async (result) => {
          if (result.confirm) {
            const data = this.data.data;

            wx.showLoading({
              mask: true,
              title: "删除中",
            });

            this.triggerEvent("refresh");
            commentDelete({ id: data.commentId }).then((res) => {
              wx.hideLoading();

              if (res && res.data && res.data.code === 0) {
                wx.showToast({
                  title: "删除成功！",
                  icon: "none",
                });

                this.triggerEvent("delete", data);
              } else {
                wx.showToast({
                  title: res.data.msg || "删除失败，请稍后再试！",
                  icon: "none",
                });
              }
            });
          }
        },
      });
    },
  },
});
