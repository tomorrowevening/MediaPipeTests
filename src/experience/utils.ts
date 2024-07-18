import { NormalizedLandmark } from '@mediapipe/tasks-vision';
import DynamicPoints from './DynamicPoints';

export function applyLandmark(landmarks: NormalizedLandmark[], item: DynamicPoints) {
  landmarks.forEach((landmark: NormalizedLandmark, index: number) => {
    const n = index * 3
    item.positions[n + 0] = landmark.x
    item.positions[n + 1] = -landmark.y
    item.positions[n + 2] = landmark.z
  })
  item.geometry.attributes.position.needsUpdate = true
}

export function cycleLandmarks(landmarks: NormalizedLandmark[][], items: DynamicPoints[], total: number) {
  const totalLandmarks = landmarks.length
  for (let i = 0; i < total; i++) {
    const item = items[i]
    item.visible = i < totalLandmarks
    if (item.visible) applyLandmark(landmarks[i], item)
  }
}