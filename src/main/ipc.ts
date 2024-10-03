import { ipcMain } from 'electron'
import { send as sendMainWindow } from './windows/main'
import { createWindow as createControlWindow } from './windows/control'

export default function () {
  ipcMain.handle('login', async () => {
    // localcode
    // mock
    const code = Math.floor(Math.random() * (999999 - 100000) + 100000)
    return code
  })
  ipcMain.on('control', async (e, remodeCode) => {
    sendMainWindow('control-state-change', remodeCode, '1')
    createControlWindow()
  })
}
