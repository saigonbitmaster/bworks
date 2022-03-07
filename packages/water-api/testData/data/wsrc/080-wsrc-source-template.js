const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const data = [
  /* 1 */
  {
    id: 'VolumeReportTemplate',
    name: 'Mẫu báo cáo sản lượng',
    description: '',
    data: {
      name: 'reportVolume.docx',
      url: '/api/SourceFiles/download/190117l3b7mx.docx',
    },
  },

  /* 2 */
  {
    id: 'SumQualityReportTemplate',
    name: 'Mẫu báo cáo chất lượng trung bình',
    description: '',
    data: {
      name: 'sumaryQuality.docx',
      url: '/api/SourceFiles/download/190117rojhqg.docx',
    },
  },

  /* 3 */
  {
    id: 'QualityReportTemplate',
    name: 'Mẫu báo cáo chất lượng',
    description: '',
    data: {
      name: 'QualityReportTemplate.docx',
      url: '/api/SourceFiles/download/190221nx1vn8.docx',
    },
  },

  /* 4 */
  {
    id: 'MaterialReportTemplate',
    name: 'Mẫu báo cáo vật tư',
    description: '',
    data: {
      name: 'material.docx',
      url: '/api/SourceFiles/download/18120508207543ec39ea7a246ca1ccb740ec.docx',
    },
  },

  /* 5 */
  {
    id: 'FlowReportTemplate',
    name: 'Mẫu báo cáo lưu lượng',
    description: '',
    data: {
      name: 'flow.docx',
      url: '/api/SourceFiles/download/190117xuul9v.docx',
    },
  },
];
module.exports = {
  init: async app => {
    let model = app.models.SourceTemplate;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init wsrc SourceTemplate error', err) : console.log('init wsrc SourceTemplate OK!')), // eslint-disable-line no-console
    );
  },
};
