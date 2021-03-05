const { app, screen, BrowserWindow } = require('electron');
const path = require('path');
const windowStateKeeper = require('electron-window-state');


const isProd = app.isPackaged;

module.exports = function createWindow(windowName = 'main', options = {}) {
  const winOptions = {
    minWidth: 1260,
    minHeight: 800,
    autoHideMenuBar: true,
    trafficLightPosition: {
      x: 20,
      y: 32,
    },
    ...options,
    webPreferences: {
      contextIsolation: true,
      devTools: !isProd,
      spellcheck: false,
      nodeIntegration: true,
      preload: path.join(app.getAppPath(), 'electron/renderer/preload.js'),
      ...(options.webPreferences || {}),
    },
  };

  const windowState = windowStateKeeper({
    defaultWidth: winOptions.minWidth,
    defaultHeight: winOptions.minHeight,
  });

  const win = new BrowserWindow({
    ...winOptions,
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
  });
  windowState.manage(win);

  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });

  return win;
};
