const ObjectID = require('mongodb').ObjectID
//define data to be insert to a model, which model name in index file.
//the id is mongoDB _id it can be ObjectID string or ObjectID('string)
module.exports = [
  {
    id: '313131313131313131313132',
    data: 'data01'
  },
  {
    id: ObjectID('111111111111'),
    data: 'data02'
  },
];