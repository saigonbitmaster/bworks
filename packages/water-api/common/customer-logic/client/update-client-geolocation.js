'use strict';
const getGeoLocation = require('../../logic/geo/import-geolocation');

module.exports = Client => {
  Client.updateClientGeoLocation = async (id, radius, cache) => {
    const clientInstance = await Client.findById(id);

    const clientFormattedAddress = clientInstance.formattedAddress;

    const clientRandomGeoLocation = await getGeoLocation(clientFormattedAddress, Client, radius, cache);

    if (clientRandomGeoLocation) {
      await clientInstance.updateAttribute('position', clientRandomGeoLocation);
    }
  };

  Client.remoteMethod('updateClientGeoLocation', {
    accepts: [
      { arg: 'id', type: 'string' },
      { arg: 'radius', type: 'number' },
      { arg: 'cache', type: 'object' },
    ],
  });
};
