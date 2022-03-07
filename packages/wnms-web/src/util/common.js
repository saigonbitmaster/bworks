const common = {
  getUnitByMatType: type => {
    let unit = '';
    if (!type) {
      return unit;
    }
    if (type === 'Pipe') {
      unit = 'generic.units.meter';
    } else {
      unit = 'generic.units.quantity';
    }
    return unit;
  },
};

module.exports = common;
