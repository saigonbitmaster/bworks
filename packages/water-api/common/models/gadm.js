'use strict';
const fs = require('fs');
const path = require('path');
const slug = require('slug');
const eachLimit = require('async/eachLimit');
const geojsonExtent = require('@mapbox/geojson-extent');
const app = require('../../server/server');
module.exports = function(Gadm) {
  const getRect = geometry => {
    return geojsonExtent(geometry);
  };

  Gadm.importFromGeoJson = async fileName => {
    const filePath = path.join(app.dirs.root, fileName);
    const buf = fs.readFileSync(filePath);
    const data = JSON.parse(buf);
    await new Promise((resolve, reject) => {
      eachLimit(
        data.features,
        10,
        async item => {
          const { type, properties, geometry } = item;
          const record = {
            name: '',
            slug: '',
            fullName: '',
            properties,
            geometry,
            level: 0,
            rect: null,
          };
          if (type !== 'Feature') return;
          // get name
          let nameLevel = '';
          const names = [];
          do {
            nameLevel = properties[`NAME_${record.level + 1}`];
            if (nameLevel) {
              record.level = record.level + 1;
              names.unshift(nameLevel);
            }
          } while (nameLevel);

          if (record.level > 0) {
            record.name = names[0];
            record.fullName = names.join(', ');
            record.slug = slug(record.fullName).toLowerCase();
            record.rect = getRect(record.geometry);
          }
          let current = await Gadm.findOne({ where: { slug: record.slug } });
          if (current) {
            console.log('Update', record.slug);
            await current.updateAttributes(record);
          } else {
            console.log('Create', record.slug);
            await Gadm.create(record);
          }
        },
        err => {
          if (err) reject(err);
          resolve();
        },
      );
    });
  };
};
