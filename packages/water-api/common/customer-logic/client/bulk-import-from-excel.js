'use strict';
const path = require('path');
const httpError = require('http-errors');
const ExcelFile = require('../../common-logic/engine/import/ExcelFile');
const computeChecksumForFile = require('../../utils/compute-checksum-for-file');

// Push the import process into job queue
// Store the file's checksum into a field in the job's metadata
// Whenever another request with similar file content for request
// Calculate its checksum and compare with ones stored in BackgroundJob collection
// If there's some, check for completion status and display still-in-progress or completed process

module.exports = Client => {
  Client.importClientsFromExcel = async (filename, options) => {
    const uploadedExcelDir = Client.app.dirs.tempSheet.uploaded;
    const filepath = path.resolve(uploadedExcelDir, filename);

    const checksum = await computeChecksumForFile(filepath);
    const jobKey = `${checksum}-Client`;

    const job = await Client.app.models.BackgroundJob.findOne({ where: { key: jobKey } });

    let jobStatus = '';
    let jobError = '';
    if (!job) {
      // Put the process onto the queue
      await Client.app.runBackground({
        path: 'Client.importClientsFromExcelInternal',
        jobKey,
        data: { filepath, options },
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

  Client.importClientsFromExcelInternal = async ({ filepath, options }) => {
    // Initialize
    const client = new ExcelFile({
      filepath,
      model: Client,
      dataSheetName: 'Sheet1',
      httpOptions: options,
    });

    try {
      // Translate the headers and values
      client.translate();
      // Convert to Date objects for some Date fields
      client.convertToDate();
      // Commence the import process
      await client.import();
    } catch (err) {
      throw httpError(400, err.message);
    }
  };

  Client.remoteMethod('importClientsFromExcel', {
    http: { verb: 'GET' },
    accepts: [
      { arg: 'filename', type: 'string' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'jobData', type: 'object', root: true },
  });
};
