const { BrowserWindow } = require("electron");
let offscreenWin;

module.exports = (url, callback) => {
  offscreenWin = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true,
    },
  });
  offscreenWin.loadURL(url);

  offscreenWin.webContents.on("did-finish-load", () => {
    let title = offscreenWin.getTitle();
    offscreenWin.webContents.capturePage().then((img) => {
      let dataURL = img.toDataURL();

      callback({ title, screenshot: dataURL, url });

      offscreenWin.close();
      offscreenWin = null;
    });
  });
};
