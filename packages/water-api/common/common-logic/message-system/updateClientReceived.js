'use trict';
module.exports = MessageSystem => {
  MessageSystem.updateClientReceived = async options => {
    try {
      if (options.accessToken) {
        const user = await options.accessToken.user.get();
        await MessageSystem.updateAll(
          { userId: user.id, clientReceived: false },
          { clientReceived: true },
          (error, info) => {
            return { info };
          },
        );
      }
    } catch (e) {
      throw e;
    }
  };

  MessageSystem.remoteMethod('updateClientReceived', {
    accepts: [{ arg: 'options', type: 'object', http: 'optionsFromRequest' }],
    http: { verb: 'get' },
    returns: { arg: 'res', type: 'object' },
  });
};
