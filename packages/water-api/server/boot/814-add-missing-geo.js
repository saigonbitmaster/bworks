const path = require('path');
const util = require('util');
const excel = require('xlsx');
const eachOfSeries = util.promisify(require('async/eachOfSeries'));
const toObjectId = require('../../common/utils/to-object-id');

module.exports = async app => {
  if (process.env.NODE_INIT_DATA) {
    // Import the geofile
    const workbook = await excel.readFile(path.join(__dirname, 'geo.xls'));

    // Get worksheet
    const worksheet = workbook.Sheets['Sheet1'];

    // Insert missing geodata for Bac Ninh
    const vietnam = await app.models.RefCountry.findOne({ where: { name: 'Việt Nam' } });
    const bacninh = await app.models.RefProvince.findOne({ where: { code: '27' } });
    if (vietnam && bacninh) {
      const bacninhRows = [...new Array(3600 - 3475 + 1)].map((_, i) => 3475 + i);
      await eachOfSeries(bacninhRows, async index => {
        const refDistrictData = worksheet[`C${index}`].v;
        const refDistrictCode = worksheet[`D${index}`].v;
        let refDistrictName = null;
        let refDistrictPrefix = null;
        if (refDistrictData.includes('Thành phố')) {
          refDistrictPrefix = 'Thành phố';
        } else if (refDistrictData.includes('Thị xã')) {
          refDistrictPrefix = 'Thị xã';
        } else if (refDistrictData.includes('Huyện')) {
          refDistrictPrefix = 'Huyện';
        }
        refDistrictName = refDistrictData.split(refDistrictPrefix)[1].trim();
        await app.models.RefDistrict.findOrCreate(
          {
            where: { code: refDistrictCode },
          },
          {
            name: refDistrictName,
            prefix: refDistrictPrefix,
            fullName: refDistrictData,
            code: refDistrictCode,
            countryId: toObjectId(vietnam.id),
            provinceId: toObjectId(bacninh.id),
          },
        );
      });

      await eachOfSeries(bacninhRows, async index => {
        const refWardData = worksheet[`E${index}`].v;
        const refWardCode = worksheet[`F${index}`].v;
        const refWardPrefix = worksheet[`G${index}`].v;
        const refWardName = refWardData.split(refWardPrefix)[1].trim();
        const refDistrictCode = worksheet[`D${index}`].v;
        const refDistrict = await app.models.RefDistrict.findOne({ where: { code: refDistrictCode } });
        if (refDistrict && refDistrict.id) {
          await app.models.RefWard.findOrCreate(
            {
              where: { code: refWardCode },
            },
            {
              name: refWardName,
              prefix: refWardPrefix,
              fullName: refWardData,
              code: refWardCode,
              countryId: toObjectId(vietnam.id),
              provinceId: toObjectId(bacninh.id),
              districtId: toObjectId(refDistrict.id),
            },
          );
        }
      });
    }

    const hcm = await app.models.RefProvince.findOne({ where: { code: '79' } });
    if (vietnam && hcm) {
      // Insert missing geodata for HCM
      const hcmRows = [...new Array(9539 - 9218 + 1)].map((_, i) => 9218 + i);
      await eachOfSeries(hcmRows, async index => {
        const refDistrictData = worksheet[`C${index}`].v;
        const refDistrictCode = worksheet[`D${index}`].v;
        let refDistrictName = null;
        let refDistrictPrefix = null;
        if (refDistrictData.includes('Quận')) {
          refDistrictPrefix = 'Quận';
        } else if (refDistrictData.includes('Huyện')) {
          refDistrictPrefix = 'Huyện';
        }
        refDistrictName = refDistrictData.split(refDistrictPrefix)[1].trim();
        await app.models.RefDistrict.findOrCreate(
          {
            where: { code: refDistrictCode },
          },
          {
            name: refDistrictName,
            prefix: refDistrictPrefix,
            fullName: refDistrictData,
            code: refDistrictCode,
            countryId: toObjectId(vietnam.id),
            provinceId: toObjectId(hcm.id),
          },
        );
      });

      await eachOfSeries(hcmRows, async index => {
        const refWardData = worksheet[`E${index}`].v;
        const refWardCode = worksheet[`F${index}`].v;
        const refWardPrefix = worksheet[`G${index}`].v;
        const refWardName = refWardData.split(refWardPrefix)[1].trim();
        const refDistrictCode = worksheet[`D${index}`].v;
        const refDistrict = await app.models.RefDistrict.findOne({ where: { code: refDistrictCode } });
        if (refDistrict && refDistrict.id) {
          await app.models.RefWard.findOrCreate(
            {
              where: { code: refWardCode },
            },
            {
              name: refWardName,
              prefix: refWardPrefix,
              fullName: refWardData,
              code: refWardCode,
              countryId: toObjectId(vietnam.id),
              provinceId: toObjectId(hcm.id),
              districtId: toObjectId(refDistrict.id),
            },
          );
        }
      });
    }
  }
};
