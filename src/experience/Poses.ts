import { NormalizedLandmark, PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import { Object3D } from 'three';
import DynamicPoints from './DynamicPoints';
import { TOTAL_POSES } from './constants';
import { cycleLandmarks } from './utils';

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
      const landmarks = this.poseResult.landmarks
      cycleLandmarks(landmarks, this.items, TOTAL_POSES)
    } else {
      this.items.forEach((item: DynamicPoints) => item.visible = false)
    }
  }
}
