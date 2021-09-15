import { app, BrowserWindow, shell } from 'electron';
import * as isDev from 'electron-is-dev';
import { TrayBuilder } from './TrayBuilder';

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    backgroundColor: 'white',
    width: 600,
    height: 320,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
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
