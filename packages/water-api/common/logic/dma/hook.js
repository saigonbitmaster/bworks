'use strict';
const slug = require('slug');
module.exports = function(Dma) {
  Dma.fixData = async instance => {
    // re assign level
    instance.level = 1;
    if (instance.parentDmaId) {
      let parentDma = await Dma.findById(instance.parentDmaId);
      if (parentDma && parentDma.id) {
        instance.level = parentDma.level + 1;
      }
    }

    // generate slug
    instance.slug = slug(instance.name);

    // center point
    let center = instance.boundary.reduce((accumulator, currentValue) => {
      return { lat: accumulator.lat + currentValue.lat, lng: accumulator.lng + currentValue.lng };
    });
    center.lat /= instance.boundary.length;
    center.lng /= instance.boundary.length;
    instance.center = center;
  };

  Dma.observe('before save', function filterProperties(ctx, next) {
    Dma.fixData(ctx.instance).then(() => next());
  });
};
