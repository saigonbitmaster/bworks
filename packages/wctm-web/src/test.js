// db.Client.aggregate([
//   {
//     $match: {
//       wardId: {
//         $in: [
//           {
//             mgfunc: 'ObjectId',
//             params: ['5bb58a54d1c950171e3c8957'],
//           },
//         ],
//       },
//       termMeterNumber: {
//         $lte: ISODate('2018-11-01T07:00:00.000+07:00'),
//         $gte: ISODate('2018-10-01T07:00:00.000+07:00'),
//       },
//     },
//   },
//   {
//     $project: {
//       clientId: 1,
//     },
//   },
//   {
//     $lookup: {
//       from: 'ClientMeterNumber',
//       let: {
//         clientId: '$_id',
//       },
//       pipeline: [
//         {
//           $match: {
//             $expr: {
//               $and: [
//                 {
//                   $eq: ['$clientId', '$$clientId'],
//                 },
//                 {
//                   $lte: [
//                     '$toDate',
//                     {
//                       mgfunc: 'ISODate',
//                       params: ['2018-12-01T07:00:00.000+07:00'],
//                     },
//                   ],
//                 },
//                 {
//                   $gte: [
//                     '$toDate',
//                     {
//                       mgfunc: 'ISODate',
//                       params: ['2018-10-01T07:00:00.000+07:00'],
//                     },
//                   ],
//                 },
//               ],
//             },
//           },
//         },
//         {
//           $project: {
//             previousNumber: 1,
//             currentNumber: 1,
//             fromDate: 1,
//             toDate: 1,
//           },
//         },
//         {
//           $sort: {
//             toDate: -1,
//           },
//         },
//         {
//           $limit: 1,
//         },
//       ],
//       as: 'clientMeterNumbers',
//     },
//   },
//   {
//     $sort: {
//       _id: 1,
//     },
//   },
//   {
//     $facet: {
//       info: [
//         {
//           $count: 'total',
//         },
//       ],
//       data: [
//         {
//           $skip: 0,
//         },
//         {
//           $limit: 10,
//         },
//       ],
//     },
//   },
// ]);
