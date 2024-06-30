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
