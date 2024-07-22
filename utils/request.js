import { baseUrl } from "../config";

/**
 * 是否是登录接口报错
 * @param {String} url 登录接口
 */
export const isLoginPath = (url) => {
  const loginPath = [];

  return loginPath.indexOf(url) !== -1;
};

export const ajax = function ({
  url,
  method = "GET",
  token = false,
  contentType = "application/json",
  dataType = "json",
  data,
} = {}) {
  return new Promise((resolve, reject) => {
    let header = {
      "content-type": contentType,
    };

    const appToken = wx.getStorageSync("X-Token");
    if (token) {
      header["X-Token"] = appToken;
    }

    wx.request({
      url: baseUrl + url, //接口地址
      data,
      header,
      method,
      dataType,
      success: function (res) {
        let statusCode = res.statusCode + "";
        let errorMessage = "";
        // 用户清了缓存，从公众号模板消息进来时会先加载模板页面的一些接口，这个时候app.js可能还没有加载
        // 不会触发里面的自动登录，没有X-Token，会报错
        if (
          !isLoginPath(url) &&
          [-2000, 401, 405].indexOf(res.data.code) !== -1 &&
          !appToken
        ) {
          // 如果用户的缓存中没有token，需要进行模拟登录
          errorMessage = res.data.code;
          return;
        }

        if (res.data.code === -2000 || res.data.code === 401) {
          // 如果用户的缓存中没有token，需要进行模拟登录
          errorMessage = res.data.code;

          wx.hideLoading();

          wx.showToast({
            icon: "none",
            title: "请重新登录",
            success() {
              setTimeout(() => {
                wx.reLaunch({
                  url: "",
                });
              }, 2000);
            },
          });
        } else {
          if (statusCode.startsWith("4")) {
            errorMessage = statusCode;
            wx.showToast({
              title: "连接异常，请刷新后重试",
              icon: "none",
            });
            reject(res);
          } else if (statusCode.startsWith("5")) {
            errorMessage = statusCode;
            wx.showToast({
              title: "服务异常，请刷新后重试",
              icon: "none",
            });
            reject(res);
          } else {
            if (res.data.code !== 0) {
              errorMessage = JSON.stringify(res.data);
            }
            resolve(res);
          }
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          icon: "none",
          title: "连接异常，请刷新后重试",
        });
        reject(res);
      },
    });
  });
};
export const request = (opts = {}) => {
  opts.token = true;
  return ajax(opts).then((res) => (res && res.data) || null);
};

export const requestHelper = (opts) => {
  let {
    apiKey,
    token = true,
    contentType,
    method = "GET",
    apiList = [],
    params = {},
  } = opts || {};
  let url;
  if (apiKey && apiList) {
    url = apiList[apiKey];
  }

  let _opts = {
    token,
    url,
    data: params,
    method,
  };
  if (contentType) {
    _opts.contentType = contentType;
  }

  return request(_opts);
};

export const upload = function ({
  url,
  filePath,
  token = true,
  // contentType = 'multipart/form-data',
  name,
  formData,
  callback = null,
} = {}) {
  return new Promise((resolve, reject) => {
    let header = {};
    if (token) {
      header["X-Token"] = wx.getStorageSync("X-Token");
    }

    const uploadTask = wx.uploadFile({
      url: baseUrl + url, //接口地址
      filePath,
      name,
      formData,
      header,
      success: function (res) {
        try {
          res.data = JSON.paresolvee(res.data);
          resolve(res);
        } catch (error) {
          reject(error);
        }
      },
      fail: function (res) {
        reject(res);
      },
    });

    uploadTask.onProgressUpdate((res) => {
      if (callback) {
        callback(res);
      }
      // console.log('上传进度', res.progress)
      // console.log('已经上传的数据长度', res.totalBytesSent)
      // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    });
  });
};

//封装默认的fetch
export const fetch = function (
  method,
  url = "",
  params = {},
  successCb,
  errorCb
) {
  const app = getApp() || {};
  const globalData = { app };
  let token = globalData.token || wx.getStorageSync("X-Token");
  return new Promise((resolve, reject) => {
    let _header = {
      "content-type": "application/x-www-form-urlencoded; charesolveet=UTF-8",
      Cookie: "token=" + token,
    };
    params.ua = generateUA();
    /*微信发起请求*/
    wx.request({
      url: url,
      method: method,
      data: params,
      header: _header,
      success: function (res) {
        resolve(res);
      },
      fail: function (res) {
        errorCb && errorCb(res);
        reject(res);
        // wx.showToast({
        //   title: '网络出错',
        //   icon: 'loading'
        // })
      },
      complete: function () {},
    });
  });
};
