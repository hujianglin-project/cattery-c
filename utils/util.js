import { ENV } from "../config";

const formatDate = (date, symbol = "-") => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return [year, month, day].map(formatNumber).join(symbol);
};

const formatMonthDay = (date, symbol = "-") => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return [month, day].map(formatNumber).join(symbol);
};
/**
 * 计算两个时间戳之间间隔的天数
 * @param {*} startDate 开始时间的时间戳
 * @param {*} endDate 结束时间的时间戳
 */
const getDateDiff = (startDate, endDate) => {
  startDate = formatDate(new Date(startDate));
  endDate = formatDate(new Date(endDate));
  const startTime = new Date(
    Date.parse(startDate.replace(/-/g, "/"))
  ).getTime();
  const endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
  const dates = Math.floor(startTime - endTime) / (1000 * 60 * 60 * 24);
  return Math.abs(dates);
};

const formatTime = (date) => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [hour, minute, second].map(formatNumber).join(":");
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

const baseFormatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return { year, month, day, hour, minute, second };
};

export const formatDateTime = (date) => {
  const { year, month, day, hour, minute, second } = baseFormatDate(date);
  const datestr = [year, month, day].map(formatNumber).join("-");
  const timestr = [hour, minute, second].map(formatNumber).join(":");

  return datestr + " " + timestr;
};

const getDateTime = (dateTime) => {
  // 返回示例： 9月28日 11:24
  let date = dateTime ? new Date(dateTime) : new Date();
  let month = date.getMonth() + 1;
  let hours = date.getHours();
  let minute = date.getMinutes();
  hours = hours < 10 ? "0" + hours : hours;
  minute = minute < 10 ? "0" + minute : minute;

  return `${month}月${date.getDate()}日 ${hours}:${minute}`;
};

const getCountdownTime = (time) => {
  // 返回示例： 1天 11:24:10
  let date = time ? new Date(time) : new Date();
  let surplusTime = date.getTime() - new Date().getTime();
  surplusTime = Math.floor(surplusTime / 1000);
  if (surplusTime <= 0) {
    return "00:00:00";
  }
  let days = 0;
  if (surplusTime >= 86400) {
    days = Math.floor(surplusTime / 86400);
    surplusTime = surplusTime % 86400;
  }
  let hours = Math.floor(surplusTime / 3600);
  if (hours < 10) {
    hours = "0" + hours;
  }
  let minutes = Math.floor((surplusTime % 3600) / 60);
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  let secend = Math.floor((surplusTime % 3600) % 60);
  if (secend < 10) {
    secend = "0" + secend;
  }
  let result = "";
  if (days > 0) {
    result = days + "天 ";
  }
  result += hours + ":" + minutes + ":" + secend;
  return result;
};

const getBirthDayFromIdCard = (idCard) => {
  let birthday = "";

  if (idCard != null && idCard != "") {
    if (idCard.length == 15) {
      birthday = "19" + idCard.substr(6, 6);
    } else if (idCard.length == 18) {
      birthday = idCard.substr(6, 8);
    }

    birthday = birthday.replace(/(.{4})(.{2})/, "$1/$2/");
  }

  return birthday;
};

/**
 * 判断数据是否存在
 */
const _isExit = (val) => {
  return (
    val !== null && val !== undefined && val !== "" && val !== -1 && val !== 0
  );
};

/**
 * 比较两个数据间大小
 */
const _compare = (val1, val2) => {
  if (!_isExit(val1) && !_isExit(val2)) {
    return 1;
  }

  if (_isExit(val1) && !_isExit(val2)) {
    return 2;
  }

  if (!_isExit(val1) && _isExit(val2)) {
    return 3;
  }

  if (_isExit(val1) && _isExit(val2)) {
    let num1 = typeof val1 === "number" ? val1 : parseInt(val1, 10),
      num2 = typeof val2 === "number" ? val2 : parseInt(val2, 10);

    if (parseInt(num1) < parseInt(num2)) {
      return 4;
    } else if (parseInt(num1) === parseInt(num2)) {
      return 5;
    } else {
      return 6;
    }
  }
};

/**
 * 生成 uuid
 */
export const uuid = (len, radix) => {
  var chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  var uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join("");
};

/**
 * 获取最近7个工作日（除周一周二外）
 */
const getSevenDay = () => {
  let days = [];
  let text = "";
  let i = 0;

  while (days.length < 7) {
    text = getDay(i);
    if (text) {
      days.push(text);
    }
    i++;
  }

  days.push({
    time: "其他",
    value: "其他",
  });
  return days;
};

export const weekDesc = {
  0: "周天",
  1: "周一",
  2: "周二",
  3: "周三",
  4: "周四",
  5: "周五",
  6: "周六",
};

/**
 * 获取除周一周二外的时间
 * 10月9日（周二）
 */
const getDay = (day) => {
  let today = new Date();
  let targetDayMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;

  today.setTime(targetDayMilliseconds);

  let formatToday = formatDate(today);
  let tMonth = today.getMonth() + 1;
  let tDay = today.getDate();
  let tWeek = today.getDay();

  if (tWeek === 1 || tWeek === 2) {
    return "";
  } else {
    let obj = {};
    tWeek = day === 0 ? "今天" : weekDesc[tWeek];
    obj["time"] = formatToday;
    obj["value"] = `${tMonth}月${tDay}日（${tWeek}）`;
    obj["checked"] = false;
    return obj;
  }
};
/**
 * 10月9日（周二）
 */
const getDay2Week = (day) => {
  let formatToday = formatDate(day);
  let tMonth = day.getMonth() + 1;
  let tDay = day.getDate();
  let tWeek = day.getDay();

  let obj = {};
  tWeek = day === 0 ? "今天" : weekDesc[tWeek];
  obj["time"] = formatToday;
  obj["value"] = `${tMonth}月${tDay}日（${tWeek}）`;
  obj["checked"] = false;
  return obj;
};

// 获取前几天
const getOldDay = (num = 4, format = ".") => {
  let days = [];
  let text = "";
  let i = 0;

  while (days.length < num) {
    let today = new Date();
    let targetDayMilliseconds = today.getTime() - 1000 * 60 * 60 * 24 * i;

    today.setTime(targetDayMilliseconds);
    const tYear = today.getFullYear();
    let tMonth = today.getMonth() + 1;
    let tDay = today.getDate();

    if (i === 0) {
      text = "今天";
    } else if (i === 1) {
      text = "昨天";
    } else {
      text = tMonth + format + tDay;
    }
    days.push({
      text,
      id: tYear + "-" + tMonth + "-" + tDay,
    });
    i++;
  }

  return days;
};

// 设置标题名称
const setNavTitle = () => {
  wx.setNavigationBarTitle({
    title: getNavTitle(),
  });
};

const getNavTitle = () => {
  let title = "珍爱优恋空间";

  if (ENV === "produce") {
    title = "珍爱优恋空间";
  } else if (ENV.indexOf("pre") !== -1) {
    title = "珍爱优恋空间预生产";
  } else {
    title = "珍爱优恋空间测试";
  }

  return title;
};

/**
 * 防抖
 * @param func
 * @param wait
 * @param immediate
 * @returns {function(...[*]=): *}
 */
const debounce = (func, wait, immediate) => {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};

// 函数节流，主要防止 input 输入过快导致的卡顿或者过多的请求
const throttle = (fn, wait, context) => {
  let timer, preTime;
  return function (...args) {
    const currentTime = Date.now();
    const call = () => {
      fn.apply(context === undefined ? this : context, args);
      preTime = currentTime;
    };

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    !preTime && (preTime = currentTime);
    currentTime - preTime > wait ? call() : (timer = setTimeout(call, wait));
  };
};

const loading = (fn) => {
  return function (val) {
    // 取消 loading 做一个延时，给小程序渲染预留时间
    val ? fn.call(this, val) : setTimeout(() => fn.call(this, val), 180);
  };
};

const match = (obj, attrs) => {
  const newObj = obj.constructor ? new obj.constructor() : Object.create(null);
  for (const key of attrs) {
    newObj[key] = obj[key];
  }
  return newObj;
};

// 缓动动画工具方法
const wobblyAnimate = (from, to, t) => {
  const wobbly = (t) => {
    const a = Math.pow(2.71828, -4 * t); // e = 2.71828
    const b = Math.sqrt(41);
    const c = 2 * b * t;
    return -((2 * a * Math.sin(c)) / b) - a * Math.cos(c) + 1;
  };
  return from + wobbly(t) * (to - from);
};

const isRange = (min, max, val) => {
  return val >= min && val <= max;
};

const getInfoData = (item) => {
  let arr = [
    item.memberAge + "岁",
    item.memberWorkCityDesc,
    item.memberOccupationDesc,
  ];
  arr = arr.filter((item) => !!item);
  return arr.join(" | ");
};

export const once = (fn) => {
  let called = false;
  return function () {
    if (!called) {
      called = true;
      return fn.apply(this, arguments);
    }
  };
};

// 页面一进来就会生成的访客标识符
const getUnid = () => {
  let ramdomNum = Math.random().toString().slice(-6);
  ramdomNum = parseInt(ramdomNum).toString(16);
  let timestamp = Date.parse(new Date());
  let Oxtimestamp = parseInt(timestamp).toString(16);
  return `za-${ramdomNum}-${Oxtimestamp}`;
};

//扫码普通二维码
const getScanParams = (query = {}) => {
  let params = {};
  if (query.q) {
    let url = decodeURIComponent(query.q);
    // url http://www.a.com?name=zs&age=18;
    let paramStr = url.split(/\/\?/)[1];
    let item = paramStr.split("&");
    for (let index = 0; index < item.length; index++) {
      let a = item[index].split("=");
      params[a[0]] = a[1];
    }
  }
  return params;
};

// 扫码带参数的小程序码
const getScanParamsMp = (query = {}) => {
  let params = {};
  if (JSON.stringify(query) !== "{}" && query.scene) {
    let scene = decodeURIComponent(query.scene);

    scene.split("&").forEach((item) => {
      params[item.split("=")[0]] = item.split("=")[1];
    });
  }

  return params;
};

const warn = (message, duration = 2000) => {
  wx.showToast({
    duration,
    icon: "none",
    title: message,
  });
};

//要为2位小数，而且不四舍五入，比如1.378，变成1.37
const formatFloatNumber = (num) => {
  const formatString = num.toString();
  const spot = formatString.indexOf(".");
  const length = formatString.length;

  switch (spot) {
    case -1:
      num += ".00";
      break;
    case length - 2:
      num += "0";
      break;
    default:
      num = formatString.slice(0, spot + 3);
      break;
  }

  return num;
};

const querySelector = ({ target = "", context, callback }) => {
  if (!target) {
    throw new Error("querySelector: target is required");
  }
  const _query = context.createSelectorQuery();
  _query.selectAll(target).boundingClientRect((res) => {
    typeof callback === "function" && callback(res);
  });
  _query.exec();
};

const scrollViewByTop = ({
  context = wx,
  target = "",
  offset = 0,
  match = () => true,
  success,
  fail,
  complete,
}) => {
  if (typeof match !== "function") {
    throw new Error("scrollViewByTop: match must be a function");
  }

  querySelector({
    target,
    context,
    callback(res) {
      let _el;
      for (const el of res) {
        if (match(el)) {
          _el = el;
          break;
        }
      }
      const _top = (_el && _el.top) || void 0;
      if (_top !== void 0) {
        wx.pageScrollTo({
          scrollTop: _top + offset,
          success() {
            typeof success === "function" && success(_el);
          },
          fail(e) {
            typeof fail === "function" && fail(e);
          },
          complete() {
            typeof complete === "function" && complete();
          },
        });
      }
    },
  });
};

const getCurrentPageQueryParams = () => {
  let pages = getCurrentPages(); //获取加载的页面
  let currentPage = pages[pages.length - 1]; //获取当前页面的对象
  let options = currentPage.options || {}; //如果要获取url中所带的参数可以查看options
  return options;
};

/**
 * @description 从字符串中筛选出汉字，只适用于基本汉字
 * @param {string} value 被筛选的字符串
 * @returns {string} 只包含汉字的字符串
 */
const filterChinese = (value) => value.replace(/[^\u4E00-\u9FA5]/g, "");

const getUrl = (url) => {
  let arr = url.split("?");
  let res = arr[1].split("&");
  let items = {};
  for (let i = 0; i < res.length; i++) {
    let a = res[i].split("=");
    items[a[0]] = a[1];
  }
  return items;
};

const isEmpty = (v) => {
  const typeString = Object.prototype.toString.call(v);
  if (typeString.includes("Number")) {
    return v < 0;
  }
  if (typeString.includes("Array")) {
    return v.length === 0;
  }
  if (typeString.includes("Object")) {
    return Object.keys(v).length === 0;
  }
  if (typeString.includes("String")) {
    return v === "" || v === "-1";
  }
  return !v;
};

module.exports = {
  warn,
  once,
  uuid,
  match,
  _isExit,
  isRange,
  loading,
  weekDesc,
  _compare,
  throttle,
  debounce,
  formatDate,
  formatTime,
  getCountdownTime,
  getDay2Week,
  getDateTime,
  setNavTitle,
  getNavTitle,
  getSevenDay,
  wobblyAnimate,
  baseFormatDate,
  formatDateTime,
  getBirthDayFromIdCard,
  getInfoData,
  getDateDiff,
  getUnid,
  getScanParams,
  getScanParamsMp,
  formatFloatNumber,
  scrollViewByTop,
  getCurrentPageQueryParams,
  filterChinese,
  formatMonthDay,
  getOldDay,
  getUrl,
  isEmpty,
};
