'use strict';
const debug = require('debug');
const moment = require('moment-timezone');
const deburr = require('lodash/deburr');
const has = require('lodash/has');
const head = require('lodash/head');
const toLower = require('lodash/toLower');
const shuffle = require('lodash/shuffle');

module.exports = async app => {
  // Rename `location` field to `position`
  const refactorLocationToPosition = async () => {
    const modelsContainingLocationAttribute = [
      'ClientRegister',
      'Client',
      'GeoCountry',
      'GeoQuarter',
      'GeoWard',
      'CacheLocation',
      'DataLogger',
      'Meter',
      'Pump',
      'WaterSource',
    ];
    for (const model of modelsContainingLocationAttribute) {
      if (model in app.models) {
        const allRecords = await app.models[model].find({});
        for (const record of allRecords) {
          if (
            record.location &&
            record.location.type === 'Point' &&
            Array.isArray(record.location.coordinates) &&
            record.location.coordinates.length === 2
          ) {
            const [lng, lat] = record.location.coordinates;
            const geopoint = new app.loopback.GeoPoint({ lat, lng });
            const { id, ...rest } = record.toJSON();
            delete rest.location;
            rest.position = geopoint;
            await app.models[model].replaceById(id, rest);
          }
        }
      }
    }
    debug('water-api:boot:refactor-location-to-position')(
      'Finish migrate models containing `location` key to `position` key',
    );
  };

  // Change schema of object-typed value of `image` field in some models
  const modernizeLegacyImageField = async () => {
    const imageContainingModels = [{ name: 'ClientMeterNumber', legacyField: 'meterImage' }];
    // Update all records having legacy field of meterImage
    for (let { name, legacyField } of imageContainingModels) {
      if (app.models[name]) {
        const model = app.models[name];
        const data = await model.find({ where: { [legacyField]: { like: 'CtmFiles/.*' } } });
        for (let record of data) {
          if (has(record, legacyField)) {
            const { id, ...rest } = record.toJSON();
            const images = { name: moment(record.toDate).format('MM-YYYY'), url: record[legacyField] };
            delete rest[legacyField];
            rest.images = images;
            await model.replaceById(id, rest);
          }
        }
      }

      debug('water-api:boot:modernize-legacy-image-field')(
        `Finish update legacy attribute "${legacyField}" for model "${name}"`,
      );
    }
  };

  const addGeoGroupFlag = async () => {
    // Get all GeoWards instances
    // Add `assignedToGeoGroup` attribute
    // The value would depend on the value of `geoGroupId` attribute
    // If `geoGroupId` does not exist or null, `assignedToGeoGroup` is of value 'no'
    // Else, `assignedToGeoGroup` is of value 'yes'

    // It is this attribute that front-end code could figure which wards have been assigned
    // to geo groups and which have not

    const GeoWard = app.models.GeoWard;
    const geoWards = await GeoWard.find();
    for (let geoWard of geoWards) {
      if (geoWard.geoGroupId) {
        geoWard.assignedToGeoGroup = true;
      } else {
        geoWard.assignedToGeoGroup = false;
      }
      await geoWard.save();
    }

    debug('water-api:boot:modernize-legacy-image-field')('Finish adding geo group flag to wards');
  };

  // Assign DMA ids (level 2) randomly to clients
  const assignDmaIdToClients = async () => {
    const dmaIds = await app.models.Dma.find({ where: { level: 2 }, fields: { id: true } });
    const clients = await app.models.Client.find();
    for (let client of clients) {
      if (!client.dmaId) {
        const randomDmaId = dmaIds[Math.floor(Math.random() * dmaIds.length)]['id'];
        const assignToClient = Math.random() < 0.5;
        if (assignToClient) {
          await client.updateAttribute('dmaId', randomDmaId);
        }
      }
    }
    debug('water-api:boot:assign-dma-to-client')('Finish adding random DMA to client');
  };

  // Set default canceled state for invoice records
  const setInvoiceDefaultCancellationState = async () => {
    const invoices = await app.models.EInvoiceData.find({});
    for (const invoice of invoices) {
      if (!has(invoice, 'canceled')) {
        await invoice.updateAttribute('canceled', false);
      }
    }
    debug('water-api:boot:set-default-invoice-cancellation-state')(
      'Finish setting default cancellation state of einvoice',
    );
  };

  // Assign randomly made email to clients for testing invoice operation
  const addMailAddressToClientToTestInvoice = async () => {
    const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'aol.com', 'icloud.com'];
    const clients = await app.models.Client.find({ fields: { id: true, name: true, buyerEmail: true } });
    for (const client of clients) {
      if (!client.buyerEmail) {
        const words = client.name.trim().split(' ');
        const newEmail =
          words
            .slice(0, words.length - 1)
            .map(word => toLower(head(word)))
            .join('') +
          toLower(deburr(words[words.length - 1])) +
          '@' +
          emailDomains[parseInt(Math.random() * emailDomains.length)];
        await app.models.Client.updateAll({ id: client.id }, { buyerEmail: newEmail });
      }
    }
    debug('water-api:boot:add-mail-to-client-to-test-invoice-ops')('Finish adding email to client to test invoice ops');
  };

  class NameGenerator {
    constructor() {
      this.firstNames = [];
      this.middleNames = [];
      this.lastNames = [];
      this.shuffled = false;
    }

    add(firstName, middleName, lastName) {
      this.firstNames.push(firstName);
      if (!lastName) {
        this.lastNames.push(middleName);
      } else {
        this.middleNames.push(middleName);
        this.lastNames.push(lastName);
      }
    }

    get(wordCount = 2) {
      if (wordCount < 1 || wordCount > 3) {
        throw new Error(`Cant generate a name have ${wordCount} word(s)`);
      }
      if (!this.shuffled) {
        this.firstNames = shuffle([...new Set(this.firstNames)]);
        this.middleNames = shuffle([...new Set(this.middleNames)]);
        this.lastNames = shuffle([...new Set(this.lastNames)]);
        this.shuffled = true;
      }
      const firstName = this.firstNames[parseInt(Math.random() * this.firstNames.length)];
      const middleName =
        wordCount === 2
          ? this.lastNames[parseInt(Math.random() * this.lastNames.length)]
          : this.middleNames[parseInt(Math.random() * this.middleNames.length)];
      if (wordCount == 2) {
        return `${firstName} ${middleName}`;
      } else {
        const lastName = this.lastNames[parseInt(Math.random() * this.lastNames.length)];
        return `${firstName} ${middleName} ${lastName}`;
      }
    }
  }

  // Shuffle private data of clients
  const shufflePrivateClientData = async () => {
    // Get client data
    const clients = await app.models.Client.find({ fields: { id: 1, name: 1 } });

    // Split client's name and put into a bag of words
    const nameGenerator = new NameGenerator();
    for (const client of clients) {
      const words = client.name.split(' ');
      if (words.length === 2 || words.length === 3) {
        nameGenerator.add(...words);
      }
    }

    // Iterate over each client's id, generate a new name then save to db
    for (const client of clients) {
      const words = client.name.split(' ');
      if (words.length === 2 || words.length === 3) {
        const shuffledName = nameGenerator.get(words.length);
        await app.models.Client.updateAll({ id: client.id.toString() }, { name: shuffledName });
      }
    }

    debug('water-api:boot:shuffle-private-client-data')('Finish shuffling private client data');
  };

  if (process.env.NODE_MODIFY) {
    await setInvoiceDefaultCancellationState(); // No need for brand new deployment
    await refactorLocationToPosition(); // No need for brand new deployment
    await modernizeLegacyImageField(); // No need for brand new deployment
    await addGeoGroupFlag(); // No need for brand new deployment
    if (process.env.NODE_INIT_TEST_DATA) {
      // await assignDmaIdToClients();
      await addMailAddressToClientToTestInvoice();
      await shufflePrivateClientData();
    }
  }
};
