const Image = require('./image');
const _ = require('./commands');

const lineSpace = n => {
  if (n === undefined || n === null) {
    return Buffer.from(_.LINE_SPACING.LS_DEFAULT);
  } else {
    return Buffer.concat([Buffer.from(_.LINE_SPACING.LS_SET), Buffer.from([n])]);
  }
};
const newLine = function() {
  return Buffer.from(_.EOL);
};

const getImageBuffer = async (imageData, density = 'd24', itemSize = 24) => {
  const buffs = [lineSpace(0)];
  const image = typeof imageData === 'string' ? await Image.load(imageData) : imageData;
  if (!(image instanceof Image)) throw new TypeError('Only escpos.Image supported');
  var n = ~['d8', 's8'].indexOf(density) ? 1 : 3;
  var header = _.BITMAP_FORMAT['BITMAP_' + density.toUpperCase()];
  var bitmap = image.toBitmap(n * 8);

  bitmap.data.forEach(async line => {
    buffs.push(Buffer.from(header));
    const buf = Buffer.allocUnsafe(2);
    buf.writeUInt16LE(line.length / n);
    buffs.push(buf);
    // self.buffer.writeUInt16LE(line.length / n);
    buffs.push(Buffer.from(line));
    // self.buffer.write(line);
    // self.buffer.write(_.EOL);
    // buffs.push(line);
    buffs.push(Buffer.from(_.EOL));
  });
  buffs.push(lineSpace());
  return Buffer.concat(buffs);
};

const getImageBase64Segment = async (imageData, type = 'image/png', density = 'd24', segSize = 1) => {
  const result = [lineSpace(0)];

  const image = await Image.load(imageData, type);
  if (!(image instanceof Image)) throw new TypeError('Only escpos.Image supported');
  var n = ~['d8', 's8'].indexOf(density) ? 1 : 3;
  var header = _.BITMAP_FORMAT['BITMAP_' + density.toUpperCase()];
  var bitmap = image.toBitmap(n * 8);

  let buffs = [];
  let count = 0;
  // console.log(bitmap.data.length);
  bitmap.data.forEach(async line => {
    count += 1;
    buffs.push(Buffer.from(header));
    const buf = Buffer.allocUnsafe(2);
    buf.writeUInt16LE(line.length / n);
    buffs.push(buf);
    // self.buffer.writeUInt16LE(line.length / n);
    buffs.push(Buffer.from(line));
    // self.buffer.write(line);
    // self.buffer.write(_.EOL);
    // buffs.push(line);
    buffs.push(Buffer.from(_.EOL));
    if (count >= segSize) {
      result.push(Buffer.concat(buffs));
      buffs = [];
      count = 0;
    }
  });
  if (count > 0) {
    result.push(Buffer.concat(buffs));
  }
  result.push(lineSpace());
  const final = result.map(item => item.toString('base64'));
  // console.log(final);
  return final;
};

const rasterBase64 = async (imageData, mode = 'normal', split = 1024) => {
  const buffs = [];
  const result = [];

  let image = imageData;
  if (typeof imageData === 'string') {
    image = await Image.load(imageData);
  }
  if (!(image instanceof Image)) throw new TypeError('Only escpos.Image supported');

  mode = mode || 'normal';
  if (mode === 'dhdw' || mode === 'dwh' || mode === 'dhw') mode = 'dwdh';
  var raster = image.toRaster();
  var header = _.GSV0_FORMAT['GSV0_' + mode.toUpperCase()];
  // write header
  buffs.push(Buffer.from(header));
  // write width
  const bufWidth = Buffer.allocUnsafe(2);
  bufWidth.writeUInt16LE(raster.width);
  buffs.push(bufWidth);
  // height
  const bufHeight = Buffer.allocUnsafe(2);
  bufHeight.writeUInt16LE(raster.height);
  buffs.push(bufHeight);

  result.push(Buffer.concat(buffs).toString('base64'));

  // content
  let i = 0;
  while (i < raster.data.length) {
    result.push(Buffer.from(raster.data.slice(i, i + split)).toString('base64'));
    i += split;
  }
  return result;
};

module.exports = { getImageBuffer, getImageBase64Segment, rasterBase64 };
