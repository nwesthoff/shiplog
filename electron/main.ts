import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
import { launchAtStartup } from './launchAtStartup';
import { TrayBuilder } from './TrayBuilder';

let mainWindow: BrowserWindow | null = null;
process.platform === 'darwin' && app.dock.hide();

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
    movable: false,
    title: 'Shiplog',
    webPreferences: {
      nativeWindowOpen: true,
      devTools: isDev,
      preload: path.join(__dirname, 'preload.js'),
      backgroundThrottling: false,
    },
  });
  mainWindow.setAlwaysOnTop(true, 'floating', 1);
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setFullScreenable(false);

  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${__dirname}/../index.html`
  );

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('blur', () => {
    mainWindow?.hide();
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

ipcMain.on('buildState', (_e, data) => {
  if (data === 'building') {
    Tray?.tray && Tray.tray.setImage(`${__dirname}/assets/IconBuildingTemplate.png`);
  } else {
    Tray?.tray && Tray.tray.setImage(`${__dirname}/assets/IconDefaultTemplate.png`);
  }
});
