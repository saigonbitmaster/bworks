'use strict';
const error = require('../../i18n/vi/error');

module.exports = function(Client) {
  // Validation constraint
  Client.validatesPresenceOf('code', {
    message: error.REQUIRED_DATA_NOT_EXIST,
  });
  Client.validatesPresenceOf('name', {
    message: error.REQUIRED_DATA_NOT_EXIST,
  });
  Client.validatesInclusionOf('type', {
    in: ['RESIDENT', 'ORGANIZATION', 'INDUSTRY', 'SERVICE'],
    message: error.INVALID_DATA,
  });
  Client.validatesPresenceOf('familyCount', 'memberCount', {
    message: error.REQUIRED_DATA_NOT_EXIST,
  });
  Client.validatesInclusionOf('contractStatus', {
    in: ['ACTIVE', 'STOP'],
    message: error.INVALID_DATA,
  });
  Client.validatesInclusionOf('buyerIdType', {
    in: ['1', '2', '3'],
    message: error.INVALID_DATA,
  });
  Client.validatesLengthOf('buyerIdNo', {
    max: 20,
    allowBlank: true,
    allowNull: true,
    message: {
      max: error.DATA_TOO_LONG,
    },
  });
  Client.validatesLengthOf('buyerFaxNumber', {
    max: 20,
    allowBlank: true,
    allowNull: true,
    message: {
      max: error.DATA_TOO_LONG,
    },
  });
  Client.validatesLengthOf('buyerEmail', {
    max: 50,
    allowBlank: true,
    allowNull: true,
    message: {
      max: error.DATA_TOO_LONG,
    },
  });
  Client.validatesLengthOf('buyerBankName', {
    max: 256,
    allowBlank: true,
    allowNull: true,
    message: {
      max: error.DATA_TOO_LONG,
    },
  });
  Client.validatesLengthOf('buyerBankAccount', {
    max: 20,
    allowBlank: true,
    allowNull: true,
    message: {
      max: error.DATA_TOO_LONG,
    },
  });
};
