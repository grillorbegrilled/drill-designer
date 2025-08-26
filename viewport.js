function project(point) {
  const dx = point.x - camera.x;
  const dy = point.y - camera.y;
  const dz = point.z - camera.z;

  const scale = focalLength / (dz || 0.0001);
  const x2d = dx * scale + viewport.width / 2;
  const y2d = dy * scale + viewport.height / 2;

  return { x: x2d, y: y2d, scale };
}

function renderScene() {
  vctx.clearRect(0, 0, viewport.width, viewport.height);

  const sortedKids = [...kids].sort((a, b) => {
    const depthA = a.y - camera.y;
    const depthB = b.y - camera.y;
    return depthB - depthA;
  });

  for (const kid of sortedKids) {
    const base = project({ x: kid.x, y: kid.y, z: 0 });
    const top = project({ x: kid.x, y: kid.y, z: objectHeight });

    const width = 6 * base.scale / focalLength;

    const rectX = base.x - width / 2;
    const rectY = top.y;
    const rectHeight = base.y - top.y;

    vctx.fillStyle = kid.c;
    vctx.fillRect(rectX, rectY, width, rectHeight);
  }

  requestAnimationFrame(renderScene);
}
