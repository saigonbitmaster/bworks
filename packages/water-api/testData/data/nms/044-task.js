const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  /* 1 createdAt:10/14/2019, 12:00:20 PM*/
  {
    id: new ObjectId('5da400e41bf6f21b823dfb69'),
    name: 'Thống kê thất thu giá ',
    status: 'finish',
    type: 'other',
    priority: 'normal',
    startDate: new Date('2019-10-14T12:00:20'),
    dueDate: new Date('2019-10-24T00:00:00'),
    estimateTime: 10,
    description: '',
    projectKey: 'nms',
    assigneeId: new ObjectId('5d64f225429b7f4b0c690db1'),
  },

  /* 2 createdAt:10/14/2019, 11:53:50 AM*/
  {
    id: new ObjectId('5da3ff5e1bf6f21b823dfb20'),
    name: 'Đào tạo quản lý áp lực mạng',
    status: 'doing',
    type: 'technical',
    priority: 'high',
    startDate: new Date('2019-10-14T11:53:50'),
    dueDate: new Date('2019-10-17T00:00:00'),
    estimateTime: 3,
    description: '',
    projectKey: 'nms',
    assigneeId: new ObjectId('5d64f291429b7f4b0c690db4'),
  },

  /* 3 createdAt:10/14/2019, 11:51:45 AM*/
  {
    id: new ObjectId('5da3fee11bf6f21b823dfb0c'),
    name: 'Đào tạo vận hành nhà máy',
    status: 'todo',
    type: 'technical',
    priority: 'normal',
    startDate: new Date('2019-10-14T11:51:45'),
    dueDate: new Date('2019-10-16T00:00:00'),
    estimateTime: 2,
    description: '',
    projectKey: 'nms',
    assigneeId: new ObjectId('5d64f225429b7f4b0c690db1'),
  },

  /* 4 createdAt:10/14/2019, 11:48:52 AM*/
  {
    id: new ObjectId('5da3fe341bf6f21b823dfafd'),
    name: 'Nhận diện rò rỉ đường trục cấp II',
    status: 'finish',
    type: 'technical',
    priority: 'normal',
    startDate: new Date('2019-10-14T11:48:52'),
    dueDate: new Date('2019-10-28T00:00:00'),
    estimateTime: 14,
    description: '',
    projectKey: 'nms',
    assigneeId: new ObjectId('5d64f225429b7f4b0c690db1'),
  },

  /* 5 createdAt:10/14/2019, 11:46:15 AM*/
  {
    id: new ObjectId('5da3fd971bf6f21b823dfaec'),
    name: 'Tối ưu hoá chất nhà máy Diễn Vọng',
    status: 'doing',
    type: 'technical',
    priority: 'high',
    startDate: new Date('2019-10-14T11:46:15'),
    dueDate: new Date('2019-10-29T00:00:00'),
    estimateTime: 15,
    description: '',
    projectKey: 'nms',
    assigneeId: new ObjectId('5c32b0af3617c932c01c3085'),
  },

  /* 6 createdAt:10/14/2019, 11:44:22 AM*/
  {
    id: new ObjectId('5da3fd261bf6f21b823dfadd'),
    name: 'Tối ưu điện năng nhà máy Diễn Vọng',
    status: 'todo',
    type: 'technical',
    priority: 'high',
    startDate: new Date('2019-10-14T11:44:22'),
    dueDate: new Date('2019-10-24T00:00:00'),
    estimateTime: 10,
    description: '',
    projectKey: 'nms',
    assigneeId: new ObjectId('5d64f225429b7f4b0c690db1'),
  },

  /* 7 createdAt:10/14/2019, 11:38:17 AM*/
  {
    id: new ObjectId('5da3fbb91bf6f21b823dfa9f'),
    name: 'Thống kê vật tư quá hạn',
    status: 'finish',
    type: 'technical',
    priority: 'high',
    startDate: new Date('2019-10-14T11:38:17'),
    dueDate: new Date('2019-10-30T00:00:00'),
    estimateTime: 16,
    description: '',
    projectKey: 'nms',
    assigneeId: new ObjectId('1a1a1a1a1a1a1a1a1a1a1a1b'),
  },

  /* 8 createdAt:10/14/2019, 11:32:41 AM*/
  {
    id: new ObjectId('5da3fa691bf6f21b823dfa59'),
    name: 'Mở rộng đường ống TX Quảng Yên',
    status: 'todo',
    type: 'technical',
    priority: 'high',
    startDate: new Date('2019-10-14T11:32:41'),
    dueDate: new Date('2019-11-30T00:00:00'),
    estimateTime: 47,
    description: '',
    projectKey: 'nms',
    assigneeId: new ObjectId('5d64f291429b7f4b0c690db4'),
  },

  /* 9 createdAt:10/3/2019, 4:20:22 PM*/
  {
    id: new ObjectId('5d95bd56498510111b7387bf'),
    name: 'Giảm tỷ lệ thất thoát TX Cẩm Phả',
    status: 'doing',
    type: 'technical',
    priority: 'normal',
    startDate: new Date('2019-10-03T16:20:22'),
    dueDate: new Date('2019-10-04T00:00:00'),
    finishDate: null,
    estimateTime: 1,
    description: '',
    projectKey: 'nms',
    assigneeId: new ObjectId('5d64f291429b7f4b0c690db4'),
  },

  /* 10 createdAt:9/12/2019, 11:45:00 AM*/
  {
    id: new ObjectId('5d79cd4cbe6fd734dab35055'),
    name: '123f1',
    status: 'doing',
    type: 'technical',
    priority: 'normal',
    startDate: new Date('2019-09-13T00:00:00'),
    dueDate: new Date('2019-09-21T00:00:00'),
    estimateTime: 8,
    description: '',
    projectKey: 'ctm',
    assigneeId: new ObjectId('1a1a1a1a1a1a1a1a1a1a1a1c'),
  },

  /* 11 createdAt:9/12/2019, 11:25:06 AM*/
  {
    id: new ObjectId('5d79c8a2be6fd734dab35052'),
    name: 'asdf',
    status: 'doing',
    type: 'other',
    priority: 'normal',
    startDate: new Date('2019-09-12T11:25:06'),
    estimateTime: 16,
    description: '',
    projectKey: 'ctm',
    assigneeId: new ObjectId('5c32b0af3617c932c01c3085'),
  },

  /* 12 createdAt:9/12/2019, 10:44:49 AM*/
  {
    id: new ObjectId('5d79bf31be6fd734dab35042'),
    name: '123',
    status: 'doing',
    type: 'other',
    priority: 'normal',
    startDate: new Date('2019-09-12T10:44:37'),
    dueDate: new Date('2019-09-20T00:00:00'),
    estimateTime: 8,
    description: '',
    projectKey: 'ctm',
    assigneeId: new ObjectId('1a1a1a1a1a1a1a1a1a1a1a1c'),
  },

  /* 13 createdAt:9/11/2019, 5:03:08 PM*/
  {
    id: new ObjectId('5d78c65c05620d64273b241b'),
    name: 'Thi công Thay đồng hồ khách hàng HCM....',
    status: 'todo',
    type: 'technical',
    priority: 'normal',
    startDate: new Date('2019-09-01T07:00:00'),
    dueDate: new Date('2019-09-11T17:01:41'),
    finishDate: null,
    estimateTime: 0,
    description: '',
    projectKey: 'ctm',
    assigneeId: new ObjectId('1a1a1a1a1a1a1a1a1a1a1a1c'),
  },
];
module.exports = {
  init: async app => {
    let model = app.models.Task;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.create(record);
        return true;
      },
      err => (err ? console.error('init nms Task error', err) : console.log('init nms Task OK!')), // eslint-disable-line no-console
    );
  },
};
