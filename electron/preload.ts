const { contextBridge, ipcRenderer } = require('electron');
import type { IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('ipc', {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel: string, func: (evt: IpcRendererEvent, args: any) => void) => {
    ipcRenderer.on(channel, func);
  },
});
