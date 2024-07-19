import { GestureRecognizerResult } from '@mediapipe/tasks-vision';
import { Object3D } from 'three';
import DynamicPoints from '../DynamicPoints';
import { DEFAULT_GESTURE, GESTURE_FOUND, GESTURE_LOST, TOTAL_GESTURES } from '../constants';
import { updateLandmarkGeom } from '../utils';

export default class Gestures extends Object3D {
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
      const totalLandmarks = landmarks.length
      const gestures = this.gestureResult.gestures
      const totalGestures = gestures.length
      const handedness = this.gestureResult.handedness
      for (let i = 0; i < TOTAL_GESTURES; i++) {
        const item = this.items[i]
        item.visible = i < totalLandmarks
        if (item.visible) {
          if (i < totalGestures) {
            const changed = gestures[i][0].categoryName !== this.categoryNames[i]
            if (changed) {
              console.log('gesture:', i, gestures[i][0].categoryName, handedness[i][0].categoryName)
              this.categoryNames[i] = gestures[i][0].categoryName
              // @ts-ignore
              this.dispatchEvent({ type: GESTURE_FOUND, value: item, name: this.categoryNames[i] })
            }
          }

          updateLandmarkGeom(landmarks[i], item)
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
