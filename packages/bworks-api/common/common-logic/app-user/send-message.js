'use strict';

module.exports = AppUser => {
  /**
   * Send message to user
   * type: 'all', 'email', ...
   * data: { title, body, options }
   */
  AppUser.sendMessage = async (type, data) => {
    const MessageSystem = AppUser.app.models.MessageSystem;
    if (type === 'ALL') {
      const to = 'toannt@Bworks.online'; // testing
      MessageSystem.requestSendmail('mail', { ...data, to });
    }
  };
};
