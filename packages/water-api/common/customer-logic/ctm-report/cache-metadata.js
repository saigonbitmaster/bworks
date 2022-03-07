const difference = require('lodash/difference');

module.exports = CtmReport => {
  CtmReport.cacheMetadata = async (metadataId = '', metadata) => {
    if (metadataId === '') {
      const createdMetadataId = await CtmReport.create(metadata).then(createdMetadata => createdMetadata.id.toString());
      return createdMetadataId;
    } else {
      const retrievedMetadata = await CtmReport.findById(metadataId);
      if (retrievedMetadata) {
        // Get keys that persisted metadata doesn't have but metadata has
        const newKeys = difference(Object.keys(metadata), Object.keys(retrievedMetadata));
        for (let key of newKeys) {
          retrievedMetadata[key] = metadata[key];
        }
        // Save
        await retrievedMetadata.save();
        return metadataId;
      }
    }
  };
};
