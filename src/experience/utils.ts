import { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { Bone, Skeleton } from 'three';
import DynamicPoints from './DynamicPoints';

export function updateLandmarkGeom(landmarks: NormalizedLandmark[], item: DynamicPoints) {
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
    if (item.visible) updateLandmarkGeom(landmarks[i], item)
  }
}

export function createBone(name: string, bones: Bone[]) {
  const bone = new Bone()
  bone.name = name.toLowerCase()
  bones.push(bone)
  return bone
}

export function createHandSkeleton() {
  const bones: Bone[] = []
  const WRIST = createBone('WRIST', bones)

  // Thumb
  const THUMB_CMC = createBone('THUMB_CMC', bones)
  WRIST.add(THUMB_CMC)

  const THUMB_MCP = createBone('THUMB_MCP', bones)
  THUMB_CMC.add(THUMB_MCP)

  const THUMB_IP = createBone('THUMB_IP', bones)
  THUMB_MCP.add(THUMB_IP)

  const THUMB_TIP = createBone('THUMB_TIP', bones)
  THUMB_IP.add(THUMB_TIP)

  // Index
  const INDEX_FINGER_MCP = createBone('INDEX_FINGER_MCP', bones)
  WRIST.add(INDEX_FINGER_MCP)

  const INDEX_FINGER_PIP = createBone('INDEX_FINGER_PIP', bones)
  INDEX_FINGER_MCP.add(INDEX_FINGER_PIP)

  const INDEX_FINGER_DIP = createBone('INDEX_FINGER_DIP', bones)
  INDEX_FINGER_PIP.add(INDEX_FINGER_DIP)

  const INDEX_FINGER_TIP = createBone('INDEX_FINGER_TIP', bones)
  INDEX_FINGER_DIP.add(INDEX_FINGER_TIP)

  // Middle
  const MIDDLE_FINGER_MCP = createBone('MIDDLE_FINGER_MCP', bones)
  WRIST.add(MIDDLE_FINGER_MCP)

  const MIDDLE_FINGER_PIP = createBone('MIDDLE_FINGER_PIP', bones)
  MIDDLE_FINGER_MCP.add(MIDDLE_FINGER_PIP)

  const MIDDLE_FINGER_DIP = createBone('MIDDLE_FINGER_DIP', bones)
  MIDDLE_FINGER_PIP.add(MIDDLE_FINGER_DIP)

  const MIDDLE_FINGER_TIP = createBone('MIDDLE_FINGER_TIP', bones)
  MIDDLE_FINGER_DIP.add(MIDDLE_FINGER_TIP)

  // Ring
  const RING_FINGER_MCP = createBone('RING_FINGER_MCP', bones)
  WRIST.add(RING_FINGER_MCP)

  const RING_FINGER_PIP = createBone('RING_FINGER_PIP', bones)
  RING_FINGER_MCP.add(RING_FINGER_PIP)

  const RING_FINGER_DIP = createBone('RING_FINGER_DIP', bones)
  RING_FINGER_PIP.add(RING_FINGER_DIP)

  const RING_FINGER_TIP = createBone('RING_FINGER_TIP', bones)
  RING_FINGER_DIP.add(RING_FINGER_TIP)

  // Pinky
  const PINKY_MCP = createBone('PINKY_MCP', bones)
  WRIST.add(PINKY_MCP)

  const PINKY_PIP = createBone('PINKY_PIP', bones)
  PINKY_MCP.add(PINKY_PIP)

  const PINKY_DIP = createBone('PINKY_DIP', bones)
  PINKY_PIP.add(PINKY_DIP)

  const PINKY_TIP = createBone('PINKY_TIP', bones)
  PINKY_DIP.add(PINKY_TIP)

  const skeleton = new Skeleton(bones)
  return skeleton
}
