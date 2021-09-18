import { app, BrowserWindow, shell } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
import { localStore } from '../src/config/localStorage';
import { TrayBuilder } from './TrayBuilder';

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    backgroundColor: 'white',
    width: 680,
    height: 360,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nativeWindowOpen: true,
      devTools: isDev,
      nodeIntegration: true,
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

  const exeName = path.basename(process.execPath);
  mainWindow.webContents
    .executeJavaScript(`localStorage.getItem(${localStore.startAtLogin});`, true)
    .then((result) => {
      app.setLoginItemSettings({
        openAtLogin: result,
        args: ['--processStart', `"${exeName}"`, '--process-start-args', `"--hidden"`],
      });
    });

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
