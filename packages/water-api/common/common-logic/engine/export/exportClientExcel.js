'use strict';
const fs = require('fs');
const path = require('path');

const flatten = require('lodash/flatten');
const mapValues = require('lodash/mapValues');
const pickBy = require('lodash/pickBy');
const merge = require('lodash/merge');
const get = require('lodash/get');
const keyBy = require('lodash/keyBy');
const values = require('lodash/values');
const zip = require('lodash/zip');
const isDate = require('lodash/isDate');

const XlsxTemplate = require('xlsx-template');
const httpError = require('http-errors');
const moment = require('moment-timezone');
const pluralize = require('pluralize');
const isMongoId = require('validator/lib/isMongoId');
const ObjectID = require('bson').ObjectID;

const aggregate = require('../../../utils/aggregate');

module.exports = ExcelUtils => {
  ExcelUtils.getMultipleJoinedData = async (sourcesAndTranslations, rootModel, filter = null) => {
    const sourceFields = sourcesAndTranslations.rootFields;
    const foreignData = sourcesAndTranslations.referredMetadata;
    const buildAggregationQuery = (sourceFields, foreignData, filter) => {
      const lookupStages = [];
      const unwindStages = [];
      const addFieldStages = [];
      const keptForeignKeys = {};
      let keptFields = {};
      let extractReferredFieldsQuery = [];

      // Match and sort stage, only for root collections
      if (filter) {
        if (filter.where) {
          const matchStage = {
            $match: Object.entries(filter.where).reduce((acc, [key, value]) => {
              if (Array.isArray(value))
                acc[key] = { $in: value.map(val => (isMongoId(val) ? new ObjectID(val) : val)) };
              else if (typeof value === 'string') acc[key] = isMongoId(value) ? new ObjectID(value) : value;
              else if (typeof value === 'object' && value['search']) acc['$text'] = { $search: value['search'] };
              return acc;
            }, {}),
          };
          extractReferredFieldsQuery.push(matchStage);
        }
        if (filter.order) {
          const [sortField, sortOrder] = filter.order.split(' ');
          const stagingSort = {};
          switch (sortOrder) {
            case 'ASC':
              stagingSort[sortField] = 1;
              break;
            case 'DESC':
              stagingSort[sortField] = -1;
              break;
          }
          const sortStage = { $sort: stagingSort };
          extractReferredFieldsQuery.push(sortStage);
        }
      }

      const foreignModels = Object.keys(foreignData || {});
      for (let referredModelData of foreignModels) {
        const collectionName = referredModelData;
        let { id, foreignId, fields, extra = null } = foreignData[collectionName];

        if (extra) {
          if (extra.id && extra.id === id) {
            keptFields[extra.id] = 1;
          }
        }

        // Distinguish fieldname of root collections and referred collections
        fields = Object.keys(fields).map(field => ({ name: `${collectionName}-${field}`, oldName: field }));

        // Keep required foreign keys
        keptForeignKeys[id] = 1;
        // Lookup stage
        const lookupStage = {
          $lookup: {
            from: collectionName,
            localField: id,
            foreignField: foreignId ? foreignId : '_id',
            as: collectionName,
          },
        };
        // Unwind stage
        const unwindStage = { $unwind: `$${collectionName}` };
        // Add referred fields to fields being kept post-aggregation
        keptFields = {
          ...keptFields,
          ...fields.reduce((keptFields, { name }) => ({ ...keptFields, [name]: 1 }), {}),
        };
        // AddFields stage
        const addFieldStage = {
          $addFields: fields.reduce(
            (newFields, { name, oldName }) => ({
              ...newFields,
              [name]: `$${collectionName}.${oldName}`,
            }),
            {},
          ),
        };
        lookupStages.push(lookupStage);
        unwindStages.push(unwindStage);
        addFieldStages.push(addFieldStage);
      }

      // Project stage
      const keptSourceFields = sourceFields.reduce((keptFields, field) => ({ ...keptFields, [field]: 1 }), {});
      const projectRootFields = { $project: { ...keptSourceFields, ...keptForeignKeys } };
      const projectForeignFields = { $project: { _id: 0, ...keptSourceFields, ...keptFields } };
      extractReferredFieldsQuery = [
        ...extractReferredFieldsQuery,
        projectRootFields,
        ...flatten(zip(lookupStages, unwindStages, addFieldStages)),
        projectForeignFields,
      ];

      return extractReferredFieldsQuery;
    };
    return await aggregate(
      ExcelUtils.app.models[rootModel],
      buildAggregationQuery(Object.keys(sourceFields), foreignData, filter),
    );
  };

  ExcelUtils.translateJoinedData = async (sourcesAndTranslations, rootModel, filter, fixUrl, templateKey) => {
    let data = null;
    if (filter && fixUrl) {
      let [model, method] = fixUrl.split('/');
      model = pluralize(model, 1);
      data = await ExcelUtils.app.models[model][method]({ ...filter, getFull: true }, null);
    } else {
      data = await ExcelUtils.getMultipleJoinedData(sourcesAndTranslations, rootModel, filter);
    }

    // Add extra data from data caller
    const extraDataCallers = Object.keys(sourcesAndTranslations.referredMetadata || {})
      .filter(foreignModel => !!sourcesAndTranslations.referredMetadata[foreignModel].extra)
      .map(key => ({ key: key, data: sourcesAndTranslations.referredMetadata[key].extra }));

    const totalExtraData = {};
    for (let record of data) {
      for (let dataCallerMetadata of extraDataCallers) {
        const id = dataCallerMetadata.data.id;
        const newName = dataCallerMetadata.data.newName;
        const key = dataCallerMetadata.data.foreignKey ? dataCallerMetadata.data.foreignKey : dataCallerMetadata.key;
        const caller = dataCallerMetadata.data.caller;
        const individualExtraData = await ExcelUtils.app.models[key][caller](record[id].toString());
        const packagedIndividualExtradata = {
          [id]: record[id],
          [`${dataCallerMetadata.key}-${newName}`]: individualExtraData,
        };
        if (!totalExtraData[key]) {
          totalExtraData[key] = { id, data: [packagedIndividualExtradata] };
        } else {
          totalExtraData[key].data.push(packagedIndividualExtradata);
        }
      }
    }

    data = Object.keys(totalExtraData).reduce(
      (acc, val) =>
        values(merge(keyBy(data, totalExtraData[val].id), keyBy(totalExtraData[val].data, totalExtraData[val].id))),
      data,
    );

    // Translate header
    // const sourceFieldKeys = Object.keys(sourcesAndTranslations.rootFields);
    // Translate value
    data = data.map(record =>
      mapValues(record, (value, key) => {
        if (key.includes('-')) {
          const [foreignModel, foreignModelKey] = key.split('-');
          const possibleTranslatedValues = get(
            sourcesAndTranslations,
            `referredMetadata.${foreignModel}.fields.${foreignModelKey}.value`,
          );

          if (possibleTranslatedValues && possibleTranslatedValues[value]) {
            return possibleTranslatedValues[value];
          }
        }
        if (sourcesAndTranslations.rootFields[key] && sourcesAndTranslations.rootFields[key].value) {
          if (sourcesAndTranslations.rootFields[key].value[value]) {
            return sourcesAndTranslations.rootFields[key].value[value];
          } else {
            return undefined;
          }
        }

        return value;
      }),
    );

    // Remove fields having header ends with "id" and of one-word size
    data = data.map(record =>
      pickBy(record, (_, key) => {
        if (key.endsWith('Id') || key.endsWith('id')) {
          if (key.split(' ').length === 1) return false;
        }
        return true;
      }),
    );

    // Remove all records not having values in every requested fields
    data = data.filter(record => {
      const values = Object.values(record);
      const oneValueIsUndefined = values.some(i => i === undefined);
      if (oneValueIsUndefined) {
        return false;
      } else {
        return true;
      }
    });

    // Get company
    const sheetData = {};
    const company = await ExcelUtils.app.models.CtmCompany.findOne({ where: { active: true } });
    if (company) {
      sheetData.company = company;
    }

    // Get template
    const templatePath = path.join(ExcelUtils.app.dirs.tempSheet.template, `List${templateKey}.xlsx`);
    if (!fs.existsSync(templatePath)) {
      throw httpError(400, 'error.TEMPLATE_NOT_FOUND');
    }
    const templateData = fs.readFileSync(templatePath);
    const template = new XlsxTemplate(templateData);

    // Add index
    // Stringify date objects for special cases
    data = data.map((datum, index) => {
      for (const key of Object.keys(datum)) {
        if (isDate(datum[key])) {
          if (templateKey === 'Client' && ['termInvoice', 'termMeterNumber'].includes(key)) {
            datum[key] = moment(datum[key]).format('MM/YYYY');
          } else {
            datum[key] = moment(datum[key]).format('DD/MM/YYYY');
          }
        }
      }
      datum.index = index + 1;
      return datum;
    });
    sheetData.data = data;

    template.substitute(1, sheetData);

    return template.generate({ type: 'nodebuffer' });
  };

  ExcelUtils.exportExcelFile = (rootModel, sourcesAndTranslations, filter, fixUrl, templateKey, options, callback) => {
    if (rootModel === 'ClientRegister' && templateKey === 'ClientRegister') {
      if (filter.where.status === 'NEW' && Object.keys(sourcesAndTranslations.rootFields.status.value).length > 1) {
        filter.where = { status: { neq: 'COMPLETE' } };
      }
    }
    ExcelUtils.translateJoinedData(sourcesAndTranslations, rootModel, filter, fixUrl, templateKey)
      .then(stream => {
        const today = moment().format('DDMMYYYYhhmmss');
        const excelName = `${rootModel}-${today}.xlsx`;
        const contentType = 'application/vnd.ms-excel';
        const contenDisposition = `inline; filename=${excelName}`;
        return callback(null, stream, contentType, contenDisposition);
      })
      .catch(err => callback(err));
  };

  ExcelUtils.remoteMethod('exportExcelFile', {
    isStatic: true,
    accepts: [
      { arg: 'rootModel', type: 'string' },
      { arg: 'sourcesAndTranslations', type: 'object' },
      { arg: 'filter', type: 'any' },
      { arg: 'fixUrl', type: 'string' },
      { arg: 'templateKey', type: 'string', required: true },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'get' },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
  });
};
