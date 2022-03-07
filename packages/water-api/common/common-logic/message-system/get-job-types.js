'use trict';
module.exports = MessageSystem => {
  MessageSystem.getJobTypes = () =>
    MessageSystem.app.get('messageTypes') || ['EMAIL', 'NOTIFY_APP', 'SMS', 'ZALO', 'FACEBOOK', 'SKYPE', 'TELEGRAM'];
};
