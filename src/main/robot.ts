import { ipcMain } from 'electron'
import robot from 'robotjs'
import vkey from 'vkey'

const handleMouse = (data) => {
  const { clientX, clientY, screen, video } = data

  const x = (clientX * screen.width) / video.width
  const y = (clientY * screen.height) / video.height

  robot.moveMouse(x, y)
  robot.mouseClick()
}

const handleKey = (data) => {
  const modifiers: string[] = []
  if (data.meta) modifiers.push('meta')
  if (data.ctrl) modifiers.push('ctrl')
  if (data.shift) modifiers.push('shift')
  if (data.alt) modifiers.push('alt')

  const key = vkey[data.keyCode].toLowerCase()

  robot.keyTap(key, modifiers)
}

export default function () {
  ipcMain.on('robot', (e, type, data) => {
    console.log('main robot', type, data)

    if (type === 'mouse') {
      handleMouse(data)
    } else if (type === 'key') {
      handleKey(data)
    }
  })
}
