import { FaceLandmarkerResult } from '@mediapipe/tasks-vision';
import { Object3D } from 'three';
import DynamicPoints from './DynamicPoints';
import { TOTAL_FACES } from './constants';
import { cycleLandmarks } from './utils';

export default class Faces extends Object3D {
  faceResult?: FaceLandmarkerResult
  items: DynamicPoints[] = []

  constructor() {
    super()
    this.name = 'faces'
    for (let i = 0; i < TOTAL_FACES; i++) {
      const item = new DynamicPoints(478, 0xff0000)
      item.name = `face_${i}`
      this.items.push(item)
      this.add(item)
    }
  }

  update() {
    this.visible = this.faceResult !== undefined
    if (this.faceResult) {
      const landmarks = this.faceResult.faceLandmarks
      cycleLandmarks(landmarks, this.items, TOTAL_FACES)
    } else {
      this.items.forEach((item: DynamicPoints) => item.visible = false)
    }
  }
}
