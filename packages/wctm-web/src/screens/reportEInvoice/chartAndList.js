import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  translate,
  List,
  Datagrid,
  TextField,
  withDataProvider,
  DateField,
  NumberField,
  FunctionField,
  showDialog,
  CUSTOM,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import format from '../../util/format';
import moment from 'moment';
// import config from '../../Config';

const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    relative: {
      position: 'relative !important',
    },
  };
};

class ChartAndList extends Component {
  constructor(props) {
    super(props);
    this.state = { totalInvoices: '', totalValidInvoices: '', templateCode: '' };
  }
  componentWillReceiveProps() {
    const { filter } = this.props;
    this.props
      .dataProvider(CUSTOM, 'EInvoiceData', {
        method: 'GET',
        subUrl: 'eInvoiceReportSummary',
        query: { filter: JSON.stringify(filter) },
      })
      .then(result => {
        if (result) this.setState(result.data);
      });
  }
  render() {
    const { translate, filter, refController } = this.props;
    const mode = filter.mode || 'time';
    //const mode = 'time';
    // const mode = "series";
    let sort = {};
    if (mode == 'time') {
      sort = { field: 'month', order: 'DESC' };
    } else {
      sort = { field: 'templateCode', order: 'ASC' };
    }
    let subTitle = [
      {
        mode: 'time', content: `${translate('resources.einvoicereports.validInvoices')}: ${format.number(
          this.state.totalValidInvoices,
        )}`,
      },
      { mode: 'time', content: `${translate('resources.einvoicereports.totalInvoices')}: ${format.number(this.state.totalInvoices)}` },

      { mode: 'series', content: `${translate('resources.einvoicereports.templateCode')}: ${this.state.templateCode}` },
      {
        mode: 'series',
        content: `${translate('resources.einvoicereports.validInvoices')}: ${format.number(
          this.state.totalValidInvoices,
        )}`,
      },
      {
        mode: 'series',
        content: `${translate('resources.einvoicereports.totalInvoices')}: ${format.number(this.state.totalInvoices)}`,
      },
    ];

    return (
      <Grid>

        <Grid item xs={12} sm={12}>
          <List
            {...this.props}
            refController={refController}
            className="subheader"
            resource="einvoicereports"
            fixUrl="EInvoiceData/eInvoiceReport"
            title={translate('generic.report.einvoicereport')}
            bulkActionButtons={false}
            subTitle={subTitle
              .filter(item => item.mode == mode)
              .map((item, index) => {
                item.id = index;
                return item;
              })}
            sort={sort}
            perPage={25}
          >
            <Datagrid>
              {mode == 'series' && <TextField source="templateCode" />}
              {mode == 'series' && <NumberField source="validInvoices" />}

              {mode == 'series' && <NumberField source="adjustedInvoices" />}
              {mode == 'series' && <NumberField source="replacedInvoices" />}
              {mode == 'series' && <NumberField source="canceledInvoices" />}
              {mode == 'series' && <NumberField source="totalInvoices" />}
      

{mode == 'time' && <FunctionField
                source="eInvoiceDate"
                render={record => moment(record.eInvoiceDate).format('MM/YYYY')}
                label={translate('resources.einvoicereports.fields.month')}
              />}
              {mode == 'time' && <NumberField source="validInvoices" />}
              {mode == 'time' && <NumberField source="adjustedInvoices" />}
              {mode == 'time' && <NumberField source="replacedInvoices" />}
              {mode == 'time' && <NumberField source="canceledInvoices" />}
              {mode == 'time' && <NumberField source="totalInvoices" />}
            </Datagrid>
          </List>
        </Grid>
      </Grid>
    );
  }
}

ChartAndList.propTypes = {
  translate: PropTypes.func,
  classes: PropTypes.object,
  filter: PropTypes.object,
  refController: PropTypes.any,
  dataProvider: PropTypes.any,
};

const mapStateToProps = state => {
  return {
    report: state.admin.resources.einvoicereports,
  };
};

const enhance = compose(
  connect(mapStateToProps, { showDialog }),
  withTheme,
  withStyles(styles),
  translate,
  withDataProvider,
);

export default enhance(ChartAndList);
