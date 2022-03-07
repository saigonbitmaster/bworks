'use strict';
const moment = require('moment-timezone');
const createError = require('http-errors');
const operationMeta = require('ra-loopback3/server/utils/operation-meta');
const path = require('path');
const Transaction = require('../../utils/transaction');
const toObjectId = require('../../utils/to-object-id');
const { getConnectorFromModel } = require('../../utils/transaction-utils');
const isEmpty = require('lodash/isEmpty');
const isEqual = require('lodash/isEqual');

module.exports = ClientMeterNumber => {
  ClientMeterNumber.updateMonth = async (data, project, options = {}, transaction, session) => {
    project = project || 'ctm';

    // Check if the caller is indeed permitted to invoke this method
    const AppUser = ClientMeterNumber.app.models.AppUser;
    let isAdmin = true; // temporary allow any user update
    if (!isEmpty(options)) {
      const [allowedApis, type] = await AppUser.myAccess(project, options).then(({ apiPath = {}, type }) => [
        Object.keys(apiPath).map(api => path.basename(api)),
        type,
      ]);

      if (allowedApis.includes('forceUpdateMonth') || type === 'master') {
        isAdmin = true;
      }
    }

    let Client = ClientMeterNumber.app.models.Client;
    const {
      clientId,
      currentNumber: tempCurr,
      previousNumber: tempPrevious,
      toDate,
      fromDate,
      images,
      description = '',
      invoiceIssuedDate,
    } = data;
    const nextMonth = moment(fromDate).add(1, 'month');
    const currentNumber = parseInt(tempCurr, 10);
    const previousNumber = parseInt(tempPrevious, 10);
    if (
      !clientId ||
      !fromDate ||
      isNaN(currentNumber) ||
      isNaN(previousNumber) ||
      !moment(fromDate).isBefore(toDate, 'month') ||
      !moment(toDate).isBetween(moment(nextMonth).startOf('month'), moment(nextMonth).endOf('month'), null, '[]')
    ) {
      throw createError(400, 'error.DATA_INVALID');
    }

    let current = await ClientMeterNumber.findById(data.id);
    if (!current) {
      throw createError(400, 'error.DATA_NOT_EXIST');
    }

    // ensure the client actually changed something
    if (
      current.currentNumber === currentNumber &&
      moment(current.toDate).isSame(moment(toDate)) &&
      isEqual(current.images, images) &&
      isEqual(current.description, description)
    ) {
      return;
    }

    if (moment(toDate).diff(current.toDate, 'day') < -1) {
      throw createError(400, 'error.RECORD_DATE_IS_OLD');
    }

    if (current.paymentStatus === true && current.previousNumber !== current.currentNumber) {
      throw createError(400, 'error.PAID_CAN_NOT_EDIT_DATA');
    }

    let lastWrite = await ClientMeterNumber.findOne({
      order: 'toDate DESC',
      where: { clientId: data.clientId, id: { neq: data.id } },
    });
    if (lastWrite && !moment(lastWrite.toDate).isSame(fromDate, 'month')) {
      throw createError(400, 'error.CAN_NOT_EDIT_DATA');
    }

    // check meter change
    let history = await ClientMeterNumber.app.models.ClientMeterHistory.findOne({
      where: { clientId, setupDate: { between: [fromDate, toDate] } },
      order: 'setupDate DESC',
    });
    if ((!history && currentNumber < previousNumber) || (history && currentNumber < history.newMeterNumber)) {
      throw createError(400, 'error.INVALID_CURRENT_METER_NUMBER');
    }

    if (
      !moment(current.fromDate).isSame(data.fromDate, 'month') ||
      !moment(current.toDate).isSame(data.toDate, 'month')
    ) {
      throw createError(400, 'error.DATA_INVALID');
    }

    // check client
    let client = await Client.findById(clientId);
    if (!client) {
      throw createError(400, 'error.CLIENT_NOT_EXIST');
    }

    if (client.status !== 'ACTIVE') {
      throw createError(400, 'error.CLIENT_NOT_ACTIVE');
    }

    // Check if clients has edited reference data
    if (data.code && data.name && data.formattedAddress) {
      if (data.code !== client.code || data.name !== client.name || data.formattedAddress !== client.formattedAddress) {
        throw createError(400, 'error.REF_DATA_HAS_BEEN_MODIFIED');
      }
    }

    let termMeterNumber = moment(toDate).startOf('month');

    // Prepare data to update client
    let clientUpdate = {
      lastMeterNumber: currentNumber,
      lastTimeMeterNumberUpdate: moment(toDate).toDate(),
      termMeterNumber: termMeterNumber.toDate(),
      termInvoice: termMeterNumber
        .subtract(1, 'month')
        .startOf('month')
        .toDate(),
    };

    // Wrap write ops in transaction
    clientUpdate = await operationMeta({ data: clientUpdate, options });
    data = await operationMeta({ data, options });

    let passingSession = true;
    if (!transaction || !session) {
      transaction = new Transaction(Client);
      session = transaction.start();
      passingSession = false;
    }

    try {
      await getConnectorFromModel(Client).updateOne({ _id: toObjectId(clientId) }, { $set: clientUpdate }, { session });

      const rawClientMeterNumber = getConnectorFromModel(ClientMeterNumber);
      const rawEinvoiceData = getConnectorFromModel(ClientMeterNumber, 'EInvoiceData');

      if (current.invoiceData) {
        // At this point, if triggered user doesnt have admin rights nor belonged to another transactional process, emit errors
        if (!passingSession && !isAdmin) {
          throw createError(400, 'error.NOT_PERMITTED');
        }

        // If current month's meter number fee has been charged, recompute the billing
        const meterNumberModification = await operationMeta({
          data: { paymentStatus: false, currentNumber, toDate: moment(toDate).toDate() },
          options,
        });
        if ('description' in data) {
          meterNumberModification.description = data.description;
        }
        if ('images' in data) {
          meterNumberModification.images = data.images;
        }

        // Only recompute the billing when this client does not have any existing einvoice
        // If it does, a invoice issued date must be present
        const existingClientEinvoiceCount = await rawEinvoiceData.countDocuments(
          {
            _id: `${clientId}-${moment(current.toDate).format('YYYY-MM')}`,
            canceled: false,
          },
          { session },
        );
        let newlyComputedInvoiceData = null;

        if (existingClientEinvoiceCount === 0 || invoiceIssuedDate) {
          await rawClientMeterNumber.updateOne({ _id: data.id }, { $set: meterNumberModification }, { session });
          newlyComputedInvoiceData = await ClientMeterNumber.calculateInvoicesInternal({
            month: toDate,
            ids: [current.clientId],
            filterValues: { invoiceNo: current.invoiceNo },
            session,
            transaction,
          });
        }

        if (passingSession) {
          if (invoiceIssuedDate) {
            return { id: current.id, invoiceIssuedDate, session };
          } else {
            return null;
          }
        } else {
          if (
            !isEmpty(options) &&
            current.invoiceData.totalWaterUsed > 0 &&
            newlyComputedInvoiceData &&
            invoiceIssuedDate
          ) {
            // Only generate replacement einvoice when client used water in previous month until current date
            if (newlyComputedInvoiceData.invoiceData.totalWaterUsed > 0) {
              await ClientMeterNumber.app.models.EInvoiceData.replaceEinvoice(
                current.id,
                invoiceIssuedDate,
                toDate,
                session,
              );

              // If client is already charged and get edited to not using water, cancel the previous invoice
            } else if (newlyComputedInvoiceData.invoiceData.totalWaterUsed === 0) {
              await ClientMeterNumber.app.models.EInvoiceData.cancelEinvoice(current.id, invoiceIssuedDate, session);
            }
          }
        }

        if (!passingSession) {
          await transaction.commit();
        }
      } else {
        const meterNumberModification = await operationMeta({
          data: {
            invoiceData: null,
            paymentStatus: false,
            currentNumber,
            toDate: moment(toDate).toDate(),
          },
          options,
        });
        if ('description' in data) {
          meterNumberModification.description = data.description;
        }
        if ('images' in data) {
          meterNumberModification.images = data.images;
        }

        const updatedCurrentMeterNumber = await rawClientMeterNumber.updateOne(
          { _id: data.id },
          { $set: meterNumberModification },
          { session },
        );

        await ClientMeterNumber.calculateInvoicesInternal({
          month: toDate,
          ids: [clientId],
          filterValues: {},
          session,
          transaction,
        });

        if (!passingSession) await transaction.commit();
        return updatedCurrentMeterNumber.result;
      }
    } catch (err) {
      if (!passingSession) await transaction.rollback();
      throw err;
    }
  };

  ClientMeterNumber.remoteMethod('updateMonth', {
    accepts: [
      { arg: 'data', type: 'object', required: true },
      { arg: 'project', type: 'string', required: true },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });

  ClientMeterNumber.forceUpdateMonth = ClientMeterNumber.updateMonth;

  ClientMeterNumber.remoteMethod('forceUpdateMonth', {
    accepts: [
      { arg: 'data', type: 'object', required: true },
      { arg: 'project', type: 'string' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
