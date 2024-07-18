import { FaceLandmarker, FilesetResolver, GestureRecognizer, PoseLandmarker, PoseLandmarkerResult } from '@mediapipe/tasks-vision'
import Webgl from './Webgl'
import { Clock } from 'three'
import { TOTAL_FACES, TOTAL_GESTURES, TOTAL_POSES } from './constants'

const visionURL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
const posePath = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'
const facePath = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
const gesturePath = 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task'

export default class Application {
  log?: HTMLElement
  video!: HTMLVideoElement
  width = 0
  height = 0
  detectFace = true
  detectPose = true
  detectGesture = true

  private raf = -1
  private ready = false
  private webgl!: Webgl
  private clock = new Clock()

  // MediaPipe
  private poseLandmarker?: PoseLandmarker
  private faceLandmarker?: FaceLandmarker
  private gestureRecognizer?: GestureRecognizer

  async init(canvas: HTMLCanvasElement, log: HTMLElement, video: HTMLVideoElement) {
    this.log = log

    const vision = await FilesetResolver.forVisionTasks(visionURL)
    if (this.detectPose) await this.createPoseLandmarker(vision)
    if (this.detectFace) await this.createFaceLandmarker(vision)
    if (this.detectGesture) await this.createGestureRecognizer(vision)

    this.webgl = new Webgl(canvas, video)
    this.clock.start()
    this.ready = true
    console.clear()
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    this.raf = -1
    this.detectPose = false
    this.detectFace = false
    this.detectGesture = false
    if (this.ready) {
      this.poseLandmarker?.close()
      this.faceLandmarker?.close()
      this.gestureRecognizer?.close()
    }
  }

  update = () => {
    const delta = this.clock.getDelta()
    const fps = Math.round(1 / delta)
    if (this.log) this.log.innerHTML = `FPS: ${fps}`

    if (this.video) this.updateDetection()
    this.webgl.update()
    this.webgl.draw()
    this.raf = requestAnimationFrame(this.update)
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
    this.webgl.resize(width, height)
  }

  /*
  draw(delta: number) {
    const ctx = this.context!
    const drawBox = (x: number, y: number, total: number, title: string) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(x, y, 200, (total + 1) * 20 + 10);
      ctx.fillStyle = '#FFFFFF'
      ctx.fillText(title, x + 10, y + 20)
    }

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.font = '12px Arial'
    drawBox(this.width - 200, 0, 0, `FPS: ${(1000 / delta).toFixed(2)}`)

    if (this.video) {
      this.updateDetection()
      
      // Draw Gestures
      let totalGestures = 0
      if (this.gestureResult !== undefined) {
        totalGestures = this.gestureResult.gestures.length
        if (totalGestures > 0) {
          for (const landmark of this.gestureResult.landmarks) {
            this.drawingUtils?.drawConnectors(landmark, GestureRecognizer.HAND_CONNECTIONS, { lineWidth: 1 })
          }
        }
      }

      // Draw Poses
      let totalPoses = 0
      if (this.poseResult !== undefined) {
        totalPoses = this.poseResult.landmarks.length
        for (const landmark of this.poseResult.landmarks) {
          const total = landmark.length
          for (let i = 11; i < total; i++) {
            const x = landmark[i].x * this.width
            const y = landmark[i].y * this.height
            ctx.beginPath()
            ctx.arc(x, y, 5, 0, PI2, false);
            const color = `rgba(255, 0, 0, ${landmark[i].visibility})`
            ctx.fillStyle = color
            ctx.fill()
          }
          this.drawingUtils?.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS, { lineWidth: 1 });
        }
      }

      // Draw Faces
      let totalFaces = 0
      if (this.faceResult !== undefined) {
        if (this.faceResult.faceLandmarks.length > 0) {
          totalFaces = this.faceResult.faceLandmarks.length
          for (const landmarks of this.faceResult.faceLandmarks) {
            this.drawingUtils?.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { lineWidth: 1 });
          }
        }
      }

      ////////////////////
      // Faces
      drawBox(0, 0, totalFaces, `Faces: ${totalFaces}`)
      this.faceResult?.faceBlendshapes.forEach((value: Classifications, index: number) => {
        const categories = [ ...value.categories ]
        categories.sort((a:Category, b: Category) => b.score - a.score)
        ctx.fillText(`Face ${index + 1}: ${categories[0].categoryName}: ${(categories[0].score * 100).toFixed(1)}%`, 10, index * 20 + 40)
      })

      // Hands
      drawBox(200, 0, totalGestures, `Hands: ${totalGestures}`)
      this.gestureResult?.gestures.forEach((value: Category[], index: number) => {
        const hand = value[0]
        ctx.fillText(`Hand ${index + 1}: ${hand.categoryName}, ${(hand.score * 100).toFixed(1)}%`, 210, index * 20 + 40)
      })

      // Poses
      drawBox(400, 0, 0, `Pose: ${totalPoses}`)
    }
  }
  */

  private updateDetection() {
    // Gestures
    this.webgl.gestureResult = this.detectGesture ? this.gestureRecognizer?.recognizeForVideo(this.video, performance.now()) : undefined

    // Pose
    if (this.detectPose) {
      this.poseLandmarker?.detectForVideo(this.video, performance.now(), (result: PoseLandmarkerResult) => {
        this.webgl.poseResult = result
      })
    } else {
      this.webgl.poseResult = undefined
    }

    // Face
    this.webgl.faceResult = this.detectFace ? this.faceLandmarker?.detectForVideo(this.video, performance.now()) : undefined
  }

  //////////////////////////////////////////////////
  // Detection

  private async createPoseLandmarker(vision: any) {
    this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: posePath,
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numPoses: TOTAL_POSES,
    });
  }

  private async createFaceLandmarker(vision: any) {
    this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: facePath,
        delegate: 'GPU',
      },
      outputFaceBlendshapes: true,
      runningMode: 'VIDEO',
      numFaces: TOTAL_FACES,
    })
  }

  private async createGestureRecognizer(vision: any) {
    this.gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: gesturePath,
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numHands: TOTAL_GESTURES,
    })
  }
}