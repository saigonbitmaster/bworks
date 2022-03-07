const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  /* 1 createdAt:11/5/2019, 3:33:15 PM*/
  {
    id: new ObjectId('5dc133cb26b94125e797e348'),
    name: 'Unnamed Road, Lê Lợi',
    position: {
      lng: 107.01045659277338,
      lat: 21.031837691158746,
    },
    elevation: 0,
    description: '',
  },

  /* 2 createdAt:10/14/2019, 9:46:29 AM*/
  {
    id: new ObjectId('5da3e1851bf6f21b823df57b'),
    name: 'UongBi, Điền Công',
    position: {
      lng: 106.7731700063016,
      lat: 20.98740145257472,
    },
    elevation: 0,
    description: '',
  },

  /* 3 createdAt:10/4/2019, 11:26:01 AM*/
  {
    id: new ObjectId('5d96c9d965b62a1bbbdab55a'),
    name: 'end Node',
    position: {
      lng: 105.98175643468369,
      lat: 20.666209877389072,
    },
    elevation: 0,
    description: '',
  },

  /* 4 createdAt:10/4/2019, 11:25:17 AM*/
  {
    id: new ObjectId('5d96c9ad65b62a1bbbdab559'),
    name: 'begin Node',
    position: {
      lng: 105.96098540807236,
      lat: 20.680263071767012,
    },
    elevation: 0,
    description: '',
  },

  /* 5 createdAt:10/3/2019, 3:45:03 PM*/
  {
    id: new ObjectId('5d95b50f782d7e67841ede73'),
    name: 'Unnamed Road, Phù Vân',
    position: {
      lng: 105.91291203364574,
      lat: 20.563263437502787,
    },
    elevation: 0,
    description: '',
  },

  /* 6 createdAt:10/3/2019, 3:34:45 PM*/
  {
    id: new ObjectId('5d95b2a5782d7e67841ede72'),
    name: 'Đường tỉnh 9717, Bắc Lý',
    position: {
      lng: 106.0893376625977,
      lat: 20.58750934162987,
    },
    elevation: 0,
    description: '',
  },

  /* 7 createdAt:10/3/2019, 3:34:33 PM*/
  {
    id: new ObjectId('5d95b299782d7e67841ede71'),
    name: 'Unnamed Road, Kim Bảng',
    position: {
      lng: 105.87304432763676,
      lat: 20.544114597605414,
    },
    elevation: 0,
    description: '',
  },

  /* 8 createdAt:7/18/2018, 5:57:42 PM*/
  {
    id: new ObjectId('5b4f1d266339ec2a4228ae30'),
    name: 'Duy Hải',
    position: {
      lng: 105.89753049079513,
      lat: 20.666203246082276,
    },
    elevation: 0,
    description: '',
  },

  /* 9 createdAt:7/18/2018, 5:54:40 PM*/
  {
    id: new ObjectId('5b4f1c706339ec2a4228ae2b'),
    name: 'Đê Sông Nhuệ, Nhật Tựu',
    position: {
      lng: 105.9016594954054,
      lat: 0.636646337199988,
    },
    elevation: 0,
    description: '',
  },

  /* 10 createdAt:7/18/2018, 5:54:28 PM*/
  {
    id: new ObjectId('5b4f1c646339ec2a4228ae2a'),
    name: 'Kim Bảng',
    position: {
      lng: 105.9056935377638,
      lat: 0.618813519200682,
    },
    elevation: 0,
    description: '',
  },

  /* 11 createdAt:7/18/2018, 5:54:15 PM*/
  {
    id: new ObjectId('5b4f1c576339ec2a4228ae29'),
    name: 'tt. Đồng Văn',
    position: {
      lng: 105.92337465958997,
      lat: 0.639056017200957,
    },
    elevation: 0,
    description: '',
  },

  /* 12 createdAt:7/18/2018, 5:54:04 PM*/
  {
    id: new ObjectId('5b4f1c4c6339ec2a4228ae28'),
    name: 'Duy Tiên',
    position: {
      lng: 105.93056297974988,
      lat: 0.616142433033374,
    },
    elevation: 0,
    description: '',
  },

  /* 13 createdAt:7/18/2018, 5:44:50 PM*/
  {
    id: new ObjectId('5b4f1a226339ec2a4228ae26'),
    name: 'Khu Công nghiệp Đồng Văn',
    position: {
      lng: 105.92227935791016,
      lat: 0.66105614283098,
    },
    elevation: 0,
    description: '',
  },

  /* 14 createdAt:7/18/2018, 5:42:03 PM*/
  {
    id: new ObjectId('5b4f197b6339ec2a4228ae23'),
    name: 'QL1A, Duy Minh, Duy Tiên',
    position: {
      lng: 105.91827710046391,
      lat: 0.670407169064056,
    },
    elevation: 0,
    description: '',
  },

  /* 15 createdAt:7/18/2018, 3:37:50 PM*/
  {
    id: new ObjectId('5b4efc5e6339ec2a4228ae01'),
    name: 'QL1A, Duy Minh, Duy Tiên',
    position: {
      lng: 105.91401911454602,
      lat: 0.66925410146523,
    },
    elevation: 0,
    description: '',
  },

  /* 16 createdAt:7/18/2018, 3:37:44 PM*/
  {
    id: new ObjectId('5b4efc586339ec2a4228ae00'),
    name: 'ĐCT Cầu Giẽ - Ninh Bình',
    position: {
      lng: 105.9340354071478,
      lat: 0.677068489860723,
    },
    elevation: 0,
    description: '',
  },

  /* 17 createdAt:7/18/2018, 3:35:55 PM*/
  {
    id: new ObjectId('5b4efbeb6339ec2a4228adfd'),
    name: 'ĐCT Cầu Giẽ - Ninh Bình',
    position: {
      lng: 105.94328737931653,
      lat: 0.6179298567822,
    },
    elevation: 0,
    description: '',
  },

  /* 18 createdAt:7/18/2018, 3:35:46 PM*/
  {
    id: new ObjectId('5b4efbe26339ec2a4228adfc'),
    name: 'QL1A, Hoàng Đông, Duy Tiên',
    position: {
      lng: 105.92285708151462,
      lat: 0.61295974014286,
    },
    elevation: 0,
    description: '',
  },

  /* 19 createdAt:7/18/2018, 3:13:14 PM*/
  {
    id: new ObjectId('5b4ef69a6339ec2a4228adee'),
    name: 'QL1A, Duy Minh, Duy Tiên',
    position: {
      lng: 105.91607615887199,
      lat: 0.660349583945873,
    },
    elevation: 0,
    description: '',
  },

  /* 20 createdAt:7/18/2018, 3:13:06 PM*/
  {
    id: new ObjectId('5b4ef6926339ec2a4228aded'),
    name: 'QL1A, Duy Tiên, Hà Nam',
    position: {
      lng: 105.91636226809533,
      lat: 0.6446844704485,
    },
    elevation: 0,
    description: '',
  },

  /* 21 createdAt:7/18/2018, 3:12:48 PM*/
  {
    id: new ObjectId('5b4ef6806339ec2a4228adec'),
    name: 'Unnamed Road, Duy Tiên',
    position: {
      lng: 105.91374560853956,
      lat: 0.660308688342628,
    },
    elevation: 0,
    description: '',
  },

  /* 22 createdAt:7/18/2018, 3:12:37 PM*/
  {
    id: new ObjectId('5b4ef6756339ec2a4228adeb'),
    name: 'QL38, Duy Minh, Duy Tiên',
    position: {
      lng: 105.91367511792669,
      lat: 0.64455607605854,
    },
    elevation: 0,
    description: '',
  },

  /* 23 createdAt:7/18/2018, 3:12:25 PM*/
  {
    id: new ObjectId('5b4ef6696339ec2a4228adea'),
    name: 'ĐCT Cầu Giẽ - Ninh Bình',
    position: {
      lng: 105.93520565445192,
      lat: 0.660126868759875,
    },
    elevation: 0,
    description: '',
  },

  /* 24 createdAt:7/18/2018, 3:12:09 PM*/
  {
    id: new ObjectId('5b4ef6596339ec2a4228ade9'),
    name: 'ĐCT Cầu Giẽ - Ninh Bình & ĐCT01',
    position: {
      lng: 105.93696280977247,
      lat: 0.64807083702256,
    },
    elevation: 0,
    description: '',
  },

  /* 25 createdAt:7/18/2018, 3:11:36 PM*/
  {
    id: new ObjectId('5b4ef6386339ec2a4228ade8'),
    name: 'ĐCT Cầu Giẽ - Ninh Bình',
    position: {
      lng: 105.93278248681645,
      lat: 0.659967099921115,
    },
    elevation: 0,
    description: '',
  },

  /* 26 createdAt:7/18/2018, 3:11:23 PM*/
  {
    id: new ObjectId('5b4ef62b6339ec2a4228ade7'),
    name: '259 Nguyễn Hữu Tiến, Đồng Văn',
    position: {
      lng: 105.93449910058598,
      lat: 0.64751838764515,
    },
    elevation: 0,
    description: '',
  },

  /* 27 createdAt:7/18/2018, 3:11:01 PM*/
  {
    id: new ObjectId('5b4ef6156339ec2a4228ade6'),
    name: '94 Phạm Ngọc Nhị, Đồng Văn',
    position: {
      lng: 105.9150155343018,
      lat: 0.640289635315934,
    },
    elevation: 0,
    description: '',
  },

  /* 28 createdAt:7/18/2018, 3:10:52 PM*/
  {
    id: new ObjectId('5b4ef60c6339ec2a4228ade5'),
    name: 'QL38, Duy Tiên, Hà Nam',
    position: {
      lng: 105.9367847442627,
      lat: 0.644471138712216,
    },
    elevation: 0,
    description: '',
  },

  /* 29 createdAt:7/18/2018, 3:10:12 PM*/
  {
    id: new ObjectId('5b4ef5e46339ec2a4228ade4'),
    name: 'QL38, tt. Đồng Văn, Duy Tiên',
    position: {
      lng: 105.91634720696652,
      lat: 0.642455111065388,
    },
    elevation: 0,
    description: '',
  },

  /* 30 createdAt:7/18/2018, 3:09:41 PM*/
  {
    id: new ObjectId('5b4ef5c56339ec2a4228ade3'),
    name: 'QL38, Duy Tiên, Hà Nam',
    position: {
      lng: 105.93763192071538,
      lat: 0.646514414814067,
    },
    elevation: 0,
    description: '',
  },
];
module.exports = {
  init: async app => {
    let model = app.models.Node;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init nms Node error', err) : console.log('init nms Node OK!')), // eslint-disable-line no-console
    );
  },
};
