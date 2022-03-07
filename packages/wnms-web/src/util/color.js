export const randomDistinctColor = (numOfSteps, step) => {
  let r, g, b;
  let h = step / numOfSteps;
  let i = ~~(h * 6);
  let f = h * 6 - i;
  let q = 1 - f;
  switch (i % 6) {
    case 0:
      r = 1;
      g = f;
      b = 0;
      break;
    case 1:
      r = q;
      g = 1;
      b = 0;
      break;
    case 2:
      r = 0;
      g = 1;
      b = f;
      break;
    case 3:
      r = 0;
      g = q;
      b = 1;
      break;
    case 4:
      r = f;
      g = 0;
      b = 1;
      break;
    case 5:
      r = 1;
      g = 0;
      b = q;
      break;
  }
  let c = `#${`00${(~~(r * 255)).toString(16)}`.slice(-2)}${`00${(~~(g * 255)).toString(16)}`.slice(-2)}${`00${(~~(
    b * 255
  )).toString(16)}`.slice(-2)}`;
  return c;
};
const statusColor = {
  new: '#FFEB3B',
  doing: '#4CAF50',
  done: '#9E9E9E',
  unknown: '#78909C',
};

export const getStatusColor = statusId => {
  return statusColor[statusId] ? statusColor[statusId] : statusColor.unknown;
};
