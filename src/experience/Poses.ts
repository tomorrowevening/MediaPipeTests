import { NormalizedLandmark, PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import { Object3D } from 'three';
import DynamicPoints from './DynamicPoints';
import { TOTAL_POSES } from './types';

export default class Poses extends Object3D {
  poseResult?: PoseLandmarkerResult
  items: DynamicPoints[] = []

  constructor() {
    super()
    this.name = 'poses'
    for (let i = 0; i < TOTAL_POSES; i++) {
      const item = new DynamicPoints(33, 0xff00ff)
      item.name = `pose_${i}`
      this.items.push(item)
      this.add(item)
    }
  }

  update() {
    this.visible = this.poseResult !== undefined
    if (this.poseResult) {
      const total = this.poseResult.landmarks.length
      for (let i = 0; i < TOTAL_POSES; i++) {
        const item = this.items[i]
        item.visible = i < total
        if (item.visible) {
          this.poseResult.landmarks[i].forEach((landmark: NormalizedLandmark, index: number) => {
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
