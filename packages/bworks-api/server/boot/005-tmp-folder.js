'use strict';
const path = require('path');
const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);
module.exports = async app => {
  let temp = path.join(app.dirs.root, 'temp');
  if (!fs.existsSync(temp)) await exec(`mkdir -p ${temp}`);

  app.dirs.temp = temp;

  //temp folder to store files
  const tempFolder = path.join(app.dirs.root, 'tempFolder');
  const template = path.join(tempFolder, 'template');
  const generated = path.join(tempFolder, 'generated');
  const uploaded = path.join(tempFolder, 'uploaded');
  const tempReport = path.join(temp, 'report');
  const tempIcon = path.join(temp, 'icon');
  if (!fs.existsSync(template)) await exec(`mkdir -p ${template}`);
  if (!fs.existsSync(generated)) await exec(`mkdir -p ${generated}`);
  if (!fs.existsSync(uploaded)) await exec(`mkdir -p ${uploaded}`);

  if (!fs.existsSync(tempReport)) await exec(`mkdir -p ${tempReport}`);
  if (!fs.existsSync(tempIcon)) await exec(`mkdir -p ${tempIcon}`);

  app.dirs = {
    ...(app.dirs || {}),
    tempReport,
    tempIcon,
    tempFolder: {
      template: template,
      generated: uploaded,
      uploaded: uploaded,
    },
  };
};
