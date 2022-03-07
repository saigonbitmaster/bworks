'use strict';
const moment = require('moment-timezone');
const ObjectID = require('mongodb').ObjectID;
const get = require('lodash/get');

const DEFAULT_MESSAGE = 'Bạn có 1 báo cáo mới';

exports.default = JobSystem => {
  JobSystem.processCtmEmail = async job => {
    const payload = get(job, 'data.payload', {});
    const { role = [], text = DEFAULT_MESSAGE } = payload;
    const roles = await JobSystem.app.models.Role.find({ where: { name: { inq: role } }, fields: { id: true } });
    const userIds = await JobSystem.app.models.RoleMapping.find({
      where: { roleId: { inq: roles.map(role => role.id) } },
      fields: { principalId: true },
    });
    const userData = await JobSystem.app.models.AppUser.find({
      where: { _id: { inq: userIds.map(user => new ObjectID(user.principalId)) } },
      fields: { email: true, id: true },
    });

    const metaData = userData.reduce((acc, { email, id }) => {
      if (email) {
        acc.push({ to: email, userId: id });
        return acc;
      }
    }, []);

    const monthlyEmail = metaData.map(({ to, userId }) => ({
      data: { text },
      meta: { to },
      userId,
    }));

    await Promise.all(
      monthlyEmail.map(
        async ({ data, meta, userId }) =>
          await JobSystem.app.models.MessageSystem.create({
            data,
            meta,
            tryCount: 1,
            type: 'EMAIL',
            status: 'NEW',
            createdDate: moment().toDate(),
            userId,
          }),
      ),
    );
  };
};

exports.JobName = 'JobSystem.processCtmEmail';
