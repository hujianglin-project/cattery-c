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
export const catteryList = (params) =>
  ajax({
    url: "/api/user/cattery/list",
    token: true,
    data: params,
    method: "GET",
  });
