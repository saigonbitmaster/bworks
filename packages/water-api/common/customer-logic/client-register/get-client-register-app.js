const ObjectID = require('mongodb').ObjectID;
const { get, set } = require('lodash');
const aggregate = require('../../utils/aggregate');

module.exports = ClientRegister => {
  ClientRegister.getClientRegisterApp = async (filter, res, options) => {
    let termData = [];
    const filterQuery = filter.where ? { ...filter.where, ...filter } : filter;
    if (options.accessToken) {
      let user = await options.accessToken.user.get();
      const { wardInChargeIds: tempWICIArray = [], quarterInChargeIds: tempQICIArray = [] } = user;
      const wardInChargeIds = tempWICIArray.map(wardId => new ObjectID(wardId));
      const quarterInChargeIds = tempQICIArray.map(quarterId => new ObjectID(quarterId));
      if (wardInChargeIds && wardInChargeIds.length) {
        let query = await buildQuery(filterQuery, wardInChargeIds);
        if (quarterInChargeIds && quarterInChargeIds.length > 0) {
          query = await buildQuery(filterQuery, wardInChargeIds, quarterInChargeIds);
        }
        termData = await aggregate(ClientRegister, query);
      }
    }
    const { type } = filterQuery;
    switch (type) {
      case 'list': {
        const { data = [], info = [] } = termData[0] || {};
        res.header('Content-Range', data.length ? get(info, '[0].total', 0) : data.length);
        return data;
      }
      case 'map': {
        return termData;
      }
    }
  };

  const buildQuery = async (filter, wardInChargeIds, quarterInChargeIds) => {
    const { position, districtId, wardId, quarterId, $text, skip, limit, type } = filter;
    // <----------------Khai báo object filter xài chung--------------->
    const filterQuery = {
      wardId: { $in: wardInChargeIds },
      status: 'NEW',
    };
    if (quarterInChargeIds) {
      set(filterQuery, 'quarterId', { $in: quarterInChargeIds });
    }
    if ($text) set(filterQuery, '$text', { $search: $text.$search || $text.search, $language: 'fr' });
    if (districtId && typeof districtId === 'string') set(filterQuery, 'districtId', new ObjectID(districtId));
    if (wardId && typeof wardId === 'string') set(filterQuery, 'wardId', new ObjectID(wardId));
    if (quarterId && typeof quarterId === 'string') set(filterQuery, 'quarterId', new ObjectID(quarterId));
    //<------------------Khai báo mongodb aggregate xài chung--------------------------->
    let query = [];
    switch (type) {
      case 'list': {
        query = [
          {
            $match: filterQuery,
          },
          {
            $facet: {
              info: [{ $count: 'total' }],
              data: [
                { $skip: skip },
                { $limit: limit },
                {
                  $project: {
                    id: '$_id',
                    code: 1,
                    name: 1,
                    formattedAddress: 1,
                    statusSurvey: 1,
                    resultSurvey: 1,
                  },
                },
              ],
            },
          },
        ];
        break;
      }
      case 'map': {
        const { coordinates, maxDistance } = position;
        const { $text, ...geoQuery } = filterQuery; // $text doesn't working with $geoNear
        query = [
          {
            $geoNear: {
              near: {
                type: 'Point',
                coordinates,
              },
              includeLocs: 'position',
              distanceField: 'distanceToCurrentPosition',
              maxDistance,
              query: geoQuery,
              limit: limit || 1000,
            },
          },
          {
            $project: {
              id: '$_id',
              position: 1,
              name: 1,
              formattedAddress: 1,
              statusSurvey: 1,
              resultSurvey: 1,
            },
          },
        ];
        break;
      }
    }
    // console.log(JSON.stringify(query));
    return query;
  };
  ClientRegister.remoteMethod('getClientRegisterApp', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
