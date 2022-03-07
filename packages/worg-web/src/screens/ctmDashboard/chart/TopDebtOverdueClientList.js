import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { List, Datagrid, TextField, NumberField, Filter, MonthInput } from 'ra-loopback3';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';

const styles = theme => ({
  root: {
    height: '100%',
  },
  header: {
    paddingTop: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(1),
    height: '100%',
  },
});

const MonthFilter = ({ filterValues, ...rest }) => (
  <Filter {...rest} toLeft={true} filterValues={filterValues}>
    <MonthInput
      label="resources.clients.fields.termMeterNumber"
      allowEmpty={false}
      source="termMeterNumber"
      date
      alwaysOn
    />
  </Filter>
);

MonthFilter.propTypes = {
  filterValues: PropTypes.object,
};

class TopDebtOverdueClientList extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  state = {
    data: [],
    defaultFilters: {
      termMeterNumber: moment()
        .startOf('month')
        .toDate(),
    },
  };

  render() {
    const { defaultFilters } = this.state;
    const { classes, ...rest } = this.props;

    return (
      <Grid container style={{ height: '100%' }}>
        <Grid item xs={12} sm={12}>
          <List
            resource="clientmeternumbers"
            {...rest}
            filters={<MonthFilter />}
            filterDefaultValues={defaultFilters}
            fixUrl="clientmeternumbers/getTopDebtOverdueClients"
            title={'resources.clients.statistic.topDebtOverdueClient'}
            bulkActionButtons={false}
            pagination={false}
            classes={classes}
          >
            <Datagrid>
              <TextField source="code" sortable={false} label="resources.clients.fields.code" />
              <TextField source="name" sortable={false} label="resources.clients.fields.name" />
              <NumberField source="debt" sortable={false} label="Số tiền nợ (đồng)" />
            </Datagrid>
          </List>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(TopDebtOverdueClientList);
