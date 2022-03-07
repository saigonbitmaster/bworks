const xlsx = require('xlsx');
const httpError = require('http-errors');
const moment = require('moment-timezone');

const pickBy = require('lodash/pickBy');
const pick = require('lodash/pick');
const mapValues = require('lodash/mapValues');
const mapKeys = require('lodash/mapKeys');
const mergeWith = require('lodash/mergeWith');
const capitalize = require('lodash/capitalize');
const clone = require('lodash/clone');
const compact = require('lodash/compact');
const uniq = require('lodash/uniq');
const template = require('lodash/template');
const has = require('lodash/has');
const isDate = require('lodash/isDate');
const isNull = require('lodash/isNull');
const get = require('lodash/get');
const toString = require('lodash/toString');

const { country, locales } = require('../../../../server/config.json');

const aggregate = require('../../../utils/aggregate');
const Transaction = require('../../../utils/transaction');
const toObjectId = require('../../../utils/to-object-id');
const { getConnectorFromModel } = require('../../../utils/transaction-utils');
const getGeopointFromGoogleMap = require('../../../logic/geo/import-geolocation');
const errorTranslation = require('../../../../i18n');
const { reverseTranslate } = require('../../../utils/translation');
// const { isEqualGi } = require('../../../utils/str');

const createTranslatedError = (message, vars) => {
  if (has(errorTranslation(locales)['error'], message)) {
    const error = new Error();
    const errorTemplate = get(errorTranslation(locales)['error'], message);
    const compiled = template(errorTemplate);
    error.message = compiled(vars);
    error.toClient = true;
    return error;
  }
};

class ExcelFile {
  constructor({
    filepath,
    model,
    httpOptions,
    dataSheetName = null,
    sheetNumber = null,
    parseDataFunc = null,
    headerRowIndex = '1',
  }) {
    if (!model) {
      throw new Error('The system cannot validate data if no model is given!');
    }
    if (!filepath) {
      throw new Error('Filepath input is missing');
    }
    if (model.definition.name === 'Client' && !httpOptions) {
      throw new Error('Loopback options for importing Client are missing');
    }
    if ((isNull(dataSheetName) && isNull(sheetNumber)) || (sheetNumber && dataSheetName)) {
      throw new Error('Dont know which sheet to extract data from');
    }
    this.filepath = filepath;
    this.httpOptions = httpOptions;
    this.model = model;
    this.isTranslated = false;
    this.isValidated = false;
    this.hasImported = false;
    this.data = null;
    this.dataSheetName = dataSheetName;
    this.sheetNumber = sheetNumber;

    if (parseDataFunc && typeof parseDataFunc === 'function') {
      this.data = parseDataFunc({
        filepath: this.filepath,
        dataSheetName,
        sheetNumber,
      });
    } else {
      this.__defaultParseDataFunc(headerRowIndex);
    }
  }

  __defaultParseDataFunc(headerRowIndex = '1') {
    // Check input type
    if (!Number.isInteger(parseInt(headerRowIndex))) {
      throw new Error(`Given starting index to parse data (row ${headerRowIndex}) is not of integer Type!`);
    }
    const headerRowIndexInteger = parseInt(headerRowIndex);

    // Read the workbook into memory
    // Select the needed sheet
    // Convert the Sheet into JSON
    let workbook = null;
    let dataSheet = null;
    try {
      workbook = xlsx.readFile(this.filepath, {
        cellDates: true,
      });
      const selectedSheet = this.dataSheetName ? this.dataSheetName : workbook.SheetNames[this.sheetNumber];
      dataSheet = workbook.Sheets[selectedSheet];
    } catch (err) {
      throw new Error(`Error occurs while trying to read ${this.filepath}`);
    }

    // Extract headers
    const headers = pickBy(dataSheet, (_, key) => key.match(new RegExp(`^[A-Z]+${headerRowIndex}$`)));
    // Extract data grouped by column headers
    const columnarData = Object.entries(headers).reduce((acc, [headerKey, headerValue]) => {
      if (!headerValue.v) {
        throw new Error(`Header column "${headerKey}" does not have solid value!`);
      }

      const headerRealValue = headerValue.v;
      // Extract the alphabetic part from the header
      const columnAlphabeticIndex = headerKey.replace(/[0-9]/g, '');
      // Extract data seated in respective column
      const dataWithinOneColumn = Object.entries(
        mapKeys(
          mapValues(
            pickBy(
              dataSheet,
              (_, key) =>
                key.match(new RegExp(`^${columnAlphabeticIndex}[0-9]+$`)) &&
                parseInt(key.replace(/[A-Z]/g, '')) > headerRowIndexInteger,
            ),
            value => value.v,
          ),
          (_, key) => key.replace(/[A-Z]/g, ''),
        ),
      ).map(([key, value]) => ({
        [key]: {
          [headerRealValue]: value,
        },
      }));
      if (columnAlphabeticIndex) {
        acc.push(...dataWithinOneColumn);
      }
      return acc;
    }, []);

    // Iterate each column in 'Data' section and push into a JSON object
    let rawData = Object.values(
      mergeWith(...columnarData, (objValue, srcValue) => ({
        ...objValue,
        ...srcValue,
      })),
    );

    // Emit errors if required keys for each record are not found
    const requiredHeaderValues = Object.entries(headers)
      .map(([_, { v }]) => v)
      .filter(header => toString(header).includes('*'));
    for (let record of rawData) {
      for (let requiredHeaderValue of requiredHeaderValues) {
        if (!has(record, requiredHeaderValue)) {
          throw httpError(400, 'error.REQUIRED_DATA_NOT_EXIST');
        }
      }
    }

    // Remove asterisk symbols in required fields
    // For any required fields, check if there's a value or not
    rawData = rawData.map(datum => mapKeys(datum, (value, key) => key.replace(/[\\*\\(\\)]/g, '').trim()));

    this.data = rawData;
  }

  translate() {
    if (!this.data || !Array.isArray(this.data)) {
      throw new Error('Not finding any data to translate!');
    }

    this.data = this.data.map(datum => {
      // Map the header to translation
      datum = mapKeys(datum, (_, key) =>
        reverseTranslate(key, { type: 'header', model: this.model.pluralModelName.toLowerCase(), lang: locales }),
      );
      // Map the value to translation
      datum = mapValues(datum, (value, key) =>
        reverseTranslate(value, { type: 'value', model: this.model.pluralModelName.toLowerCase(), lang: locales, key }),
      );
      return datum;
    });

    this.isTranslated = true;
  }

  convertToDate() {
    if (!this.isTranslated) {
      throw new Error('Data has not been translated yet!');
    }
    const ref = [
      ['termMeterNumber', 'MM/YYYY'],
      ['termInvoice', 'MM/YYYY'],
      ['lastTimeMeterNumberUpdate', 'DD/MM/YYYY'],
      ['startMeterDate', 'DD/MM/YYYY'],
    ];
    for (let datum of this.data) {
      for (let [dateKey, dateFormat] of ref) {
        if (datum[dateKey] && !isDate(datum[dateKey])) {
          const sSplit = datum[dateKey]
            .split('/')
            .slice(0, 3)
            .map(item => +item)
            .reverse();
          if (sSplit.length > 1) {
            sSplit[1] = sSplit[1] - 1; // month from 0 - 11
            const parsed = moment(sSplit);
            if (parsed && parsed.isValid()) {
              datum[dateKey] = parsed.toDate();
              continue;
            }
          }
          throw new Error(`Cannot parse time of ${dateKey} to ${dateFormat}`);
        }
      }
    }
  }

  async validate() {
    if (!this.data) {
      throw new Error('Not finding any data to validate!');
    }

    if (!this.isTranslated) {
      throw new Error('Data has not been translated yet!');
    }

    // Create model instances based on given model's name and data
    let createdModelInstances = null;
    try {
      createdModelInstances = this.data.map(datum => new this.model(datum));
    } catch (err) {
      throw new Error('Errors occurred while trying to create model instance from given data!');
    }

    // Validate each instance by calling .isValid()
    let validatedModelInstances = [];
    for (let instance of createdModelInstances) {
      const validationResult = instance.isValid();
      if (validationResult) {
        validatedModelInstances.push(validationResult);
      } else {
        // eslint-disable-next-line no-console
        console.log(instance.errors);
      }
    }

    if (validatedModelInstances.length === this.data.length && validatedModelInstances.every(Boolean)) {
      this.isValidated = true;
    }
  }

  __insertConfiguredCountryData() {
    // Insert the country name for each record
    this.data = this.data.map(record => {
      record['countryId'] = country;
      return record;
    });
  }

  __checkDuplicate() {
    const table = {};
    const taxTable = {};

    // Check duplicates for these fields: 'name' and 'code'
    for (let datum of this.data) {
      if (datum.code && datum.name) {
        if (table[datum.code]) {
          throw createTranslatedError('importData.DUPLICATE_CODE', {
            firstClient: datum.name,
            secondClient: table[datum.code],
          });
        } else {
          table[datum.code] = datum.name;
        }
      }
    }

    // Check duplicates for 'taxNo'
    for (let datum of this.data) {
      if (datum.taxNo && datum.name) {
        if (taxTable[datum.taxNo]) {
          throw createTranslatedError('importData.DUPLICATE_TAX_NO', {
            firstClient: datum.name,
            secondClient: taxTable[datum.taxNo],
          });
        } else {
          taxTable[datum.taxNo] = datum.name;
        }
      }
    }
  }

  __createGeoIntegrityQuery() {
    const query = [
      {
        $project: {
          _id: 1,
          ward: '$fullName',
          countryId: 1,
          provinceId: 1,
          districtId: 1,
        },
      },
      {
        $lookup: {
          from: 'GeoCountry',
          localField: 'countryId',
          foreignField: '_id',
          as: 'country',
        },
      },
      {
        $lookup: {
          from: 'GeoProvince',
          localField: 'provinceId',
          foreignField: '_id',
          as: 'province',
        },
      },
      {
        $lookup: {
          from: 'GeoDistrict',
          localField: 'districtId',
          foreignField: '_id',
          as: 'district',
        },
      },
      {
        $project: {
          _id: 0,
          ward: 1,
          wardId: '$_id',
          country: {
            $arrayElemAt: ['$country.name', 0],
          },
          countryId: {
            $arrayElemAt: ['$country._id', 0],
          },
          province: {
            $arrayElemAt: ['$province.fullName', 0],
          },
          provinceId: {
            $arrayElemAt: ['$province._id', 0],
          },
          district: {
            $arrayElemAt: ['$district.fullName', 0],
          },
          districtId: {
            $arrayElemAt: ['$district._id', 0],
          },
        },
      },
    ];
    return query;
  }

  __checkGeoIntegrity(geoIntegrityNames) {
    for (let datum of this.data) {
      if (datum.wardId) {
        const matchedGeoIntegrity = geoIntegrityNames[datum.wardId];
        if (!matchedGeoIntegrity) {
          throw new Error("Given data's ward does not even exist in database");
        } else {
          let isIntegrous = true;
          if (datum.districtId && matchedGeoIntegrity.district !== datum.districtId) {
            isIntegrous = false;
          } else if (datum.provinceId && matchedGeoIntegrity.province !== datum.provinceId) {
            isIntegrous = false;
          } else if (datum.countryId && matchedGeoIntegrity.country !== datum.countryId) {
            isIntegrous = false;
          }
          if (!isIntegrous) {
            throw createTranslatedError('importData.NON_INTEGRITY_GEO', {
              district: datum.districtId,
              province: datum.provinceId,
              ward: datum.wardId,
            });
          }
        }
      } else {
        throw new Error('Given data does not have lowest level geographical data for validation (ward)!');
      }
    }
  }

  __replaceGeoNameWithID(geoIDs) {
    const replacedData = clone(this.data);
    for (let i = 0; i < replacedData.length; i++) {
      const ward = replacedData[i]['wardId'];
      if (geoIDs[ward]) {
        const matchedGeoID = geoIDs[ward];
        replacedData[i].ward = replacedData[i]['wardId'];
        replacedData[i]['wardId'] = matchedGeoID['wardId'];
        if (replacedData[i]['districtId']) {
          replacedData[i].district = replacedData[i]['districtId'];
          replacedData[i]['districtId'] = matchedGeoID['districtId'];
        }
        if (replacedData[i]['provinceId']) {
          replacedData[i].province = replacedData[i]['provinceId'];
          replacedData[i]['provinceId'] = matchedGeoID['provinceId'];
        }
        if (replacedData[i]['countryId']) {
          replacedData[i]['countryId'] = matchedGeoID['countryId'];
        }
      }
    }
    this.data = replacedData;
  }

  __getQuarterData(rawQuarterName, address) {
    // rawQuarterName = "Đoài" || "Thôn Đoài"
    // address = " thôn Đoài, xã Tam Giang, huyện Yên Phong, tỉnh Bắc Ninh"
    let quarterPrefix = null;
    let includePrefix = false;
    if (rawQuarterName.includes('Xóm')) {
      quarterPrefix = 'Xóm';
      includePrefix = true;
    } else if (rawQuarterName.includes('Thôn')) {
      quarterPrefix = 'Thôn';
      includePrefix = true;
    } else if (rawQuarterName.includes('Ấp')) {
      quarterPrefix = 'Ấp';
      includePrefix = true;
    } else if (rawQuarterName.includes('Khu phố')) {
      quarterPrefix = 'Khu phố';
      includePrefix = true;
    } else {
      const quarterIndex = address.indexOf(rawQuarterName.trim().toLowerCase());
      quarterPrefix = capitalize(address.slice(0, quarterIndex).trim());
    }

    return {
      quarterFullName: includePrefix ? rawQuarterName : ' ' + rawQuarterName,
      quarterPrefix,
    };
  }

  __createFormattedAddress() {
    this.data = this.data.map(datum => {
      if (
        typeof datum.quarterId === 'string' &&
        typeof datum.wardId === 'string' &&
        typeof datum.districtId === 'string' &&
        typeof datum.provinceId === 'string' &&
        typeof datum.countryId === 'string'
      ) {
        datum.formattedAddress = [
          datum.quarterId,
          datum.wardId,
          datum.districtId,
          datum.provinceId,
          datum.countryId,
        ].join(', ');
      }
      return datum;
    });
  }

  __parseGeopoint() {
    for (let datum of this.data) {
      if (datum.position) {
        let isParsableGeopoint = false;
        let longitude = null;
        let latitude = null;

        const position = compact(compact(datum.position.split(',')).map(i => parseFloat(i, 10)));
        if (position.length === 2) {
          latitude = position[0];
          longitude = position[1];
          // First string is latitude (-90 -> 90)
          // Second string is longitude (-180 -> 180)
          if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
            isParsableGeopoint = true;
          }
        }

        if (!isParsableGeopoint) {
          throw createTranslatedError('importData.UNPARSEABLE_GEO_DATA', { name: datum.name, data: datum.position });
        } else {
          datum.position = { lng: longitude, lat: latitude };
        }
      }
    }
  }

  async __validateQuarter() {
    const CacheLocation = this.model.app.models.CacheLocation;
    const GeoQuarter = this.model.app.models.GeoQuarter;

    for (let datum of this.data) {
      let isValidated = false;
      if (datum.formattedAddress) {
        // Extract the queriable address
        let addressQuery = null;
        if (datum.formattedAddress && typeof datum.formattedAddress === 'string') {
          addressQuery = datum.formattedAddress
            .split(',')
            .slice(1)
            .map(addr => addr.toLowerCase().trim())
            .join(', ');
        } else {
          console.error('formattedAddress Error', datum);
        }

        // Query the reference geocache
        // If first query failed, query the Google Map's API instead
        // Write fetched result as new position if the sheet did not already contain it
        const resultFromReferenceGeoCache = await CacheLocation.findById(addressQuery);
        if (resultFromReferenceGeoCache) {
          isValidated = true;
          if (!datum.position) {
            datum.position = resultFromReferenceGeoCache.position;
          }
        } else {
          if (process.env.ACTIVE_GOOGLE_MAP_API) {
            const resultFromGoogleMap = await getGeopointFromGoogleMap(addressQuery, this.model, 500);
            if (resultFromGoogleMap) {
              isValidated = true;
              if (!datum.position) {
                datum.position = resultFromGoogleMap;
              }
            }
          } else {
            isValidated = true;
          }
        }

        if (datum.quarterId) {
          // const { quarterFullName, quarterPrefix } = this.__getQuarterData(datum.quarterId, addressQuery);
          // const quarterData = {
          //   name: datum.quarterId,
          //   countryId: datum.countryId,
          //   provinceId: datum.provinceId,
          //   districtId: datum.districtId,
          //   fullName: quarterFullName,
          //   prefix: quarterPrefix,
          //   geoGroupId: null,
          //   isValidated,
          // };
          const quarterId = await GeoQuarter.find(
            {
              where: {
                or: [
                  {
                    name: datum.quarterId,
                  },
                  {
                    fullName: datum.quarterId,
                  },
                ],
              },
            },
            // quarterData,
          );
          if (quarterId.length == 0) {
            throw new Error('Not found quarter ' + datum.quarterId);
          }

          const fetchedQuarter = quarterId[0];

          if (fetchedQuarter) {
            // Validate the geointegrity of quarter data
            const { provinceId, districtId, wardId, id } = fetchedQuarter;
            if (
              datum.provinceId.toString() !== provinceId.toString() ||
              datum.districtId.toString() !== districtId.toString() ||
              datum.wardId.toString() !== wardId.toString()
            ) {
              throw createTranslatedError('importData.NON_INTEGRITY_GEO_WITH_QUARTER', {
                district: datum.district,
                province: datum.province,
                ward: datum.ward,
                quarter: datum.quarterId,
              });
            } else {
              datum.quarterId = id;
            }

            // Update location data for quarter
            if (!fetchedQuarter.position && datum.position) {
              await fetchedQuarter.updateAttribute('position', datum.position);
            }
          }
        }
      }
    }
  }

  async __replaceFormulaNameWithIDs() {
    // Get a set of unique dma names of client data
    const inputFormulas = uniq(compact(this.data.map(datum => datum.formulaId)));

    // Fetch corresponding IDs
    const formulaIds = await this.model.app.models.Formula.find({
      where: { name: { inq: inputFormulas } },
      fields: { id: true, name: true },
    }).then(records =>
      records
        .map(record => record.toJSON())
        .reduce((acc, val) => {
          acc[val.name] = val.id;
          return acc;
        }, {}),
    );

    // Replace
    // Throw invalid errors if any of dma does not match with fetched IDs
    for (let i = 0; i < this.data.length; i++) {
      let formulaId = this.data[i].formulaId;
      if (formulaId) {
        if (formulaIds[formulaId]) {
          this.data[i].formulaId = formulaIds[formulaId];
        } else {
          throw new Error(`DMA ${formulaId} is not valid`);
        }
      }
    }
  }

  async __replaceDmaNameWithIDs() {
    // Get a set of unique dma names of client data
    const inputDma = uniq(compact(this.data.map(datum => datum.dmaId)));

    // Fetch corresponding IDs
    const dmaIds = await this.model.app.models.Dma.find({
      where: { name: { inq: inputDma } },
      fields: { id: true, name: true },
    }).then(records =>
      records
        .map(record => record.toJSON())
        .reduce((acc, val) => {
          acc[val.name] = val.id;
          return acc;
        }, {}),
    );

    // Replace
    // Throw invalid errors if any of dma does not match with fetched IDs
    for (let i = 0; i < this.data.length; i++) {
      let dmaId = this.data[i].dmaId;
      if (dmaId) {
        if (dmaIds[dmaId]) {
          this.data[i].dmaId = dmaIds[dmaId];
        } else {
          throw new Error(`DMA ${dmaId} is not valid`);
        }
      }
    }
  }

  async __replaceProviderNameWithIDs() {
    // Get a set of unique provider names of client data
    const inputProviders = uniq(compact(this.data.map(datum => datum.providerId)));

    // Contact database to retrieve the IDs for them
    const providerIds = await this.model.app.models.WaterProvider.find({
      where: { name: { inq: inputProviders } },
      fields: { id: true, name: true },
    }).then(records =>
      records
        .map(record => record.toJSON())
        .reduce((acc, val) => {
          acc[val.name] = val.id;
          return acc;
        }, {}),
    );

    // Replace
    // Throw invalid errors if any of provider does not match with fetched IDs
    for (let i = 0; i < this.data.length; i++) {
      let providerId = this.data[i].providerId;
      if (providerId) {
        if (providerIds[providerId]) {
          this.data[i].providerId = providerIds[providerId];
        } else {
          throw new Error(`Provider ${providerId} is not valid`);
        }
      }
    }
  }

  async import(importFunc = null) {
    if (!this.data) {
      throw new Error('Not finding any data to validate!');
    }

    if (!this.isTranslated) {
      throw new Error('Data has not been translated yet!');
    }

    if (!importFunc && this.model.definition.name !== 'Client') {
      throw new Error('Default import pipeline is only for Client model!');
    }

    if (importFunc) {
      await importFunc.bind(this)();
      return;
    }

    // By default, this would import data into Client collection/table
    // This process assume given data corresponds to existing clients,
    //  who have been using water but now start to subscribe to our service
    // Missing data would be assigned by default

    /*  
       1. Check duplicate of 'code'
       2. Replace geodata's name with IDs 
       3. Validate instances of GeoQuarter model via checking in reference cache or querying Google Map before insertion
    */

    // 1. Check duplicate
    this.__checkDuplicate();

    // 1.2. Insert pre-configured country data
    this.__insertConfiguredCountryData();

    // 1.5. Check geographical data integrity
    let geoIntegrityNames = await aggregate(this.model.app.models.GeoWard, this.__createGeoIntegrityQuery());
    geoIntegrityNames = geoIntegrityNames.reduce(
      (acc, val) => ({
        ...acc,
        [val.ward]: val,
      }),
      {},
    );
    this.__checkGeoIntegrity(geoIntegrityNames);

    // 2. Replace geodata's name with IDs
    this.__replaceGeoNameWithID(geoIntegrityNames);

    // 2.1. Replace provider's name with IDS
    await this.__replaceProviderNameWithIDs();

    // 2.2. Replace dma's name with IDS
    await this.__replaceDmaNameWithIDs();

    // 2.3. Replace formula's name with Ids
    await this.__replaceFormulaNameWithIDs();

    await this.validate();

    if (!this.isValidated) {
      throw new Error('Data has not been validated yet!');
    }

    // 2.4. Parse geopoint data
    await this.__parseGeopoint();

    // 3 + 4. Validate quarter name value by consulting reference cache or querying Google Map API before insertion
    // If there isn't any validation from local cache or Google Map's, mark that quarter as `false` in "isValidated" field
    // Obtain geopoints from querying to local cache or Google Map's API,
    await this.__validateQuarter();

    // Begin transaction
    const transaction = new Transaction(this.model);
    const session = transaction.start({ writeConcern: { wtimeout: 1200000 } });

    const rawClient = getConnectorFromModel(this.model);
    const rawClientRegister = getConnectorFromModel(this.model, 'ClientRegister');
    const rawClientMeter = getConnectorFromModel(this.model, 'ClientMeter');

    const clientRegisterFields = [
      'name',
      'formattedAddress',
      'phoneNumber',
      'type',
      'position',
      'familyCount',
      'memberCount',
      'buyerIdType',
      'buyerIdNo',
      'buyerFaxNumber',
      'buyerEmail',
      'buyerBankName',
      'buyerBankAccount',
      'statusSurvey',
      'resultSurvey',
      'provinceId',
      'districtId',
      'wardId',
      'quarterId',
      'providerId',
    ];

    const Client = this.model;
    const clientFields = [
      'code',
      'name',
      'address',
      'formattedAddress',
      'position',
      'phoneNumber',
      'taxNo',
      'type',
      'familyCount',
      'memberCount',
      'contractNo',
      'contractDate',
      'contractStatus',
      'paymentType',
      'buyerIdType',
      'buyerIdNo',
      'buyerFaxNumber',
      'buyerEmail',
      'buyerBankName',
      'buyerBankAccount',
      'termMeterNumber',
      'termInvoice',
      'serial',
      'provinceId',
      'districtId',
      'wardId',
      'quarterId',
      'providerId',
      'dmaId',
      'formulaId',
    ];

    const ClientRequest = this.model.app.models.ClientRequest;

    try {
      let index = 0;
      for (let datum of this.data) {
        index += 1;
        console.log(new Date().toLocaleString(), index, datum.name);
        // 5. Create a new model of ClientRegister, get fields required for this model beforehand and sign a Contract (aka call .contractSign() method)
        const clientRegisterData = mapValues(pick(datum, clientRegisterFields), (value, key) => {
          if (['provinceId', 'districtId', 'wardId', 'quarterId', 'providerId'].includes(key)) {
            return toObjectId(value);
          } else {
            return value;
          }
        });
        const clientRegister = await rawClientRegister.insertOne(clientRegisterData, { session });
        const clientRegisterId = toObjectId(clientRegister.insertedId);

        // 5.1. Prepare the data to create contract
        const clientDataToCreateContract = mapValues(pick(datum, clientFields), (value, key) => {
          if (['provinceId', 'districtId', 'wardId', 'quarterId', 'providerId', 'dmaId', 'formulaId'].includes(key)) {
            return toObjectId(value);
          } else {
            return value;
          }
        });
        clientDataToCreateContract.clientRegisterId = clientRegisterId;

        // 5.5. Pass the newly created ClientRegister ID to contractSign() method so it could update the ClientRegister model
        const contract = await Client.contractSign(clientDataToCreateContract, transaction, session);
        const clientId = contract['_id'];

        // 5.6. Update newly registered Client with clientID
        await rawClientRegister.updateOne({ _id: clientRegisterId }, { $set: { clientId: clientId } }, { session });

        // 6. Create a new model of ClientMeter
        const clientMeterData = {
          clientId,
          name: `KH ${contract.name}`,
          startMeterNumber: datum.lastMeterNumber ? +datum.lastMeterNumber : 0.0,
          setupDate: datum.startMeterDate ? datum.startMeterDate : new Date(),
          startMeterDate: datum.startMeterDate ? datum.startMeterDate : new Date(),
        };
        const clientMeter = await rawClientMeter.insertOne(clientMeterData, { session });

        // 6.1. Set reference from ClientMeter to Client model
        await rawClient.updateOne(
          { _id: clientId },
          { $set: { meterId: clientMeter.insertedId, startMeterDate: clientMeterData.startMeterDate } },
          { session },
        );

        // 7. Create request to install new meter
        const clientRequestCreateData = {
          clientId,
          setupDate: clientMeterData.startMeterDate,
          type: 'NEW_INSTALL',
        };
        await ClientRequest.createRequest(clientRequestCreateData, this.httpOptions, session);

        const clientRequestCompleteData = {
          clientId,
          setupDate: clientMeterData.startMeterDate,
          type: 'NEW_INSTALL',
          meterId: clientMeter.insertedId,
          startMeterNumber: datum.lastMeterNumber ? +datum.lastMeterNumber : 0.0,
          serial: datum.serial,
        };
        if (datum.termMeterNumber) {
          clientRequestCompleteData.termMeterNumber = datum.termMeterNumber;
        }
        if (datum.termInvoice) {
          clientRequestCompleteData.termInvoice = datum.termInvoice;
        }
        if (datum.lastTimeMeterNumberUpdate) {
          clientRequestCompleteData.lastTimeMeterNumberUpdate = datum.lastTimeMeterNumberUpdate;
        }
        // 8. Complete the request (aka call .completeRequest() method)
        await ClientRequest.completeRequest(clientRequestCompleteData, this.httpOptions, transaction, session);
      }
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      console.error(err);
      throw err;
    }
  }
}

module.exports = ExcelFile;
