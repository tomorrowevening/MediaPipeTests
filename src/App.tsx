import { useEffect, useRef, useState } from 'react'
import './App.css'
import Application from './experience/Application'
import { POSE_DETECTED } from './experience/constants'

function App() {
  // References
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const letterYRef = useRef<HTMLDivElement>(null)
  const letterMRef = useRef<HTMLDivElement>(null)
  const letterCRef = useRef<HTMLDivElement>(null)
  const letterARef = useRef<HTMLDivElement>(null)

  // States
  const [application] = useState(new Application())
  const [connected, setConnected] = useState(false)
  const [detectFaces, setDetectFaces] = useState(application.detectFace)
  const [detectHands, setDetectHands] = useState(application.detectGesture)
  const [detectPoses, setDetectPoses] = useState(application.detectPose)

  const resize = (width: number, height: number) => {
    const canvas = canvasRef.current!
    canvas.width = width
    canvas.height = height
    application.resize(width, height)
  }

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

  const onConnect = () => {
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
            console.error('Error accessing the webcam: ', error);
          });
      } else {
        alert('getUserMedia is not supported by your browser.');
      }
    }
  }

  useEffect(() => {
    const onPoseDetected = (evt: any) => {
      console.log(`Pose: ${evt.value}`)
      switch (evt.value) {
        case 'y':
          letterYRef.current!.style.display = 'block'
          break
        case 'm':
          letterMRef.current!.style.display = 'block'
          break
        case 'c':
          letterCRef.current!.style.display = 'block'
          break
        case 'a':
          letterARef.current!.style.display = 'block'
          break
      }
    }
    application.init(canvasRef.current!, logRef.current!, videoRef.current!).then(() => {
      application.webgl.poses.addEventListener(POSE_DETECTED, onPoseDetected)
    })
    return () => {
      application.webgl.poses.removeEventListener(POSE_DETECTED, onPoseDetected)
      application.dispose()
    }
  }, [application])

  return (
    <div className='container'>
      <canvas ref={canvasRef} width={1200} height={600} />
      <div className='overlay'>
        <div ref={letterYRef}>Y</div>
        <div ref={letterMRef}>M</div>
        <div ref={letterCRef}>C</div>
        <div ref={letterARef}>A</div>
      </div>
      {!connected && (
        <button onClick={onConnect}>Enable Webcam to Begin</button>
      )}
      <video ref={videoRef} />
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
