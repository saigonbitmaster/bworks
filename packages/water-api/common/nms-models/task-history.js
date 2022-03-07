'use strict';

module.exports = function(Taskhistory) {
  Taskhistory.updateComment = async (id, description, options) => {
    let currentData = await Taskhistory.findById(id);
    const userId = options.accessToken.userId.toString();
    if (!currentData) {
      throw new Error('Task is not exist');
    }
    if (currentData.creatorId.toString() !== userId) {
      throw new Error('Access denied');
    }
    const requirement = {
      description,
      updatedDate: new Date(),
      updaterId: userId,
    };
    await currentData.updateAttributes(requirement);
    return;
  };
  Taskhistory.remoteMethod('updateComment', {
    accepts: [
      { arg: 'id', type: 'string' },
      { arg: 'description', type: 'string' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { root: true, type: 'any' },
  });
};
