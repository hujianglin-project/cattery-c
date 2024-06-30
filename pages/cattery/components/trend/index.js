Component({
  /**
   * 组件的属性列表
   */
  properties: {},
  /**
   * 组件的初始数据
   */
  data: {
    isLike: false, // 是否点赞
    imgList: [
      {
        url: "",
        id: 1,
      },
      {
        url: "",
        id: 2,
      },
      {
        url: "",
        id: 3,
      },
    ],
  },
  lifetimes: {
    attached() {},
  },
  /**
   * 组件的方法列表
   */
  methods: {},
});
