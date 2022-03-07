/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
'use strict';
const chunk = require('lodash/chunk');
const compact = require('lodash/compact');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const { Expo } = require('expo-server-sdk');
const moment = require('moment-timezone');

module.exports = MessageSystem => {
  // Create a new Expo SDK client
  const expo = new Expo();

  // MessageSystem.pushTest = async () => {
  //   await MessageSystem.create({
  //     data: { test: 'test' },
  //     meta: { test: 'test' },
  //     type: 'NOTIFY_APP',
  //     tryCount: 3,
  //     status: 'NEW',
  //     requester: 'taipt',
  //   });
  // };

  // Email
  MessageSystem.registerSendEmail = async (data, meta, options) => {};

  MessageSystem.processNewlySentEmail = async job => {
    // Check for new job for sending emails
    const data = await MessageSystem.find({ where: { type: 'EMAIL', status: 'NEW' } });
    if (!isEmpty(data)) {
      // Cut new jobs into batches
      const chunkedData = chunk(data, 10);
      // Contact with our mail server to send them off
      for (const chunked of chunkedData) {
        const sentEmails = await MessageSystem.app.models.Client.sendEmail(chunked);
        for (const { sentEmail, originalMessage } of sentEmails) {
          const messageId = (sentEmail.response || '').match(/queued as (.*)$/)[1];
          if (messageId) {
            if (sentEmail.accepted.length > 0 && sentEmail.rejected.length === 0 && sentEmail.response) {
              if (messageId) {
                await originalMessage.updateAttributes({
                  status: 'SENDING',
                  statusData: sentEmail,
                  sendTime: moment().toDate(),
                  messageId,
                });
              }
            } else {
              await originalMessage.updateAttributes({ status: 'RETRY', statusData: sentEmail });
            }
          }
        }
      }
    }
  };

  MessageSystem.processStatusOfSentEmail = async job => {
    const sendingEmails = await MessageSystem.find({ where: { type: 'EMAIL', status: 'SENDING' } });
    if (!isEmpty(sendingEmails)) {
      for (const sendingEmail of sendingEmails) {
        if (sendingEmail.statusData === 'SENT') {
          await sendingEmail.updateAttributes({ status: 'DONE' });
        } else if (sendingEmail.statusData === 'FAILED') {
          if (sendingEmail.tryCount === 0) {
            await sendingEmail.updateAttributes({ status: 'ERROR' });
          } else {
            await sendingEmail.updateAttributes({ status: 'RETRY' });
          }
        }
      }
    }
  };

  MessageSystem.processRetrySendingFailedEmail = async job => {
    const data = await MessageSystem.find({ where: { type: 'EMAIL', status: 'RETRY', tryCount: { gt: 0 } } });
    if (!isEmpty(data)) {
      const chunks = chunk(data, 20);
      for (const chunk of chunks) {
        const sentEmails = await MessageSystem.app.models.Client.sendEmail(chunk);
        for (const { sentEmail, originalMessage } of sentEmails) {
          const decreaseTryCount = originalMessage.tryCount - 1;
          const messageId = sentEmail.response.match(/queued as (.*)$/)[1];
          if (messageId) {
            if (sentEmail.accepted.length > 0 && sentEmail.rejected.length === 0) {
              await originalMessage.updateAttributes({
                status: 'SENDING',
                statusData: sentEmail,
                tryCount: decreaseTryCount,
                messageId,
              });
            } else {
              await originalMessage.updateAttributes({ statusData: sentEmail, messageId, tryCount: decreaseTryCount });
            }
          }
        }
      }
    }
  };

  // start notify app area
  MessageSystem.registerSendAppNotify = async (data, meta, options) => {
    // todo
  };

  MessageSystem.processMessage = async (job, done) => {
    // console.log('Start process msg');
    // email notify
    await MessageSystem.processNewlySentEmail(job);
    await MessageSystem.processStatusOfSentEmail(job);
    await MessageSystem.processRetrySendingFailedEmail(job);
    // test app notify
    await MessageSystem.processStatusSendAppNotify(job);
    // job.process(30);
    await MessageSystem.processNewSendAppNotify(job);
    // job.process(70);
    await MessageSystem.processRetrySendAppNotify(job);
    // job.process(99);
  };

  MessageSystem.processNewSendAppNotify = async job => {
    // todo
    // get all Message with type = 'NOTIFY_APP', status = 'NEW'
    // send notify
    // update status from NEW to SENDING
    const data = await MessageSystem.find({ where: { type: 'NOTIFY_APP', status: 'NEW' } });
    if (!isEmpty(data)) {
      // const role = MessageSystem.app.models.Role.find('ctm')
      const chunks = expo.chunkPushNotifications(data);
      // Send the chunks to the Expo push notification service. There are
      // different strategies you could use. A simple one is to send one chunk at a
      // time, which nicely spreads the load out over time:
      for (let chunk of chunks) {
        const expoMessages = chunk.map(mes => formatNotifyMessage(mes));
        const ticketChunk = await expo.sendPushNotificationsAsync(expoMessages);
        ticketChunk.forEach((ticket, index) => {
          const currentMessage = chunk[index];
          if (ticket.status === 'ok') {
            currentMessage.updateAttributes({ status: 'SENDING', statusData: ticket, sendTime: moment().toDate() });
          } else {
            currentMessage.updateAttributes({ status: 'RETRY', statusData: ticket });
          }
        });
      }
    }
  };

  MessageSystem.processStatusSendAppNotify = async job => {
    // todo
    // get all Message with type = 'NOTIFY_APP', status = 'SENDING'
    // update status to DONE,RETRY or ERROR
    const data = await MessageSystem.find({ where: { type: 'NOTIFY_APP', status: 'SENDING' } });
    if (!isEmpty(data)) {
      const chunks = expo.chunkPushNotificationReceiptIds(data);
      for (let chunk of chunks) {
        const receiptIds = chunk.map(message => message.statusData.id);
        const receipts = await expo.getPushNotificationReceiptsAsync(receiptIds);
        const receiptKeys = Object.keys(receipts);
        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        receiptKeys.forEach((key, index) => {
          const currentMessage = chunk[index];
          const currentReceipt = receipts[key];
          if (currentReceipt.status === 'ok') {
            currentMessage.updateAttributes({ status: 'DONE' }, { dataStatus: currentReceipt });
          } else if (currentReceipt.status === 'error') {
            // The error codes are listed in the Expo documentation:
            // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
            // You must handle the errors appropriately.
            if (currentReceipt.details && currentReceipt.details.error) {
              // Do not retry on unregistered devices, it will make APNs & FCM angry
              if (currentMessage.tryCount === 0 || currentReceipt.details.error === 'DeviceNotRegistered') {
                currentMessage.updateAttributes({ status: 'ERROR' }, { dataStatus: currentReceipt });
              } else {
                currentMessage.updateAttributes({ status: 'RETRY' }, { dataStatus: currentReceipt });
              }
            }
          }
        });
      }
    }
  };

  MessageSystem.processRetrySendAppNotify = async job => {
    // todo
    // get all Message with type = 'RETRY'
    // update retryCount
    // resend notify and update status to 'SENDING'
    const data = await MessageSystem.find({ where: { type: 'NOTIFY_APP', status: 'RETRY', tryCount: { gt: 0 } } });
    if (!isEmpty(data)) {
      const chunks = expo.chunkPushNotifications(data);
      for (let chunk of chunks) {
        const expoMessages = chunk.map(mes => formatNotifyMessage(mes));
        const ticketChunk = await expo.sendPushNotificationsAsync(expoMessages);
        ticketChunk.forEach((ticket, index) => {
          const currentMessage = chunk[index];
          const decreaseTryCount = currentMessage.tryCount - 1;
          if (ticket.status === 'ok') {
            currentMessage.updateAttributes({
              status: 'SENDING',
              statusData: ticket,
              tryCount: decreaseTryCount,
            });
          } else {
            currentMessage.updateAttributes({ statusData: ticket, tryCount: decreaseTryCount });
          }
        });
      }
    }
  };
  // end notify app area

  MessageSystem.createAppNotify = arrayAppNotify =>
    arrayAppNotify.forEach(({ data, meta, ...rest }) =>
      MessageSystem.create({
        data,
        meta,
        tryCount: 3,
        type: 'NOTIFY_APP',
        status: 'NEW',
        createdDate: moment().toDate(),
        clientReceived: false,
        ...rest,
      }),
    );

  // change MessageSystem format to expo push notification
  const formatNotifyMessage = MessageSystem => {
    const { data, meta } = MessageSystem;
    return {
      to: meta.to,
      body: data.text,
      data,
      sound: 'default',
      // ttl: 15,
      // id,
    };
  };

  const sendNewMessage = async job => {
    // 0 - 40%
  };
  const checkStatusSentMessage = async job => {
    // 40 - 70%
  };
  const retrySendMessage = async job => {};
};
