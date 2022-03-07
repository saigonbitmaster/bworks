'use strict';
const path = require('path');
const httpError = require('http-errors');
const pick = require('lodash/pick');
const ExcelFile = require('../../common-logic/engine/import/ExcelFile');
const aggregate = require('../../utils/aggregate');
const computeChecksumForFile = require('../../utils/compute-checksum-for-file');

module.exports = ClientRegister => {
  ClientRegister.importClientRegistersFromExcel = async filename => {
    const uploadedExcelDir = ClientRegister.app.dirs.tempSheet.uploaded;
    const filepath = path.resolve(uploadedExcelDir, filename);

    const checksum = await computeChecksumForFile(filepath);
    const jobKey = `${checksum}-ClientRegister`;

    const job = await ClientRegister.app.models.BackgroundJob.findOne({ where: { key: jobKey } });

    let jobStatus = '';
    let jobError = '';
    if (!job) {
      // Put the process onto the queue
      await ClientRegister.app.runBackground({
        path: 'ClientRegister.importClientRegistersFromExcelInternal',
        jobKey,
        data: { filepath },
      });
      jobStatus = 'QUEUED';
    } else {
      // The job's already running, check whether it's still in progress or completed
      if (job.status === 'FINISH' && job.completedDate) {
        jobStatus = 'FINISH';
        if (job.error) {
          jobStatus = 'ERROR';
          jobError = job.error;
        }
      } else {
        jobStatus = 'IN_PROGRESS';
      }
    }

    return { jobStatus, jobError };
  };

  ClientRegister.importClientRegistersFromExcelInternal = async ({ filepath }) => {
    // Custom import function
    async function importClientRegister() {
      this.__insertConfiguredCountryData();

      let geoIntegrityNames = await aggregate(this.model.app.models.GeoWard, this.__createGeoIntegrityQuery());
      geoIntegrityNames = geoIntegrityNames.reduce(
        (acc, val) => ({
          ...acc,
          [val.ward]: val,
        }),
        {},
      );
      this.__checkGeoIntegrity(geoIntegrityNames);

      // 1. Create an address string from various geodata
      this.__createFormattedAddress();

      // 2. Replace geodata's name with IDs
      this.__replaceGeoNameWithID(geoIntegrityNames);

      // 3 + 4. Validate quarter name value by consulting reference cache or querying Google Map API before insertion
      // If there isn't any validation from local cache or Google Map's, mark that quarter as `false` in "isValidated" field
      // Obtain geopoints from querying to local cache or Google Map's API,
      await this.__validateQuarter();

      // Bulk insert data into ClientRegister model
      await this.model.create(this.data.map(datum => pick(datum, Object.keys(this.model.definition.properties))));
      // eslint-disable-next-line no-console
    }
    try {
      // Parse data from Excel files
      const clientRegisterExcel = new ExcelFile({
        filepath,
        model: ClientRegister,
        dataSheetName: 'Sheet1',
      });

      // Translate the headers and values
      clientRegisterExcel.translate();

      // Convert to Date object for some Date fields
      clientRegisterExcel.convertToDate();

      // Validate models
      await clientRegisterExcel.validate();
      await clientRegisterExcel.import(importClientRegister);
    } catch (err) {
      if (err.toClient) {
        throw httpError(400, err.message);
      }
      throw httpError(400, 'error.DATA_INVALID');
    }
  };

  ClientRegister.remoteMethod('importClientRegistersFromExcel', {
    accepts: { arg: 'filename', type: 'string' },
    http: { verb: 'get' },
    returns: { arg: 'jobData', type: 'object', root: true },
  });
};
