const { app, ipcMain, dialog } = require('electron');
const contextMenu = require('electron-context-menu');
const createWindow = require('./electron/main/create-window.js');


try {
  require('electron-reloader')(module);
} catch {}

contextMenu({
  showSearchWithGoogle: false,
  showCopyImage: false,
});

const isDev = !app.isPackaged;

let mainWindow;

function loadVitePage(port) {
  mainWindow.loadURL(`http://localhost:${port}`).catch((err) => {
    console.log('VITE NOT READY, WILL TRY AGAIN IN 200ms');
    setTimeout(() => {
      // do it again as the vite build can take a bit longer the first time
      loadVitePage(port);
    }, 200);
  });
}

function createMainWindow() {
  mainWindow = createWindow('main');
  mainWindow.once('close', () => {
    mainWindow = null;
  });

  ipcMain.handle('open-file', async () => dialog
    .showOpenDialog({ properties: ['openDirectory'] }));

  ipcMain.handle('save-as', async () => dialog
    .showSaveDialog({ properties: ['createDirectory'] }));

  const port = process.env.PORT || 3333;
  if (isDev) {
    loadVitePage(port);
  } else {
    mainWindow.loadFile('dist/index.html');
  }
}

app.once('ready', createMainWindow);
app.on('activate', () => {
  if (!mainWindow) {
    createMainWindow();
  }
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
