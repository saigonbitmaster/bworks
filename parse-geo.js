const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const filePath = path.join(__dirname, 'tmp/geo.xlsx');

const provincePrefixes = ['Thành phố', 'Tỉnh'];
const districtPrefixes = ['Thành phố', 'Quận', 'Thị xã', 'Huyện'];
const wardPrefixes = ['Phường', 'Thị trấn', 'Xã'];

const parseName = (str, code, prefixes) => {
  try {
    if (!str) {
      return undefined;
    }
    for (const prefix of prefixes) {
      if (str.toLowerCase().indexOf(prefix.toLowerCase()) === 0) {
        return {
          name: str.substring(prefix.length).trim(),
          prefix: prefix,
          code: code.trim(),
        };
      }
    }
  } catch (err) {
    console.error(err);
  }
  throw new Error('Prefix not found ' + str + ' ' + prefixes.join('|'));
};

const parseRow = row => {
  return {
    province: parseName(row['Tỉnh Thành Phố'], row['Mã TP'], provincePrefixes),
    district: parseName(row['Quận Huyện'], row['Mã QH'], districtPrefixes),
    ward: parseName(row['Phường Xã'], row['Mã PX'], wardPrefixes),
  };
};

const parseGeo = async () => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames.length ? workbook.SheetNames[0] : '';

  const worksheet = workbook.Sheets[sheetName];
  if (worksheet) {
    const data = xlsx.utils.sheet_to_json(worksheet);

    let result = data.map(parseRow);
    result = _.groupBy(result, item => item.province.name);
    for (const dItem in result) {
      const dObjects = _.groupBy(result[dItem], i => i.district.name);
      for (const wItem in dObjects) {
        const wObject = _.groupBy(dObjects[wItem], i => _.get(i, 'ward.name'));
        dObjects[wItem] = wObject;
      }
      result[dItem] = dObjects;
    }
    console.log(result);
  }

  // export
};

parseGeo();
