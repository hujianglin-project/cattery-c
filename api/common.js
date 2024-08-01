import { ajax } from "../utils/request.js";

// get方法
export const get = (params) =>
  ajax({
    url: "",
    token: true,
    data: params,
    method: "GET",
  });

// post方法
export const post = (params) =>
  ajax({
    url: "",
    token: true,
    data: params,
    method: "POST",
  });

// 登录
export const wxLogin = (params) =>
  ajax({
    url: "/api/wechat/user/login",
    token: false,
    data: params,
    method: "POST",
  });

// 绑定手机号码
export const savePhone = (params) =>
  ajax({
    url: "/api/user/savePhone",
    token: true,
    data: params,
    method: "POST",
  });
