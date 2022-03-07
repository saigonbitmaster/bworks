'use strict';
// const { isEquals } = require('lodash');

module.exports = function(Task) {
  Task.remoteMethod('updateStatus', {
    http: { verb: 'PATCH' },
    accepts: [
      { arg: 'id', type: 'string' },
      { arg: 'status', type: 'string' },
      { arg: 'finishDate', type: 'date' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { root: true, type: 'any' },
  });
  Task.remoteMethod('getAllEnum', {
    http: { verb: 'get' },
    accepts: [],
    returns: { root: true, type: 'any' },
  });
  Task.remoteMethod('attachFile', {
    http: { verb: 'post' },
    accepts: [
      { arg: 'id', type: 'string' },
      // { arg: 'field', type: 'string' },
      { arg: 'path', type: 'string' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { root: true, type: 'any' },
  });

  Task.updateStatus = async (id, status, finishDate, options) => {
    let statusEnum = Task.definition.properties.status.enum;
    let isValid = statusEnum.includes(status);
    let currentTask = await (isValid && Task.findById(id));
    const userId = options.accessToken.userId.toString();
    const requirement = {
      status: status,
      finishDate: null,
      updaterId: userId,
      updatedDate: new Date(),
    };
    status === 'finish' && finishDate && (requirement.finishDate = finishDate);
    if (currentTask) {
      currentTask.updateAttributes(requirement);
    }
    return;
  };
  Task.getAllEnum = async () => {
    let statusEnum = Task.definition.properties.status.enum;
    let typeEnum = Task.definition.properties.type.enum;
    let priorityEnum = Task.definition.properties.priority.enum;
    return { status: statusEnum, type: typeEnum, priority: priorityEnum };
  };
  Task.attachFile = async (id, path, options) => {
    let currentTask = await Task.findById(id);
    if (!currentTask) return;
    const { attachedFiles } = currentTask;
    attachedFiles.push(path);
    const userId = options.accessToken.userId.toString();
    const requirement = {
      attachedFiles: attachedFiles,
      finishDate: null,
      updaterId: userId,
      updatedDate: new Date(),
    };
    currentTask.updateAttributes(requirement);
    return;
  };
  Task.observe('before save', async ctx => {
    // Only save by user
    if (!ctx.isNewInstance) {
      let userId = (ctx.data && ctx.data.updaterId.toString()) || ctx.options.accessToken.userId.toString();
      let newData = ctx.data || ctx.instance['__data'];
      // Replace default system userId
      const system = {
        createdDate: new Date(),
        updatedDate: new Date(),
        updaterId: userId,
        creatorId: userId,
      };
      // get current Task
      let Taskhistory = Task.app.models.TaskHistory;
      let data = ctx.currentInstance || (await Task.findById(newData.id));
      if (!data.id) return `Couldn't find data`;
      data = data['__data'];
      let keys = Object.getOwnPropertyNames(newData);
      const activities = [];
      keys.map(field => {
        if (data[field] && newData[field] && data[field].toString() !== newData[field].toString()) {
          if (field !== 'updatedDate' && field !== 'createdDate') {
            let activity = { field: field, value: { old: data[field], new: newData[field] } };
            activities.push(activity);
          }
        }
      });
      if (Object.entries(activities).length > 0) {
        Taskhistory.create({ taskId: data['id'], activities, ...system });
      }
    }
    return;
  });
};
