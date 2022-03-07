'use strict';
const path = require('path');
const fs = require('fs');
const excelPopulate = require('xlsx-populate');
const isObject = require('lodash/isObject');
const aggregate = require('../../common/utils/aggregate');
const debug = require('debug')('water-api:boot:modify-datasheet-template');

const reformatRefData = (refData, order) => {
  if (refData.every(refDatum => isObject(refDatum))) {
    return refData.map(datum => {
      const entries = Object.entries(datum);

      entries.sort(function(a, b) {
        return order.indexOf(b[0]) - order.indexOf(a[0]);
      });

      // eslint-disable-next-line no-unused-vars
      return entries.map(([_, value]) => value);
    });
  } else {
    return refData.map(refDatum => [refDatum]);
  }
};

const mapValueToKey = (array, mappings) => {
  const mappedArray = [];
  const entries = Object.entries(mappings);
  for (let [key, value] of entries) {
    if (array.includes(key)) {
      mappedArray.push(value);
    }
  }
  return mappedArray;
};

module.exports = async app => {
  // Get data from database
  const getRefDataFromDB = async ({ fromModel, localKey, extractedField, filter = {}, referred }) => {
    if (!referred) {
      const extractedFields = Array.isArray(extractedField) ? extractedField : [extractedField];
      const refData = await app.models[fromModel]
        .find({ fields: extractedFields.reduce((acc, val) => ({ ...acc, [val]: true }), {}), where: filter })
        .then(records => records.map(record => record.toJSON()));
      return [refData, extractedFields];
    }

    // Project-Filter stage
    const projectFilterStage = {};
    const localKeys = referred.map(({ localKey }) => localKey);
    projectFilterStage['$project'] = {
      [localKey]: `$${extractedField}`,
      ...localKeys.reduce((acc, val) => ({ ...acc, [val]: 1 }), {}),
    };

    // Lookup stages
    const lookupStages = referred.map(({ localKey, fromModel }) => ({
      $lookup: { from: fromModel, localField: localKey, foreignField: '_id', as: localKey },
    }));

    // Project stage
    const localKeysWithFields = referred.reduce(
      (acc, { localKey, extractedField }) => ({
        ...acc,
        [localKey]: { $arrayElemAt: [`$${localKey}.${extractedField}`, 0] },
      }),
      {},
    );
    const projectStage = { $project: { _id: 0, [localKey]: 1, ...localKeysWithFields } };

    const refData = await aggregate(app.models[fromModel], [projectFilterStage, ...lookupStages, projectStage]);
    const refDataHeader = [localKey, ...localKeys];

    return [refData, refDataHeader];
  };

  const getRefDataFromLanguageMappings = ({ fromModel, name }, langMappings) => {
    // Obtain enumerations from the model's JSON schema
    let refData = app.models[fromModel].definition.properties[name];

    if (!refData) {
      throw new Error('Needed field is missing from model definition!');
    } else if (!refData.enum) {
      throw new Error('Given field is not of Enumeration type!');
    }
    refData = refData.enum;

    // Translate the enum into client-readable format
    refData = mapValueToKey(refData, langMappings);

    const refDataHeader = [name];

    return [refData, refDataHeader];
  };

  const templateAndReferenceFields = [
    {
      referenceSheets: {
        'Địa lý': {
          fromModel: 'GeoQuarter',
          localKey: 'quarterId',
          extractedField: 'fullName',
          referred: [
            {
              localKey: 'wardId',
              fromModel: 'GeoWard',
              extractedField: 'fullName',
            },
            {
              localKey: 'districtId',
              fromModel: 'GeoDistrict',
              extractedField: 'fullName',
            },
            {
              localKey: 'provinceId',
              fromModel: 'GeoProvince',
              extractedField: 'fullName',
            },
          ],
        },
        'Nhà cung cấp': {
          fromModel: 'WaterProvider',
          pluralModelName: 'providers',
          extractedField: 'name',
        },
        Kiểu: {
          fromValueMapping: true,
          fromModel: 'Client',
          name: 'type',
        },
        'Loại giấy tờ khách hàng': {
          fromValueMapping: true,
          fromModel: 'Client',
          name: 'buyerIdType',
        },
        'Tình trạng hợp đồng': {
          fromValueMapping: true,
          fromModel: 'Client',
          name: 'contractStatus',
        },
        DMA: {
          fromModel: 'Dma',
          extractedField: 'name',
          pluralModelName: 'dmas',
          filter: { level: 2 },
        },
        'Công thức tính cước': {
          fromModel: 'Formula',
          pluralModelName: 'formulas',
          extractedField: 'name',
        },
      },
      templateName: 'clientStandardTemplate.xlsx',
      model: 'clients',
    },
    {
      referenceSheets: {
        'Địa lý': {
          fromModel: 'GeoQuarter',
          localKey: 'quarterId',
          extractedField: 'fullName',
          referred: [
            {
              localKey: 'wardId',
              fromModel: 'GeoWard',
              extractedField: 'fullName',
            },
            {
              localKey: 'districtId',
              fromModel: 'GeoDistrict',
              extractedField: 'fullName',
            },
            {
              localKey: 'provinceId',
              fromModel: 'GeoProvince',
              extractedField: 'fullName',
            },
          ],
        },
        Kiểu: {
          fromValueMapping: true,
          fromModel: 'ClientRegister',
          name: 'type',
        },
        'Loại giấy tờ khách hàng': {
          fromValueMapping: true,
          fromModel: 'ClientRegister',
          name: 'buyerIdType',
        },
      },
      model: 'clientregisters',
      templateName: 'clientRegisterStandardTemplate.xlsx',
    },
  ];

  if (!process.env.NODE_MOD) {
    return;
  }

  // Add reference data to reference sheets
  const templateDirectoryPath = app.dirs.tempSheet.template;
  for (const templateData of templateAndReferenceFields) {
    const { templateName, model } = templateData;

    // Check if template path is real
    const templatePath = path.resolve(templateDirectoryPath, templateName);
    if (!fs.existsSync(templatePath)) {
      throw new Error('Given template path is not given!');
    }

    // Read the language mapping files
    const headerLangMappings = require('../../i18n/vi').resources[model]['fields'];
    const langMappings = require('../../i18n/vi').resources[model]['values'];

    // If the path is real, load the template into memory
    excelPopulate.fromFileAsync(templatePath).then(async workbook => {
      const { referenceSheets = {} } = templateData;

      const referenceSheetKeys = Object.keys(referenceSheets);

      if (referenceSheetKeys.every(refSheetKey => workbook.sheet(refSheetKey))) {
        debug(`Sheet "${templateName}" is already enhanced`);
        return;
      } else {
        // Remove all ref sheets before enhancement
        for (let refSheetKey of referenceSheetKeys) {
          if (workbook.sheet(refSheetKey)) {
            workbook.deleteSheet(refSheetKey);
          }
        }
      }

      for (const referenceSheet of referenceSheetKeys) {
        // Create an empty Sheet
        const newReferenceSheet = workbook.addSheet(referenceSheet);
        let referenceData, refDataHeader;

        // Get data either from database or language mapping JSONs
        let fromData = false;
        const referenceSheetData = referenceSheets[referenceSheet];
        if (referenceSheetData.fromValueMapping) {
          [referenceData, refDataHeader] = getRefDataFromLanguageMappings(referenceSheetData, langMappings);
        } else {
          [referenceData, refDataHeader] = await getRefDataFromDB(referenceSheetData);
          fromData = true;
        }

        // Reformat data into 2D arrays
        const reformattedData = reformatRefData(referenceData, refDataHeader);

        // For DMA, only permit DMA level 3 to be written into the template
        // Translate headers and write to respective cells before setting up styles
        const translatedHeader = mapValueToKey(
          refDataHeader,
          fromData && referenceSheetData.pluralModelName
            ? require('../../i18n/vi').resources[referenceSheetData.pluralModelName]['fields']
            : headerLangMappings,
        );
        newReferenceSheet
          .cell('A1')
          .value([translatedHeader])
          .style({
            fill: 'C5D9F1',
            borderStyle: {
              right: 'thin',
              left: 'thin',
              bottom: 'thin',
            },
          });

        // Write reference data into reference sheet, starting from second top-left cell
        if (reformattedData.length > 0) {
          newReferenceSheet.cell('A2').value(reformattedData);
        }
      }

      // Overwrite existing template
      return workbook.toFileAsync(templatePath);
    });
  }
};
