import { BufferAttribute, BufferGeometry, ColorRepresentation, DynamicDrawUsage, Points, PointsMaterial } from 'three';

export default class DynamicPoints extends Points {
  positions: Float32Array

  constructor(total: number, color: ColorRepresentation) {
    const geom = new BufferGeometry()
    const pos = new Float32Array(total * 3)
    geom.setAttribute('position', new BufferAttribute(pos, 3).setUsage(DynamicDrawUsage));
    super(geom, new PointsMaterial({
      size: 6,
      color: color,
    }))
    this.positions = pos
  }
}
