import { NormalizedLandmark, PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import { Object3D } from 'three';
import DynamicPoints from '../DynamicPoints';
import { POSE_DETECT_ARM_RAISE, POSE_DETECT_YMCA, POSE_DETECTED, TOTAL_POSES } from '../constants';
import { isArmPose, isArmRaised } from './poseDetection';
import { cycleLandmarks } from '../utils';
import { PoseLandmark } from '../types';

export default class Poses extends Object3D {
  poseResult?: PoseLandmarkerResult
  items: DynamicPoints[] = []
  currentPose = ''

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
      console.log(this.poseResult)
      const landmarks = this.poseResult.landmarks
      cycleLandmarks(landmarks, this.items, TOTAL_POSES)

      if (POSE_DETECT_ARM_RAISE || POSE_DETECT_YMCA) {
        // TODO: Cycle through every landmark to account for multiple people
        this.detectPoses(landmarks[0])
      }
    } else {
      this.items.forEach((item: DynamicPoints) => item.visible = false)
    }
  }

  private detectPoses(landmarks: NormalizedLandmark[]) {
    const currentPose = this.currentPose

    // Arms raised?
    if (POSE_DETECT_ARM_RAISE) {
      const leftArmRaised = isArmRaised(landmarks[PoseLandmark.LEFT_SHOULDER], landmarks[PoseLandmark.LEFT_ELBOW], landmarks[PoseLandmark.LEFT_WRIST])
      const rightArmRaised = isArmRaised(landmarks[PoseLandmark.RIGHT_SHOULDER], landmarks[PoseLandmark.RIGHT_ELBOW], landmarks[PoseLandmark.RIGHT_WRIST])
      if (leftArmRaised && rightArmRaised) {
        this.currentPose = 'bothArmsRaised'
        if (currentPose !== this.currentPose) {
          // @ts-ignore
          this.dispatchEvent({ type: POSE_DETECTED, value: this.currentPose })
        }
      } else if (leftArmRaised) {
        this.currentPose = 'leftArmRaised'
        if (currentPose !== this.currentPose) {
          // @ts-ignore
          this.dispatchEvent({ type: POSE_DETECTED, value: this.currentPose })
        }
      } else if (rightArmRaised) {
        this.currentPose = 'rightArmRaised'
        if (currentPose !== this.currentPose) {
          // @ts-ignore
          this.dispatchEvent({ type: POSE_DETECTED, value: this.currentPose })
        }
      }
    }

    // Dance
    if (POSE_DETECT_YMCA) {
      const leftShoulder = landmarks[PoseLandmark.LEFT_SHOULDER]
      const leftElbow = landmarks[PoseLandmark.LEFT_ELBOW]
      const leftWrist = landmarks[PoseLandmark.LEFT_WRIST]
      const rightShoulder = landmarks[PoseLandmark.RIGHT_SHOULDER]
      const rightElbow = landmarks[PoseLandmark.RIGHT_ELBOW]
      const rightWrist = landmarks[PoseLandmark.RIGHT_WRIST]

      if (
        isArmPose(leftShoulder, leftElbow, leftWrist, [-45, -55]) &&
        isArmPose(rightShoulder, rightElbow, rightWrist, [-145, -135])
      ) {
        this.currentPose = 'y'
        if (currentPose !== this.currentPose) {
          // @ts-ignore
          this.dispatchEvent({ type: POSE_DETECTED, value: this.currentPose })
        }
      } else if (
        isArmPose(leftShoulder, leftElbow, leftWrist, [-45, -135]) &&
        isArmPose(rightShoulder, rightElbow, rightWrist, [-145, -60])
      ) {
        this.currentPose = 'm'
        if (currentPose !== this.currentPose) {
          // @ts-ignore
          this.dispatchEvent({ type: POSE_DETECTED, value: this.currentPose })
        }
      } else if (
        isArmPose(leftShoulder, leftElbow, leftWrist, [40, -60]) &&
        isArmPose(rightShoulder, rightElbow, rightWrist, [-105, -50])
      ) {
        this.currentPose = 'c'
        if (currentPose !== this.currentPose) {
          // @ts-ignore
          this.dispatchEvent({ type: POSE_DETECTED, value: this.currentPose })
        }
      } else if (
        isArmPose(leftShoulder, leftElbow, leftWrist, [-65, -115]) &&
        isArmPose(rightShoulder, rightElbow, rightWrist, [-115, -65])
      ) {
        this.currentPose = 'a'
        if (currentPose !== this.currentPose) {
          // @ts-ignore
          this.dispatchEvent({ type: POSE_DETECTED, value: this.currentPose })
        }
      } else {
        this.currentPose = ''
      }
    }
  }
}
