import { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { between, getAngle, toDeg } from '../math';

// Arms raised
const raisedLimits = {
  shoulderToElbow: [-120, -60],
  elbowToWrist: [-120, -60],
}

export function isArmRaised(shoulder: NormalizedLandmark, elbow: NormalizedLandmark, wrist: NormalizedLandmark): boolean {
  const shoulderToElbowAngle = toDeg(getAngle(shoulder.x, shoulder.y, elbow.x, elbow.y))
  const shoulderToElbow = between(raisedLimits.shoulderToElbow[0], raisedLimits.shoulderToElbow[1], shoulderToElbowAngle)
  if (shoulderToElbow) {
    const elbowToWristAngle = toDeg(getAngle(elbow.x, elbow.y, wrist.x, wrist.y))
    return between(raisedLimits.elbowToWrist[0], raisedLimits.elbowToWrist[1], elbowToWristAngle)
  }
  return false
}

// YMCA

export function isArmPose(shoulder: NormalizedLandmark, elbow: NormalizedLandmark, wrist: NormalizedLandmark, limits: number[]): boolean {
  const shoulderToElbowAngle = toDeg(getAngle(shoulder.x, shoulder.y, elbow.x, elbow.y))
  const shoulderToElbow = between(limits[0] - 15, limits[0] + 15, shoulderToElbowAngle)
  if (shoulderToElbow) {
    const elbowToWristAngle = toDeg(getAngle(elbow.x, elbow.y, wrist.x, wrist.y))
    return between(limits[1] - 15, limits[1] + 15, elbowToWristAngle)
  }
  return false
}
