export const insidePoly = (poly, point) => {
  var i, j;
  var inside = false;
  for (i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    if (
      poly[i].y > point.lng != poly[j].y > point.lng &&
      point.lat < ((poly[j].x - poly[i].x) * (point.lng - poly[i].y)) / (poly[j].y - poly[i].y) + poly[i].x
    )
      inside = !inside;
  }
  return inside;
};
