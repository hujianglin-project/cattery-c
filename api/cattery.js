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

// 猫舍
export const catteryList = (params) =>
  ajax({
    url: "/api/user/cattery/list",
    token: true,
    data: params,
    method: "GET",
  });

// 访问猫舍
export const catteryVisit = (params) =>
  ajax({
    url: "/api/user/cattery/visit",
    token: true,
    data: params,
    method: "POST",
  });

// 关注/取消关注猫舍
export const catteryFollow = (params) =>
  ajax({
    url: "/api/user/cattery/follow",
    token: true,
    data: params,
    method: "POST",
  });

// 猫舍详情
export const catteryInfo = (params) =>
  ajax({
    url: "/api/user/cattery/info",
    token: true,
    data: params,
    method: "GET",
  });

// 猫舍专辑
export const albumList = (params) =>
  ajax({
    url: "/api/user/album/list",
    token: true,
    data: params,
    method: "GET",
  });

// 猫舍专辑详情
export const albumDetail = (params) =>
  ajax({
    url: "/api/user/album/info",
    token: true,
    data: params,
    method: "GET",
  });

// 猫舍专辑动态
export const trendList = (params) =>
  ajax({
    url: "/api/user/album/post/list",
    token: true,
    data: params,
    method: "GET",
  });

// 猫舍专辑评论
export const commentList = (params) =>
  ajax({
    url: "/api/user/album/comment/list",
    token: true,
    data: params,
    method: "GET",
  });

// 猫舍专辑评论删除
export const commentDelete = (params) =>
  ajax({
    url: "/api/user/album/comment/delete",
    token: true,
    data: params,
    method: "POST",
  });

// 动态点赞 / 取消点赞
export const trendLike = (params) =>
  ajax({
    url: "/api/user/album/post/like",
    token: true,
    data: params,
    method: "POST",
  });

// 添加专辑评论
export const commentCreate = (params) =>
  ajax({
    url: "/api/user/album/comment/create",
    token: true,
    data: params,
    method: "POST",
  });

// 专辑点赞/取消点赞
export const albumLike = (params) =>
  ajax({
    url: "/api/user/album/like",
    token: true,
    data: params,
    method: "POST",
  });
