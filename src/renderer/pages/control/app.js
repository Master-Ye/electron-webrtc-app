import peer from './peer-control'

peer.on('add-stream', (stream) => {
  play(stream)
})

const video = document.getElementById('screen-video')

function play(stream) {
  video.srcObject = stream
  video.onloadedmetadata = () => video.play()
}

// 键盘事件监听
window.onkeydown = (event) => {
  // keycode meta alt ctrl shift

  let data = {
    keyCode: event.keyCode,
    shift: event.shiftKey,
    meta: event.metaKey,
    control: event.ctrlKey,
    alt: event.altKey
  }

  peer.emit('root', 'key', data)
}

window.onmouseup = (e) => {
  let data = {}

  data.clientX = e.clientX
  data.clientY = e.clientY
  data.video = {
    width: video.getBoundingClientRect().width,
    height: video.getBoundingClientRect().height
  }
  peer.emit('root', 'mouse', data)
}
