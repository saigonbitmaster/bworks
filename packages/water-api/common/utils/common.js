let utilCommon = {};
const _ = require('lodash');
const moment = require('moment-timezone');
const ObjectID = require('mongodb').ObjectID;

utilCommon.getIdUnique = function(data, field = 'id', isObjectId = true) {
  let temp = [];
  for (let i = 0; i < data.length; i++) {
    let flg = utilCommon.checkExistId(temp, data[i], field, isObjectId);
    if (!flg && data[i][field]) {
      temp.push(data[i][field]);
    }
  }
  return temp;
};
utilCommon.checkExistId = function(data, key, field = 'id', isObjectId) {
  for (let i = 0; i < data.length; i++) {
    if (isObjectId) {
      if (data[i] && key[field] && data[i].equals(key[field])) {
        return true;
      }
    } else {
      if (data[i] && key[field] && data[i] === key[field]) {
        return true;
      }
    }
  }
  return false;
};

// lay data duy nhat
utilCommon.getDataUnique = function(data, field) {
  let temp = [];
  for (let i = 0; i < data.length; i++) {
    let flg = utilCommon.checkExistData(temp, data[i], field);
    if (!flg && data[i][field]) {
      temp.push(data[i][field]);
    }
  }
  return temp;
};
utilCommon.checkExistData = function(data, key, field) {
  for (let i = 0; i < data.length; i++) {
    if (data[i] && key[field] && data[i] === key[field]) {
      return true;
    }
  }
  return false;
};

utilCommon.dmaHierarchy = function(currentDma, dmas, fullDma) {
  let result = [{ id: currentDma.id }];
  // get sub
  if (dmas.length > 0) {
    dmas.map(item => {
      let subHierarchy = utilCommon.getSubDmaHierarchy(item, fullDma);
      subHierarchy.map(subItem => {
        result.push({ id: subItem.id });
      });
    });
  }
  return result;
};

utilCommon.getSubDmaHierarchy = function(dataDmaSelect, dataDmas) {
  return utilCommon.dmaHierarchy(
    dataDmaSelect,
    dataDmas.filter(
      d => d.level === dataDmaSelect.level + 1 && d.parentDmaId && d.parentDmaId.equals(dataDmaSelect.id),
    ),
    dataDmas,
  );
};

// create by Mr.Hau
// get all child DMA id
// return : parent dma id and child dma id
utilCommon.getAllChildDmaId = function(dataDmas, dataDmaSelect) {
  let result = [];
  let subHierarchy = utilCommon.getSubDmaHierarchy(dataDmaSelect, dataDmas);
  subHierarchy.map(subItemId => {
    result.push(subItemId.id); // get only id
  });
  return result;
};

// create by Mr.Hau
// get all child level
utilCommon.getAllChildLevel = function(maxLevel, levelCurrent) {
  let result = [];
  for (let i = levelCurrent; i <= maxLevel; i++) {
    result.push(i);
  }
  return result;
};

// phan trang
utilCommon.splitPage = function(data, limit, skip) {
  let page = skip / limit + 1;
  let perPage = limit;
  return data.slice((page - 1) * perPage, page * perPage);
};

// sort
utilCommon.sort = function(data, order) {
  let fieldSort = '';
  let typeSort = '';
  if (order.length === 1) {
    let tmp = order[0].split(' ');
    if (tmp.length === 2) {
      fieldSort = tmp[0];
      typeSort = tmp[1];
    }
  }
  if (!fieldSort || !typeSort) {
    return data;
  }
  let tmp = [];
  if (typeSort === 'ASC') {
    tmp = _.sortBy(data, [fieldSort]);
  } else if (typeSort === 'DESC') {
    tmp = _.sortBy(data, [fieldSort]).reverse();
  }
  return tmp;
};

utilCommon.sortFieldSpec = function(data, withFields, order) {
  let fieldSort = '';
  let typeSort = '';
  if (!order) {
    return data;
  }
  if (order.length === 1) {
    let tmp = order[0].split(' ');
    if (tmp.length === 2) {
      fieldSort = tmp[0];
      typeSort = tmp[1];
    }
  }
  if (!fieldSort || !typeSort || !_.includes(withFields, fieldSort)) {
    return data;
  }
  let tmp = [];
  if (typeSort === 'ASC') {
    tmp = _.sortBy(data, [fieldSort]);
  } else if (typeSort === 'DESC') {
    tmp = _.sortBy(data, [fieldSort]).reverse();
  }
  return tmp;
};

// lay cac Dma theo :
// + dma selected
// + bao gom dma con
// + toan mang
utilCommon.getDmaIds = async function(model, dmaIdSelect, flgIncludeChild, flgAllDma) {
  let cdt = {};
  cdt.fields = { id: true };
  let dataDmas = [];
  if (flgAllDma) {
    dataDmas = await model.app.models.Dma.find(cdt);
    let tmp = [];
    for (let i = 0; i < dataDmas.length; i++) {
      tmp.push(dataDmas[i].id);
    }
    return tmp;
  } else {
    if (flgIncludeChild) {
      cdt.fields = { id: true, level: true, parentDmaId: true };
      dataDmas = await model.app.models.Dma.find(cdt);
      let dataDmaSelect = await model.app.models.Dma.findById(dmaIdSelect, cdt);
      if (!dmaIdSelect || !dataDmas || !dataDmas.length) {
        return dataDmas;
      }
      return utilCommon.getAllChildDmaId(dataDmas, dataDmaSelect);
    } else {
      dataDmas.push(dmaIdSelect);
      return dataDmas;
    }
  }
};
utilCommon.compareMonth = function(src, dst) {
  if (!src || !dst) {
    return '';
  }
  let srcYear = moment(src).year();
  let dstYear = moment(dst).year();
  let srcMonth = moment(src).month() + 1;
  let dstMonth = moment(dst).month() + 1;
  if (srcYear < dstYear) {
    return -1;
  } else if (srcYear > dstYear) {
    return 1;
  } else if (srcMonth < dstMonth) {
    return -1;
  } else if (srcMonth > dstMonth) {
    return 1;
  } else return 0;
};
utilCommon.checkConditionGeo = function(provinceId, districtId, wardId, quarterId) {
  if (quarterId && (!provinceId || !districtId || !wardId)) {
    return false;
  }
  if (wardId && (!provinceId || !districtId || !wardId)) {
    return false;
  }
};

// sort, phan trang, get group
utilCommon.filterData = function(filter, data, res) {
  const { limit = 25, skip = 0, order } = filter;
  if (!data.length) {
    if (res) res.header('content-range', 0);
    return [];
  }
  // phan trang
  let dataTmp = utilCommon.splitPage(data, limit, skip);

  // sort
  let sortedData = dataTmp;
  if (order) {
    sortedData = utilCommon.sort(dataTmp, order);
  }
  if (res) res.header('content-range', data.length);
  return sortedData;
};

// dem so ngay trong thang/nam
// input: time : moment
utilCommon.countDays = function(time, type = 'month') {
  let res = 1;
  if (type === 'month') {
    res = time.daysInMonth();
  } else if (type === 'year') {
    res = 365;
    let year = parseInt(time.format('YYYY'));
    if (year % 4 === 0 || year % 400 === 0) {
      res = 366;
    }
  }
  return res;
};
utilCommon.getAgrFilter = function(filter) {
  let res = {};
  const { limit, skip, order } = filter;
  if (!order) {
    return res;
  }
  // res.push({ $limit: parseInt(limit) }, { $skip: parseInt(skip) });
  res.limit = parseInt(limit);
  res.skip = parseInt(skip);
  let fieldSort = '';
  let typeSort = '';
  if (order.length === 1) {
    let tmp = order[0].split(' ');
    if (tmp.length === 2) {
      fieldSort = tmp[0];
      typeSort = tmp[1];
    }
  }
  if (!fieldSort || !typeSort) {
    return res;
  }
  let tmp = {};
  if (typeSort === 'ASC') {
    tmp[fieldSort] = 1;
  } else if (typeSort === 'DESC') {
    tmp[fieldSort] = -1;
  }
  // res.push({ $sort: tmp });
  res.sort = tmp;
  return res;
};
utilCommon.convertObjectId = function(data) {
  let ids = data.map(id => {
    return typeof id === 'string' ? ObjectID(id) : id;
  });
  return ids;
};
module.exports = utilCommon;
