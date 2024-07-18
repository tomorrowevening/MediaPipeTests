import { FaceLandmarkerResult, NormalizedLandmark } from '@mediapipe/tasks-vision';
import { Object3D } from 'three';
import DynamicPoints from './DynamicPoints';
import { TOTAL_FACES } from './types';

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
      const total = this.faceResult.faceLandmarks.length
      for (let i = 0; i < TOTAL_FACES; i++) {
        const item = this.items[i]
        item.visible = i < total
        if (item.visible) {
          this.faceResult.faceLandmarks[i].forEach((landmark: NormalizedLandmark, index: number) => {
            const n = index * 3
            item.positions[n + 0] = landmark.x
            item.positions[n + 1] = -landmark.y
            item.positions[n + 2] = landmark.z
          })
          item.geometry.attributes.position.needsUpdate = true
        }
      }
    } else {
      this.items.forEach((item: DynamicPoints) => item.visible = false)
    }
  }
}
