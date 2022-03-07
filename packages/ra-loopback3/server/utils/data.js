'use strict';
const _ = require('lodash');
const { ObjectId } = require('mongodb');

const dataUtil = {};
dataUtil.defaultOperationData = ({
  data,
  creatorId,
  updaterId,
  createdDate = new Date(),
  updatedDate = new Date(),
  app,
}) => {
  let result = _.clone(data);
  if (!creatorId) {
    creatorId = app.dataConfig.systemId;
  }
  if (!updaterId) {
    updaterId = app.dataConfig.systemId;
  }

  result.creatorId = typeof creatorId === 'string' ? ObjectId(creatorId) : creatorId;
  result.updaterId = typeof updaterId === 'string' ? ObjectId(updaterId) : updaterId;
  result.createdDate = createdDate;
  result.updatedDate = updatedDate;
  return result;
};

module.exports = dataUtil;
