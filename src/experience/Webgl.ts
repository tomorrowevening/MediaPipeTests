import { FaceLandmarkerResult, GestureRecognizerResult, PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import { ColorManagement, LinearSRGBColorSpace, Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Scene, VideoTexture, WebGLRenderer } from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Faces from './faces';
import Gestures from './gestures'
import Poses from './poses';

export default class Webgl {
  // Webgl
  renderer: WebGLRenderer
  scene: Scene
  camera: OrthographicCamera
  // camera: PerspectiveCamera
  // orbit: OrbitControls
  // Mesh
  faces: Faces
  gestures: Gestures
  poses: Poses

  constructor(canvas: HTMLCanvasElement, video: HTMLVideoElement) {
    ColorManagement.enabled = false
    this.renderer = new WebGLRenderer({
      alpha: true,
      canvas,
      stencil: false,
    })
    this.renderer.outputColorSpace = LinearSRGBColorSpace

    this.scene = new Scene()
    this.scene.name = 'Detection'
    this.camera = new OrthographicCamera(0, 1, 0, -1, 1, 100)
    // this.camera = new PerspectiveCamera(60, canvas.width / canvas.height, 0.01, 100)
    this.camera.position.z = 2

    // this.orbit = new OrbitControls(this.camera, canvas)

    const videoTexture = new VideoTexture(video)
    const bg = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: videoTexture }))
    bg.name = 'bg'
    bg.position.set(0.5, -0.5, -5)
    this.scene.add(bg)

    this.faces = new Faces()
    this.scene.add(this.faces)

    this.gestures = new Gestures()
    this.scene.add(this.gestures)

    this.poses = new Poses()
    this.scene.add(this.poses)
  }

  dispose() {
    this.renderer.dispose()
  }

  update() {
    // this.orbit.update()
    this.faces.update()
    this.gestures.update()
    this.poses.update()
  }

  draw() {
    this.renderer.render(this.scene, this.camera)
  }

  resize(width: number, height: number) {
    this.renderer.setSize(width, height)
    // this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  // Getters / Setters

  get faceResult(): FaceLandmarkerResult | undefined {
    return this.faces.faceResult
  }

  set faceResult(value: FaceLandmarkerResult | undefined) {
    this.faces.faceResult = value
  }

  get gestureResult(): GestureRecognizerResult | undefined {
    return this.gestures.gestureResult
  }

  set gestureResult(value: GestureRecognizerResult | undefined) {
    this.gestures.gestureResult = value
  }

  get poseResult(): PoseLandmarkerResult | undefined {
    return this.poses.poseResult
  }

  set poseResult(value: PoseLandmarkerResult | undefined) {
    this.poses.poseResult = value
  }
}
