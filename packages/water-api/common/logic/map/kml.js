'use strict';
const util = require('util');
const { mapSeries } = require('async');
const { clone } = require('lodash');
const GeoJSON = require('geojson');
const tokml = require('tokml');
const str = require('string-to-stream');
const xml2js = require('xml2js');
const colorConfig = require('../../../server/color-config');

module.exports = Map => {
  Map.newFeature = ({ properties, geometry = {} }) => {
    return { type: 'Feature', properties, geometry };
  };
  Map.newKmlObj = () => {
    return { kml: { $: { xmlns: 'http://www.opengis/net/kml/2.2' }, Document: {} } };
  };
  const getKmlByType = async type => {
    let id = `Kml-Material-${type}`;
    // find current
    let current = await Map.findById(id);
    if (current && current.data) {
      return { ...current.__data };
    }
    let materialUses = await Map.app.models.MaterialUse.find({
      where: { type },
      fields: { description: false, createdDate: false, updatedDate: false, creatorId: false, updaterId: false },
      order: ['dmaId ASC', 'detailTypeId ASC'],
    });
    let kmlContent = '';
    let geoJsonObj = {};
    if (materialUses && materialUses.length) {
      if (type === 'Pipe') {
        // collect & init new data
        geoJsonObj = { type: 'FeatureCollection', features: [] };
        const noneObject = { id: '', name: '' };
        let currentDma = clone(noneObject);
        let currentDetailType = clone(noneObject);
        let currentFeature = null;
        await util.promisify(mapSeries)(materialUses, async pipe => {
          // check dma
          let createNewFeature = false;
          if (currentDma.id.toString() !== pipe.dmaId.toString()) {
            // update current dma
            currentDma = await Map.app.models.Dma.findById(pipe.dmaId);
            if (!currentDma) {
              currentDma = clone(noneObject);
              createNewFeature = true;
            }
          }
          if (currentDetailType.id.toString() !== pipe.detailTypeId.toString()) {
            currentDetailType = await Map.app.models.MaterialDetailType.findById(pipe.detailTypeId);
            if (!currentDetailType) currentDetailType = clone(noneObject);
            createNewFeature = true;
          }
          if (createNewFeature) {
            let color = colorConfig.pipe.diameter(pipe.meta.diameter);
            currentFeature = Map.newFeature({
              properties: {
                featureId: currentDetailType.id.toString(),
                dmaName: currentDma.name,
                detailTypeName: currentDetailType.name,
                style: {
                  strokeColor: color.strokeColor,
                  strokeWeight: color.strokeWeight,
                  strokeOpacity: color.strokeOpacity,
                },
              },
              geometry: { type: 'MultiLineString', coordinates: [] },
            });
          }
          // coordinates
          if (pipe.polyline && pipe.polyline.length) {
            currentFeature.geometry.coordinates.push(pipe.polyline.map(point => [point.lng, point.lat]));
          }
          if (currentFeature && GeoJSON.isGeometryValid(currentFeature.geometry)) {
            geoJsonObj.features.push(currentFeature);
          }
        });
        // kmlContent = tokml(geoJsonObj, {
        //   documentName: undefined,
        //   documentDescription: undefined,
        //   name: 'name',
        //   description: 'description',
        //   simplestyle: true,
        //   timestamp: 'timestamp',
        // });
      } else {
        // init
        geoJsonObj = { type: 'FeatureCollection', features: [] };
        // let kmlObj = Map.newKmlObj();
        // kmlObj.kml.Document.Placemark = [];
        let cacheIcon = {};
        await util.promisify(mapSeries)(materialUses, async materialUse => {
          // let placemark = { Style: { IconStyle: { Icon: { href: { _: '' } } } }, Point: { coordinates: { _: '' } } };
          // set icon
          if (!cacheIcon[materialUse.type]) {
            cacheIcon[materialUse.type] = await Map.app.models.Icon.linkAws(`${materialUse.type}Icon`, 36, 'normal');
          }
          // placemark.Style.IconStyle.Icon.href._ = cacheIcon[materialUse.type];
          // set coordinates
          // placemark.Point.coordinates._ = `${materialUse.node.lng},${materialUse.node.lat}`;
          // kmlObj.kml.Document.Placemark.push(placemark);

          const currentFeature = Map.newFeature({
            properties: {
              featureId: materialUse.id.toString(),
              dmaId: materialUse.dmaId,
              name: materialUse.name,
              style: {
                icon: cacheIcon[materialUse.type],
              },
            },
            geometry: { type: 'MultiLineString', coordinates: [] },
          });
          geoJsonObj.features.push(currentFeature);
        });

        // let builder = new xml2js.Builder();
        // kmlContent = builder.buildObject(kmlObj);
      }
    }
    // upload kml to s3
    let url = '';
    if (kmlContent) {
      let bucket = Map.app.models.NmsFile.dataSource.settings.bucket;
      let writeStream = Map.app.models.NmsFile.uploadStream(bucket, `NmsFiles/Kmls/Material-${type}.kml`, {
        prefix: 'NmsFile',
        acl: 'public-read',
        lastModified: new Date(),
      });
      url = await new Promise((resolve, reject) => {
        writeStream.on('success', data => {
          resolve(data.location.replace('.s3.', '.s3-'));
        });
        writeStream.on('error', error => {
          reject(error);
        });
        str(kmlContent).pipe(writeStream);
      });
    }
    let data = await Map.replaceOrCreate({ id, url, type, geoJsonObj });
    if (data) {
      return { ...data.__data };
    }
    return null;
  };
  const getKmlCommon = async common => {
    const result = [];
    if (common === 'all') {
      // get kml from model Kml
      const commonKmls = await Map.app.models.Kml.find({ where: { active: true }, fields: { id: true, urlS3: true } });
      if (commonKmls && commonKmls.length > 0) {
        commonKmls.map(commonKml => {
          result.push({ id: commonKml.id, url: commonKml.urlS3, type: 'common' });
        });
      }
    }
    return result;
  };
  // eslint-disable-next-line no-unused-vars
  Map.kml = async (common, types) => {
    const fromMaterials = types ? await Promise.all(types.map(type => getKmlByType(type))) : [];
    const fromCommon = await getKmlCommon(common);
    return [...fromMaterials, ...fromCommon];
  };

  Map.remoteMethod('kml', {
    accepts: [
      { arg: 'common', type: 'string', default: 'all' },
      { arg: 'types', type: ['string'] },
    ],
    returns: { arg: 'body', root: true },
    http: { verb: 'post' },
  });
};
