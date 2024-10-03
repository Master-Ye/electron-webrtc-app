const { EventEmitter } = require('events')

const peer = new EventEmitter()
const { ipcRenderer } = window.electron

async function getScreenStream() {
  ipcRenderer.on('SET_SOURCE', async (e, sourceId) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          maxWidth: window.screen.width,
          maxHeight: window.screen.height
        }
      }
    })
    console.log(stream)
    peer.emit('add-stream', stream)
  })
}

getScreenStream()

peer.on('root', (type, data) => {
  console.log('robot,', type, data)

  if (type === 'mouse') {
    data.screen = {
      width: window.screen.width,
      height: window.screen.height
    }
  }

  setTimeout(() => {
    ipcRenderer.send('robot', type, data)
  }, 1000)
})

export default peer
