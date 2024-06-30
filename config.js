// mock:本地模拟，develop:开发环境，test: 测试环境，produce:生产环境
export const ENV = "test";

// request接口域名
export const baseUrl = (() => {
  let baseUrl = "";
  switch (ENV) {
    case "mock":
      baseUrl = "";
      break;
    case "develop":
      baseUrl = "";
      break;
    case "test":
      baseUrl = "";
      break;
    case "produce":
      baseUrl = "";
      break;
    case "local":
      baseUrl = "http://localhost:2333/";
      break;
  }
  return baseUrl;
})();
