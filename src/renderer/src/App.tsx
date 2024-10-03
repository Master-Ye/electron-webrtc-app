import { useEffect, useState } from 'react'
import Versions from './components/Versions'

function App(): JSX.Element {
  const { ipcRenderer } = window.electron
  const [localCode, setLocCode] = useState('')
  const [remoteCode, setRemoteCode] = useState('')
  const [controlText, setControlText] = useState('')

  const startControl = () => {
    ipcRenderer.send('control', remoteCode)
  }

  const login = async () => {
    const code = await ipcRenderer.invoke('login')
    setLocCode(code)
  }
  const handleControlState = (e, name, type) => {
    let text = ''

    if (type === '1') {
      // 控制别人
      text = `正在远程控制${name}`
    } else if (type === '2') {
      // 被别人控制
      text = `被${name}控制中`
    }

    setControlText(text)
  }

  useEffect(() => {
    login()

    ipcRenderer.on('control-state-change', handleControlState)

    return () => {
      ipcRenderer.removeListener('control-state-change', handleControlState)
    }
  }, [])
  return (
    <div className="container">
      <Versions></Versions>
      {controlText ? (
        <div>{controlText}</div>
      ) : (
        <>
          <div>你的控制码{localCode}</div>
          <input type="text" value={remoteCode} onChange={(e) => setRemoteCode(e.target.value)} />
          <button onClick={startControl}>确认</button>
        </>
      )}
    </div>
  )
}

export default App
