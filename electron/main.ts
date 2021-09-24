import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as isDev from 'electron-is-dev';
import path = require('path');
import { launchAtStartup } from './launchAtStartup';
import { TrayBuilder } from './TrayBuilder';

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    backgroundColor: 'white',
    width: 720,
    height: 400,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nativeWindowOpen: true,
      devTools: isDev,
      preload: path.join(__dirname, 'preload.js'),
      backgroundThrottling: false,
    },
  });

  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${__dirname}/../index.html`
  );

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  !isDev && launchAtStartup(app, mainWindow);

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
};

let Tray: TrayBuilder | null = null;

app.whenReady().then(() => {
  createWindow();
  Tray = new TrayBuilder(mainWindow);
  Tray.build();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

process.platform === 'darwin' && app.dock.hide();

ipcMain.on('buildState', (_e, data) => {
  console.log(data);
  if (data === 'building') {
    Tray?.tray && Tray.tray.setImage('./electron/assets/AnchorTemplate.png');
  } else {
    Tray?.tray && Tray.tray.setImage('./electron/assets/IconTemplate.png');
  }
});
