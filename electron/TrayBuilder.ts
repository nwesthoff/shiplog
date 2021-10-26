import { BrowserWindow, Menu, Tray } from 'electron';
import * as path from 'path';
import * as positioner from 'electron-traywindow-positioner';

export class TrayBuilder {
  tray: Tray | null;
  mainWindow: BrowserWindow | null;

  constructor(mainWindow: BrowserWindow | null) {
    this.tray = null;
    this.mainWindow = mainWindow;
  }

  showWindow = () => {
    if (this.mainWindow == null || this.tray == null) {
      return;
    }

    const trayBounds = this.tray.getBounds();
    const alignment = { x: 'center', y: 'down' };
    positioner.position(this.mainWindow, trayBounds, alignment);

    this.mainWindow.show();
    this.mainWindow.focus();
  };

  toggleWindow = () => {
    if (this.mainWindow == null) {
      return;
    }
    return this.mainWindow.isVisible() ? this.mainWindow.hide() : this.showWindow();
  };

  onRightClick = () => {
    if (this.tray == null) {
      return;
    }
    const menu = [
      {
        role: 'quit',
        accelerator: 'Command+Q',
        label: 'Quit Shiplog',
      },
    ];
    this.tray.popUpContextMenu(Menu.buildFromTemplate(menu as any));
  };

  build = () => {
    this.tray = new Tray(path.join(__dirname, './assets/IconDefaultTemplate.png'));
    this.tray.setIgnoreDoubleClickEvents(true);

    this.tray.on('click', this.toggleWindow);
    this.tray.on('right-click', this.onRightClick);
  };
}
