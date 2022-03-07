module.exports = function(Gadm) {
  Gadm.offlineDownload = async (wardId, quarterId) => {
    let data = null;
    if (quarterId) {
      const quarter = await Gadm.app.models.GeoQuarter.findById(quarterId);
      const ward = await Gadm.app.models.GeoWard.findById(quarter.wardId);
      data = await Gadm.findById(ward.gadmId);
    } else if (wardId) {
      const ward = await Gadm.app.models.GeoWard.findById(wardId);
      data = await Gadm.findById(ward.gadmId);
    }

    return data;
  };

  Gadm.remoteMethod('offlineDownload', {
    accepts: [
      { arg: 'wardId', type: 'string', required: true },
      { arg: 'quarterId', type: 'string' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
