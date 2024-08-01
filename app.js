App({
  onLaunch(option) {
    const catteryId = option.query.catteryId;
    wx.setStorageSync("catteryId", catteryId);
  },
  onError(err) {
    console.log("App.onError", err);
  },
  onPageNotFound(err) {
    console.log("App.onPageNotFound", err);
  },
});
