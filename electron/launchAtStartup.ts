import { App, BrowserWindow } from 'electron';
import * as path from 'path';
import { localStore } from '../src/config/localStorage';

export function launchAtStartup(app: App, mainWindow: BrowserWindow) {
  const appFolder = path.dirname(process.execPath);
  const updateExe = path.resolve(appFolder, '..', 'Update.exe');
  const exeName = path.basename(process.execPath);

  mainWindow.webContents
    .executeJavaScript(`localStorage.getItem(${localStore.startAtLogin});`, true)
    .then((result) => {
      if (process.platform === 'darwin') {
        app.setLoginItemSettings({
          openAtLogin: result,
          openAsHidden: true,
          path: process.execPath,
        });
      } else {
        app.setLoginItemSettings({
          openAtLogin: result,
          openAsHidden: true,
          path: updateExe,
          args: ['--processStart', `"${exeName}"`, '--process-start-args', `"--hidden"`],
        });
      }
    });
}
