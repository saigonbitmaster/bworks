'use strict';
const delay = require('delay');
const { ObjectId } = require('mongodb');
const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
module.exports = function(Conversation) {
  Conversation.genData = async () => {
    await delay(Math.ceil(Math.random() * 5000));
    if (Math.random()) return;
    // get random client
    let rd = Math.floor(Math.random() * 1000);
    let clientId = undefined;
    if (rd < 1000) {
      const client = await Conversation.app.models.Client.findOne({ where: { status: 'ACTIVE' }, skip: rd });
      if (client) {
        clientId = client.id;
      }
    }
    let dataRecord = {
      type: 'PHONE',
      status: 'INPROGRESS',
      data: {
        phoneNumber: '090912' + (rd + 1000).toString(),
      },
      startTime: new Date(),
      supporterId: new ObjectId('1a1a1a1a1a1a1a1a1a1a1a1b'),
      clientId,
    };
    const record = await Conversation.create(dataRecord);
    console.log(JSON.stringify(dataRecord));
    const duration = Math.max(10, rd * 30);
    await delay(duration);
    record.duration = _.round(duration / 1000);
    record.endTime = new Date();
    record.status = 'FINISHED';
    await record.save();
    console.log(JSON.stringify(record.__data));
  };
  if (process.env.NODE_CONVERSATION_TEST) {
    setInterval(Conversation.genData, 40000);
  }
  // Conversation.finish = async data => {};
};
