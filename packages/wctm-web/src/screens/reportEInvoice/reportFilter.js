import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { FlexFormFilter, translate, SelectInput, withDataProvider, Button } from 'ra-loopback3';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Grid, Paper } from '@material-ui/core';
import moment from 'moment-timezone';
import FilterFromToTime from '../../components/common/filter/FilterFromToTime';

import { StatisticButtonIcon } from '../../styles/Icons';
import config from '../../Config';

const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  };
};

class ReportFilter extends Component {
  constructor(props) {
    super(props);
    this.selectAll = config.selectAll;

    this.state = {
      mode: 'time',
      valueTimeFrom: moment(new Date())
        .subtract(30, 'days')
        .format('DD/MM/YYYY'),
      valueTimeTo: moment(new Date()).format('DD/MM/YYYY'),
      filter: {},
    };
  }

  UNSAFE_componentWillMount() {}

  onChangeMode = (e, val) => {
    this.setState({ mode: val });
  };

  onChangeTime = dataTime => {
    this.setState({
      valueTimeFrom: moment(dataTime.fromTime)
        .startOf('month')
        .format('DD/MM/YYYY'),
      valueTimeTo: moment(dataTime.toTime)
        .endOf('month')
        .format('DD/MM/YYYY'),
    });
  };

  submitFilter = () => {
    
    let filter = {};
    filter.mode = this.state.mode;
    filter.valueTimeFrom = this.state.valueTimeFrom;
    filter.valueTimeTo = this.state.valueTimeTo;
    this.props.queryReport(filter);
    this.setState({ filter: filter });
  };
  render() {
    const { translate } = this.props;

    return (
      <Paper>
        <FlexFormFilter formName={'reportQuality'}>
          <Grid middle container spacing={2}>
          <Grid middle item xs={12} sm={2}>
            <SelectInput
              source="mode"
              label={translate('resources.einvoicereports.filterType')}
              choices={config.eInvoiceModeChoices}
              style={{ marginLeft: '5px', width: "60px" }}
              onChange={this.onChangeMode}
              
            />
          </Grid>

          <Grid middle item xs={12} sm={3}>
            <Fragment>{this.state.mode == 'time' && <FilterFromToTime getFilter={this.onChangeTime} />}</Fragment>
            </Grid>
            <Grid middle item xs={12} sm={12}>
            <Button
              label={translate('generic.statistic.labelButtonStatistic')}
              style={{ marginTop: '0px', marginLeft: 0, width: "120px"}}
              onClick={this.submitFilter}
            >
              <StatisticButtonIcon />
            </Button>
            </Grid>
          </Grid>
        </FlexFormFilter>
      </Paper>
    );
  }
}

ReportFilter.propTypes = {
  translate: PropTypes.func,
  classes: PropTypes.object,
  queryReport: PropTypes.func,
  dataProvider: PropTypes.any,
};
ReportFilter.defaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const enhance = compose(connect(null, {}), withTheme, withStyles(styles), translate, withDataProvider);

export default enhance(ReportFilter);
