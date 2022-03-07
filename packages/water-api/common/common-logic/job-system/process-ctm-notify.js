'use strict';
// const ObjectID = require('mongodb').ObjectID;
const { get } = require('lodash');

// const DEFAULT_MESSAGE = 'Nhắc nhở: Sắp tới đợt ghi thu hằng tháng.';

exports.default = JobSystem => {
  JobSystem.processCtmNotify = async job => {
    const payload = get(job, 'data.payload', { recipientFilter: {} });
    const { name, message, recipientFilter, target, description } = payload;
    let recipients = [];
    switch (target) {
      case 'client': {
        recipients = await JobSystem.app.models.Client.getClientByNotificationGroup(recipientFilter);
        break;
      }
      case 'ctm': {
        recipients = [];
        break;
      }
    }
    let metaData = [];
    recipients.forEach(client => {
      const { _id: recipientId, ClientUser = {} } = client || {};
      if (ClientUser.userDevices) {
        const { userDevices = [] } = ClientUser;
        const tokens = userDevices.map(device => ({ to: device.token, userId: recipientId }));
        metaData = metaData.concat(tokens);
      }
    });
    const monthlyMessage = metaData.map(({ to, userId }) => ({
      data: { text: message, name },
      meta: { to, description },
      userId,
    }));
    await JobSystem.app.models.MessageSystem.createAppNotify(monthlyMessage);
  };
};

exports.JobName = 'JobSystem.processCtmNotify';
