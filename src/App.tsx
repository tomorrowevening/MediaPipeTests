import { CSSProperties, useEffect, useRef, useState } from 'react'
import './App.css'
import Application from './experience/Application'

const application = new Application()

const style: CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '0',
  transform: 'translateX(-50%)'
}

function App() {
  // References
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  // States
  const [connected, setConnected] = useState(false)
  const [detectFaces, setDetectFaces] = useState(application.detectFace)
  const [detectHands, setDetectHands] = useState(application.detectGesture)
  const [detectPoses, setDetectPoses] = useState(application.detectPose)

  function resize(width: number, height: number) {
    const canvas = canvasRef.current!
    canvas.width = width
    canvas.height = height
    application.resize(width, height)
  }

  useEffect(() => {
    application.init(canvasRef.current!, logRef.current!, videoRef.current!)
    return () => {
      application.dispose()
    }
  }, [])

  const handleDetectFaces = () => {
    const value = !detectFaces
    application.detectFace = value
    setDetectFaces(value)
  }

  const handleDetectHands = () => {
    const value = !detectHands
    application.detectGesture = value
    setDetectHands(value)
  }

  const handleDetectPoses = () => {
    const value = !detectPoses
    application.detectPose = value
    setDetectPoses(value)
  }

  return (
    <div style={{ maxWidth: '1200px' }}>
      <canvas ref={canvasRef} width={1200} height={600} style={style} />
      {!connected && (
        <button
          onClick={() => {
            const video = videoRef.current
            if (video) {
              // Connect Webcam
              if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true })
                  .then((stream) => {
                    setConnected(true)
                    // Set the source of the video element to the stream from the webcam
                    video.srcObject = stream;
                    video.play();

                    setTimeout(() => {
                      const bounds = video.getBoundingClientRect()
                      application.video = video
                      resize(bounds.width, bounds.height)
                      application.update()
                    }, 500)
                  })
                  .catch((error) => {
                    console.error("Error accessing the webcam: ", error);
                  });
              } else {
                alert("getUserMedia is not supported by your browser.");
              }
            }
          }}
          style={{ ...style, ...{ top: '50%', transform: 'translate(-50%, -50%)', zIndex: 100 } }}
        >Enable Webcam to Begin</button>
      )}
      <video
        ref={videoRef}
        width={1200}
      />
      {connected && (
        <div className='options'>
          <div>Faces: <input checked={detectFaces} onChange={handleDetectFaces} type='checkbox' /></div>
          <div>Hands: <input checked={detectHands} onChange={handleDetectHands} type='checkbox' /></div>
          <div>Poses: <input checked={detectPoses} onChange={handleDetectPoses} type='checkbox' /></div>
        </div>
      )}
      <div ref={logRef}>FPS: 0</div>
    </div>
  )
}

export default App
