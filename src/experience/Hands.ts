import { GestureRecognizerResult, NormalizedLandmark } from '@mediapipe/tasks-vision';
import { Object3D } from 'three';
import DynamicPoints from './DynamicPoints';
import { DEFAULT_GESTURE, GESTURE_FOUND, GESTURE_LOST, TOTAL_GESTURES } from './constants';
import { applyLandmark } from './utils';

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
      this.categoryNames.push(DEFAULT_GESTURE)
    }
  }

  update() {
    this.visible = this.gestureResult !== undefined
    if (this.gestureResult) {
      const landmarks = this.gestureResult.landmarks
      const total = landmarks.length
      for (let i = 0; i < TOTAL_GESTURES; i++) {
        const item = this.items[i]
        item.visible = i < total
        if (item.visible) {
          const changed = this.gestureResult.gestures[i][0].categoryName !== this.categoryNames[i]
          if (changed) {
            this.categoryNames[i] = this.gestureResult.gestures[i][0].categoryName
            // @ts-ignore
            this.dispatchEvent({ type: GESTURE_FOUND, value: item, name: this.categoryNames[i] })
          }

          applyLandmark(landmarks[i], item)
        } else if (this.categoryNames[i] !== DEFAULT_GESTURE) {
          this.categoryNames[i] = DEFAULT_GESTURE
          // @ts-ignore
          this.dispatchEvent({ type: GESTURE_LOST, value: item })
        }
      }
    } else {
      this.items.forEach((item: DynamicPoints) => item.visible = false)
    }
  }
}
