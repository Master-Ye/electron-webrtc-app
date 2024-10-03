import { shell, BrowserWindow, desktopCapturer } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

let win
export const createWindow = () => {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 900,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.on('ready-to-show', () => {
    win.show()
    desktopCapturer.getSources({ types: ['screen'] }).then(async (sources) => {
      win.webContents.send('SET_SOURCE', sources[0].id)
    })
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/pages/control/index.html`)
    win.webContents.openDevTools()
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

export const send = (channel, ...args) => {
  win.webContents.send(channel, ...args)
}
