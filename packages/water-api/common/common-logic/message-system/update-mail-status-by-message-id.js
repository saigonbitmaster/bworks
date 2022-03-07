'use strict';

module.exports = MessageSystem => {
  MessageSystem.updateMailStatus = async (messageId, status) => {
    const message = await MessageSystem.findOne({ where: { messageId } });
    if (message) {
      await message.updateAttributes({ statusData: status });
    }
  };

  MessageSystem.remoteMethod('updateMailStatus', {
    accepts: [
      { arg: 'messageId', type: 'string', required: true },
      { arg: 'status', type: 'string', required: true },
    ],
    http: { verb: 'post' },
  });
};
