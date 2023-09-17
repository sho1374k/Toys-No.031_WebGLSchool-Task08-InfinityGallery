/**
 * @param {number} width
 * @param {number} height
 * @param {number} widthSegments
 * @param {number} heightSegments
 */
export function PlaneGeometry(width = 1, height = 1, widthSegments = 1, heightSegments = 1) {
  const w = width / 2;
  const h = height / 2;

  const gridX = Math.floor(widthSegments);
  const gridY = Math.floor(heightSegments);

  const limitGridX = gridX + 1;
  const limitGridY = gridY + 1;

  const segmentWidth = width / gridX;
  const segmentHeight = height / gridY;

  const indexList = [];
  const positionList = [];
  const normalList = [];
  const uvList = [];

  for (let iy = 0; iy < limitGridY; iy++) {
    const y = iy * segmentHeight - h;

    for (let ix = 0; ix < limitGridX; ix++) {
      const x = ix * segmentWidth - w;

      positionList.push(x, -y, 0);

      normalList.push(0, 0, 1);

      uvList.push(ix / gridX);
      uvList.push(1 - iy / gridY);
    }
  }

  for (let iy = 0; iy < gridY; iy++) {
    for (let ix = 0; ix < gridX; ix++) {
      const a = ix + limitGridX * iy;
      const b = ix + limitGridX * (iy + 1);
      const c = ix + 1 + limitGridX * (iy + 1);
      const d = ix + 1 + limitGridX * iy;

      indexList.push(a, b, d);
      indexList.push(b, c, d);
    }
  }

  // prettier-ignore
  return { 
    position: positionList, 
    normal: normalList, 
    uv: uvList, 
    index: indexList 
  };
}
