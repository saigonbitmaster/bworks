import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import {
  List,
  TextField,
  Datagrid,
  DateField,
  CustomReferenceField,
  translate,
  FunctionField,
  NumberField,
  showNotification,
  CUSTOM,
  withDataProvider,
  ImageFromPathField,
} from 'ra-loopback3';
import get from 'lodash/get';
import HistoryButton from './HistoryButton';
import WriteMeterNumberButton from './WriteMeterNumberButton';
import { connect } from 'react-redux';
import ClientMeterNumberFilters from './ClientMeterNumberFilters';
import FillZeroVolumeButton from './FillZeroVolumeButton';
import ImportDataButton from '../../components/common/button/ImportDataButton';
import ExportTemplateButton from '../../components/common/button/ExportTemplateButton';
import { Image } from '@material-ui/icons';
class ClientMeterNumberList extends Component {
  state = {
    defaultFilters: {
      termMeterNumber: moment()
        .startOf('month')
        .toDate(),
      displayAll: true,
    },
    disableEinvoiceExport: false,
  };
  refFilter = React.createRef();
  refController = React.createRef();
  // eslint-disable-next-line
  fixFilter = values => {
    let tmp = [];
    if (values.termMeterNumber) {
      tmp.push({
        startMeterDate: {
          lt: moment(values.termMeterNumber)
            .startOf('month')
            .toDate(),
        },
      });

      if (!values.displayAll) {
        tmp.push(
          { status: { eq: 'ACTIVE' } },
          {
            termMeterNumber: {
              gte: moment(values.termMeterNumber)
                .subtract(1, 'month')
                .startOf('month')
                .toDate(),
            },
          },
          {
            termMeterNumber: {
              lt: moment(values.termMeterNumber)
                .endOf('month')
                .toDate(),
            },
          },
        );
      }
    }
    if (values.status) {
      tmp.push({ status: values.status });
    }
    if (values.districtId) {
      tmp.push({ districtId: values.districtId });
    }
    if (values.wardId) {
      tmp.push({ wardId: values.wardId });
    }
    if (values.quarterId) {
      tmp.push({ quarterId: values.quarterId });
    }
    if (values.$text) {
      tmp.push({ $text: values.$text });
    }
    if (values.numberStatus) {
      if (values.numberStatus === 'WROTE_WATER') {
        tmp.push({
          lastTimeMeterNumberUpdate: {
            gt: moment(values.termMeterNumber)
              .startOf('month')
              .toDate(),
          },
        });
      } else {
        tmp.push({
          lastTimeMeterNumberUpdate: {
            lt: moment(values.termMeterNumber)
              .startOf('month')
              .toDate(),
          },
        });
      }
    }
    let cdt = {};
    if (tmp.length > 0) {
      cdt.and = tmp;
    }
    return cdt;
  };

  componentDidMount = () => {
    // Check if there is any active einvoice range
    const { dataProvider, showNotification } = this.props;
    dataProvider(CUSTOM, 'EinvoiceRanges', {
      fullUrl: true,
      method: 'GET',
      query: { filter: JSON.stringify({ where: { isActive: true } }) },
    }).then(({ data }) => {
      if (!data || data.length === 0) {
        this.setState({ disableEinvoiceExport: true });
        showNotification('generic.messages.noActiveEinvoiceRangeAvailable', 'warning');
      }
    });
  };

  getTermMonthFormat = () => {
    const termMonth = get(this.refFilter.current, 'props.values.termMeterNumber');
    return moment(termMonth).format('YYYY-MM');
  };

  handleDistrictChange = filterValues => {
    if (filterValues.wardId || filterValues.quarterId) {
      this.refFilter.current.props.change('wardId', '');
      this.refFilter.current.props.change('quarterId', '');
    }
  };

  handleWardChange = filterValues => {
    if (filterValues.quarterId) {
      this.refFilter.current.props.change('quarterId', '');
    }
  };

  render() {
    const { disableEinvoiceExport } = this.state;
    const { record, id, resource, translate, showNotification, dataProvider, ...rest } = this.props;

    return (
      <List
        {...rest}
        resource="clientaliasmeternumbers"
        filters={
          <ClientMeterNumberFilters
            handleDistrictChange={this.handleDistrictChange}
            handleWardChange={this.handleWardChange}
          />
        }
        refFilter={this.refFilter}
        refController={this.refController}
        bulkActionButtons={false}
        extActions={
          <Fragment>
            <FillZeroVolumeButton
              refController={this.refController}
              permission={{ name: 'clientMeterNumber', action: 'fillZeroTerm' }}
            />
            <ImportDataButton
              showNotification={showNotification}
              acceptedFileExtensions={['.xlsx']}
              fileModelData={{ modelName: 'ExcelFiles', modelUrl: 'uploaded/upload' }}
              importModelData={{ modelName: 'ClientMeterNumbers', modelUrl: 'importClientMeterNumbersFromExcel' }}
              disableEinvoiceExport={disableEinvoiceExport}
            />
            <ExportTemplateButton
              refController={this.refController}
              templateData={{
                fileModel: 'ClientMeterNumbers',
                queryData: {
                  subUrl: 'fillTemplateForBulkWriting',
                  fullUrl: true,
                  query: {
                    outputTemplate: 'clientMeterNumberStandardTemplate.xlsx',
                    currentMonth: null,
                    filter: [],
                  },
                },
              }}
            />
          </Fragment>
        }
        filterDefaultValues={this.state.defaultFilters}
        fixFilter={this.fixFilter}
        sort={{ field: 'code', order: 'ASC' }}
      >
        <Datagrid>
          <TextField source="code" label={'resources.clients.fields.code'} />
          <TextField source="name" label={'resources.clients.fields.name'} />
          <TextField source="formattedAddress" label={'resources.clients.fields.formattedAddress'} />
          {/* <DateField source="contractDate" label={'resources.clients.fields.contractDate'} /> */}
          <FunctionField
            label={'resources.clients.fields.status'}
            render={record => translate(`resources.clients.clientStatus.${record.status}`)}
          />
          <NumberField source="lastMeterNumber" label={'resources.clients.fields.lastMeterNumber'} />
          <DateField source="lastTimeMeterNumberUpdate" label={'resources.clients.fields.lastTimeMeterNumberUpdate'} />
          <FunctionField
            render={record => {
              return record.termInvoice ? moment(record.termInvoice).format('MM/YYYY') : '';
            }}
            label={'resources.clients.fields.lastTermInvoice'}
          />
          <FunctionField
            render={record => {
              let { termMeterNumber } = record;
              let termMonth = get(this.refFilter, 'current.props.values.termMeterNumber');
              if (!termMeterNumber || !termMonth) {
                return '';
              }

              termMeterNumber = moment(termMeterNumber).startOf('month');
              termMonth = moment(termMonth).startOf('month');

              return termMeterNumber.isSameOrAfter(termMonth)
                ? translate('resources.clientmeternumbers.wroteWater')
                : translate('resources.clientmeternumbers.unWriteWater');
            }}
            label={'resources.clientmeternumbers.writeWater'}
          />
          <CustomReferenceField
            label="resources.clientmeternumbers.userNameWriteMeter"
            source="id"
            fixSource={record => `${record.id}-${this.getTermMonthFormat()}`}
            sortable={false}
            reference="clientmeternumbers"
            allowEmpty
            linkType={false}
          >
            <CustomReferenceField
              source="id"
              fixSource={record => (record ? record.updaterId : '')}
              reference="appusers"
              allowEmpty
              linkType={false}
            >
              <TextField source="username" />
            </CustomReferenceField>
          </CustomReferenceField>

          <CustomReferenceField
            label="resources.clientmeternumbers.fields.image"
            source="id"
            fixSource={record => `${record.id}-${this.getTermMonthFormat()}`}
            sortable={false}
            reference="clientmeternumbers"
            allowEmpty
            linkType={false}
          >
            <FunctionField
              render={record => {
                const image = get(record, 'images[0]', undefined);
                if (image) {
                  return (
                    <ImageFromPathField
                      source="images"
                      thumbnail={<Image color="primary" />}
                      record={record}
                      dataProvider={dataProvider}
                      storage="ctmfiles"
                      imageName={image.name}
                    />
                  );
                }
                return <Image color="disabled" />;
              }}
            />
          </CustomReferenceField>

          <WriteMeterNumberButton
            disableEinvoiceExport={disableEinvoiceExport}
            basePath="clientmeternumber"
            refFilter={this.refFilter}
          />
          <HistoryButton permission={{ name: 'clientMeterNumber', action: 'historyWater' }} />
        </Datagrid>
      </List>
    );
  }
}
ClientMeterNumberList.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  record: PropTypes.any,
  id: PropTypes.string,
  resource: PropTypes.string,
  dataProvider: PropTypes.func,
  showNotification: PropTypes.func,
};

ClientMeterNumberList.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const enhance = compose(withDataProvider, translate, connect(null, { showNotification }));
export default enhance(ClientMeterNumberList);
