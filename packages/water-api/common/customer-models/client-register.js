'use strict';
const error = require('../../i18n/vi/error');

module.exports = function(Clientregister) {
  Clientregister.validatesInclusionOf('type', {
    in: ['RESIDENT', 'ORGANIZATION', 'INDUSTRY', 'SERVICE'],
    message: error.INVALID_DATA,
  });
  Clientregister.validatesPresenceOf('familyCount', 'memberCount', { message: 'Cannot be blank' });
  Clientregister.validatesInclusionOf('status', {
    in: ['NEW', 'INSTALL_WAITING', 'CONTRACT_SIGNED', 'COMPLETE'],
    message: error.INVALID_DATA,
  });
  Clientregister.validatesInclusionOf('buyerIdType', {
    in: ['1', '2', '3'],
    message: error.INVALID_DATA,
  });
  Clientregister.validatesLengthOf('buyerIdNo', {
    max: 20,
    allowBlank: true,
    allowNull: true,
    message: { max: error.DATA_TOO_LONG },
  });
  Clientregister.validatesLengthOf('buyerFaxNumber', {
    max: 20,
    allowBlank: true,
    allowNull: true,
    message: { max: error.DATA_TOO_LONG },
  });
  Clientregister.validatesLengthOf('buyerEmail', {
    max: 50,
    allowBlank: true,
    allowNull: true,
    message: { max: error.DATA_TOO_LONG },
  });
  Clientregister.validatesLengthOf('buyerBankName', {
    max: 256,
    allowBlank: true,
    allowNull: true,
    message: { max: error.DATA_TOO_LONG },
  });
  Clientregister.validatesLengthOf('buyerBankAccount', {
    max: 20,
    allowBlank: true,
    allowNull: true,
    message: { max: error.DATA_TOO_LONG },
  });

  // function validateCountry(err, done) {
  //   const countryId = this.countryId;
  //   const GeoCountry = Clientregister.app.models.GeoCountry;

  //   if (countryId) {
  //     GeoCountry.findById(countryId, (error, countryInstance) => {
  //       if (!countryInstance) err();
  //       done();
  //     });
  //   } else {
  //     done();
  //   }
  // }

  // Clientregister.validateAsync('countryId', validateCountry, { message: error.NON_EXISTENT_DATA });

  // function validateProvince(err, done) {
  //   const provinceId = this.provinceId;
  //   const GeoProvince = Clientregister.app.models.GeoProvince;

  //   if (provinceId) {
  //     GeoProvince.findById(provinceId, (error, provinceInstance) => {
  //       if (!provinceInstance) err();
  //       done();
  //     });
  //   } else {
  //     done();
  //   }
  // }

  // Clientregister.validateAsync('provinceId', validateProvince, { message: error.NON_EXISTENT_DATA });

  // function validateDistrict(err, done) {
  //   const districtId = this.districtId;
  //   const GeoDistrict = Clientregister.app.models.GeoDistrict;

  //   if (districtId) {
  //     GeoDistrict.findById(districtId, (error, districtInstance) => {
  //       if (!districtInstance) err();
  //       done();
  //     });
  //   } else {
  //     done();
  //   }
  // }

  // Clientregister.validateAsync('districtId', validateDistrict, { message: error.NON_EXISTENT_DATA });

  // function validateWard(err, done) {
  //   const wardId = this.wardId;
  //   const GeoWard = Clientregister.app.models.GeoWard;

  //   if (wardId) {
  //     GeoWard.findById(wardId, (error, wardInstance) => {
  //       if (!wardInstance) err();
  //       done();
  //     });
  //   } else {
  //     done();
  //   }
  // }

  // Clientregister.validateAsync('wardId', validateWard, { message: error.NON_EXISTENT_DATA });

  // function validateQuarter(err, done) {
  //   const quarterId = this.quarterId;
  //   const GeoQuarter = Clientregister.app.models.GeoQuarter;

  //   if (quarterId) {
  //     GeoQuarter.findById(quarterId, (error, quarterInstance) => {
  //       if (!quarterInstance) err();
  //       done();
  //     });
  //   } else {
  //     done();
  //   }
  // }

  // Clientregister.validateAsync('quarterId', validateQuarter, { message: error.NON_EXISTENT_DATA });

  // function validateProvider(err, done) {
  //   const providerId = this.providerId;
  //   const WaterProvider = Clientregister.app.models.WaterProvider;

  //   if (providerId) {
  //     WaterProvider.findById(providerId, (error, providerInstance) => {
  //       if (!providerInstance) err();
  //       done();
  //     });
  //   } else {
  //     done();
  //   }
  // }

  // Clientregister.validateAsync('providerId', validateProvider, { message: error.NON_EXISTENT_DATA });
};
