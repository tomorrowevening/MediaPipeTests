import { GestureRecognizerResult, NormalizedLandmark } from '@mediapipe/tasks-vision';
import { Object3D } from 'three';
import DynamicPoints from './DynamicPoints';
import { GESTURE_FOUND, GESTURE_LOST, TOTAL_GESTURES } from './types';

const defaultPose = 'None'

export default class Hands extends Object3D {
  gestureResult?: GestureRecognizerResult
  items: DynamicPoints[] = []
  categoryNames: string[] = []

  constructor() {
    super()
    this.name = 'hands'
    for (let i = 0; i < TOTAL_GESTURES; i++) {
      const item = new DynamicPoints(21, 0xffff00)
      item.name = `gesture_${i}`
      this.items.push(item)
      this.add(item)
      this.categoryNames.push(defaultPose)
    }
  }

  update() {
    this.visible = this.gestureResult !== undefined
    if (this.gestureResult) {
      const total = this.gestureResult.landmarks.length
      for (let i = 0; i < TOTAL_GESTURES; i++) {
        const item = this.items[i]
        item.visible = i < total
        if (item.visible) {
          const changed = this.gestureResult.gestures[i][0].categoryName !== this.categoryNames[i]
          if (changed) {
            // console.log(i, this.gestureResult.gestures[i][0].categoryName, 'from:', this.categoryNames[i])
            this.categoryNames[i] = this.gestureResult.gestures[i][0].categoryName
            // @ts-ignore
            this.dispatchEvent({ type: GESTURE_FOUND, value: item, name: this.categoryNames[i] })
          }

          this.gestureResult.landmarks[i].forEach((landmark: NormalizedLandmark, index: number) => {
            const n = index * 3
            item.positions[n + 0] = landmark.x
            item.positions[n + 1] = -landmark.y
            item.positions[n + 2] = landmark.z
          })
          item.geometry.attributes.position.needsUpdate = true
        } else if (this.categoryNames[i] !== defaultPose) {
          // console.log(i, 'reset')
          this.categoryNames[i] = defaultPose
          // @ts-ignore
          this.dispatchEvent({ type: GESTURE_LOST, value: item })
        }
      }
    } else {
      this.items.forEach((item: DynamicPoints) => item.visible = false)
    }
  }
}
