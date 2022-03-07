'use strict';
// const loopback = require('loopback');
// const utilCommon = require('../utils/common');
module.exports = function(Materialuse) {
  // Materialuse.getUsedMat = async function(filter, res) {
  //   try {
  //     let ret = [];
  //     let dataCollect = [];
  //     let cdt = {};
  //     const { typeMat } = filter.where;
  //     if (typeMat) {
  //       cdt.where = { type: typeMat };
  //     }
  //     let matUses = await Materialuse.find(cdt);
  //     if (!matUses || !matUses.length) {
  //       res.header('content-range', 0); // tong record
  //       return ret;
  //     }
  //     // console.log('1:', matUses);
  //     let fieldStockId = 'stockId';
  //     let idStocks = utilCommon.getIdUnique(matUses, fieldStockId);
  //     if (!idStocks.length) {
  //       res.header('content-range', 0); // tong record
  //       return ret;
  //     }
  //     // console.log('2:', idStocks);
  //     let index = 0;
  //     for (let i = 0; i < idStocks.length; i++) {
  //       let itemIdStock = idStocks[i];
  //       let total = 0;
  //       let tmp = {};
  //       for (let k = 0; k < matUses.length; k++) {
  //         let itemMatUse = matUses[k];
  //         if (!itemMatUse.stockId || typeof itemMatUse.stockId !== 'object') {
  //           continue;
  //         }
  //         if (itemMatUse.stockId.equals(itemIdStock)) {
  //           if (itemMatUse.type === 'Pipe') {
  //             total += itemMatUse.length;
  //           } else {
  //             total++;
  //           }
  //           tmp.id = index;
  //           ++index;
  //           tmp.name = itemMatUse.name;
  //           tmp.unit = itemMatUse.type === 'Pipe' ? 'generic.units.meter' : 'generic.units.quantity';
  //           tmp.type = itemMatUse.type;
  //         }
  //       }
  //       tmp.usedTotal = total;
  //       dataCollect.push(tmp);
  //     }
  //     const { limit, skip, order } = filter;

  //     if (!dataCollect.length) {
  //       res.header('content-range', 0); // tong record
  //       return ret;
  //     }

  //     // phan trang
  //     let dataTmp = utilCommon.splitPage(dataCollect, limit, skip);

  //     // sort
  //     let dataSort = utilCommon.sort(dataTmp, order);
  //     res.header('content-range', dataCollect.length); // tong record
  //     return dataSort;
  //   } catch (e) {
  //     throw e;
  //   }
  // };
  // Materialuse.remoteMethod('getUsedMat', {
  //   accepts: [{ arg: 'filter', type: 'object' }, { arg: 'res', type: 'object', http: { source: 'res' } }],
  //   http: { verb: 'get' },
  //   returns: { arg: 'data', type: 'object', root: true },
  // });

  // Materialuse.alertErrorMatMap = async function(data) {
  //   try {
  //     // console.log('alertErrorMatMap', data);
  //     if (data.stockId) {
  //       // update so luong hong hoc trong stock
  //       let stock = await Materialuse.app.models.MaterialStock.findById(data.stockId);
  //       if (stock) {
  //         let tmp;
  //         if (stock.type === 'Pipe') {
  //           let length = data.length ? data.length : 0;
  //           let adjustValue = stock.adjustValue ? stock.adjustValue : 0;
  //           tmp = adjustValue + length;
  //         } else {
  //           // vat tu khac
  //           let adjustValue = stock.adjustValue ? stock.adjustValue : 0;
  //           tmp = adjustValue + 1;
  //         }
  //         await Materialuse.app.models.MaterialStock.updateAll({ id: data.stockId }, { adjustValue: tmp });
  //       }
  //     }

  //     // delete trong su dung
  //     let res = await Materialuse.destroyById(data.id);
  //     // console.log(res);
  //     return res;
  //   } catch (e) {
  //     throw e;
  //   }
  // };
  // Materialuse.remoteMethod('alertErrorMatMap', {
  //   accepts: [{ arg: 'data', type: 'object' }],
  //   http: { verb: 'GET' },
  //   returns: { arg: 'count', type: 'number', root: true },
  // });

  // Materialuse.observe('before save', function filterProperties(ctx, next) {
  //   if (ctx.instance) {
  //     // update fromNode
  //     Materialuse.app.models.Node.findById(ctx.instance.fromNodeId)
  //       .then(node => {
  //         if (node) {
  //           ctx.instance.node = loopback.GeoPoint({ lat: node.position.lat, lng: node.position.lng });
  //         }
  //         next();
  //       })
  //       .catch(() => next());
  //   }
  // });

  // Materialuse.observe('before save', function updateQuantityMat(ctx, next) {
  //   if (ctx.isNewInstance) {
  //     // tao moi
  //     let exportId = ctx.instance.exportId;
  //     if (exportId) {
  //       Materialuse.app.models.MaterialExport.findById(exportId, (err, instExport) => {
  //         if (err || !instExport) {
  //           next();
  //         } else {
  //           ctx.instance.unsetAttribute('currentValue');
  //           let tmp;
  //           // console.log('after ', ctx.instance);
  //           if (ctx.instance.type === 'Pipe') {
  //             tmp = instExport.currentValue - ctx.instance.length;
  //           } else {
  //             // vat tu khac
  //             tmp = instExport.currentValue - 1;
  //           }
  //           tmp = tmp < 0 ? 0 : tmp;
  //           // eslint-disable-next-line no-unused-vars
  //           Materialuse.app.models.MaterialExport.updateAll({ id: exportId }, { currentValue: tmp }, (err, inst) => {
  //             next();
  //           });
  //         }
  //       });
  //     } else {
  //       next();
  //     }
  //   } else {
  //     if (ctx.instance.type !== 'Pipe') {
  //       ctx.instance.unsetAttribute('currentValue');
  //       next();
  //     } else {
  //       // update
  //       let exportId = ctx.instance.exportId;
  //       if (exportId) {
  //         Materialuse.app.models.MaterialExport.findById(exportId, (err, instExport) => {
  //           if (err || !instExport) {
  //             next();
  //           } else {
  //             Materialuse.app.models.MaterialUse.findById(ctx.instance.id, (err, instUse) => {
  //               if (err || !instUse) {
  //                 next();
  //               } else {
  //                 ctx.instance.unsetAttribute('currentValue');
  //                 let tmp;
  //                 let oldLength = instUse.length;
  //                 tmp = instExport.currentValue + oldLength - ctx.instance.length;
  //                 tmp = tmp < 0 ? 0 : tmp;
  //                 Materialuse.app.models.MaterialExport.updateAll(
  //                   { id: exportId },
  //                   { currentValue: tmp },
  //                   // eslint-disable-next-line no-unused-vars
  //                   (err, inst) => {
  //                     next();
  //                   },
  //                 );
  //               }
  //             });
  //           }
  //         });
  //       } else {
  //         next();
  //       }
  //     }
  //   }
  // });
  Materialuse.list = async (dmaIds, types, fields) => {
    // validate type
    if (!types || types.length === 0 || !dmaIds || dmaIds.length === 0) return [];
    // add dmaids condition
    let condition = { where: {} };
    if (dmaIds && dmaIds[0] !== 'all' && dmaIds[0] !== '') {
      condition = { where: { dmaId: { inq: dmaIds } } };
    }
    // add type condition
    if (types[0] !== 'all' && types[0] !== '') {
      condition.where.type = { inq: types };
    }
    condition.where.isDeleted = { neq: true };
    // limit fields condition
    condition.fields = fields
      ? fields
      : {
          id: true,
          name: true,
          dmaId: true,
          node: true, // for render in map (not ref to node)
          fromNodeId: true,
          toNodeId: true,
          optionKey: true, // for sensor
          polyline: true, // for pipe
          type: true,
          meta: true,
        };
    // order
    condition.order = 'startNodeId ASC';
    let result = await Materialuse.find(condition);
    return result || [];
  };

  Materialuse.remoteMethod('list', {
    accepts: [
      { arg: 'dmaIds', type: ['string'], default: [] },
      { arg: 'types', type: ['string'], default: ['all'] },
      { arg: 'fields', type: 'object', default: null },
      { arg: 'deep', type: 'number', default: 1 },
    ],
    returns: { root: true, type: ['object'] },
  });
};
