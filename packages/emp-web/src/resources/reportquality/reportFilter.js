import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlexFormFilter, translate, SelectInput, withDataProvider, CUSTOM, Button } from 'ra-loopback3';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Grid, Paper } from '@material-ui/core';
import moment from 'moment-timezone';
import SelectHourDayMonthYearFromTo from '../../components/commons/SelectHourDayMonthYearFromTo';
import { StatisticButtonIcon, PrintIcon } from '../../styles/Icons';
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
  getAllWaterGroups = () => {
    this.props.dataProvider(CUSTOM, 'watersourcegroups', { filter: { fields: { id: true, name: true } } }).then(res => {
      this.setState({ allWaterSourceGroups: [...res.data, ...this.selectAll] });
    });
  };

  getAllWaterSources = () => {
    this.props
      .dataProvider(CUSTOM, 'watersources', { filter: { fields: { id: true, name: true, waterSourceGroupId: true } } })
      .then(res => {
        this.setState({ allWaterSources: [...res.data, ...this.selectAll] });
      });
  };

  getWaterParams = () => {
    this.props
      .dataProvider(CUSTOM, 'waterparameters', { filter: { fields: { id: true, name: true, symbol: true } } })
      .then(res => {
        this.setState({ allWaterParams: res.data });
      });
  };

  constructor(props) {
    super(props);
    this.selectAll = config.selectAll;

    this.state = {
      allWaterSourceGroups: [],
      allWaterSources: [],
      allWaterParams: [],
      waterSourceChoices: [],
      selectedWaterSources: [],
      selectedSourceWaterGroup: null,
      selectedWaterSource: null,
      selectedWaterParam: {},
      selectedParamSymbol: null,
      typeTime: 'month',
      valueTimeFrom: moment(new Date())
        .subtract(6, 'month')
        .format('YYYY-MM'),
      valueTimeTo: moment(new Date()).format('YYYY-MM'),
      filter: {},
    };
  }

  UNSAFE_componentWillMount() {
    this.getAllWaterGroups();
    this.getAllWaterSources();
    this.getWaterParams();
  }

  onChangeSourceGroup = (e, val) => {
    this.setState({ selectedSourceWaterGroup: val });
    if (val === this.selectAll[0].id) {
      this.setState({ waterSourceChoices: this.state.allWaterSources });
    } else {
      this.setState({
        waterSourceChoices: this.state.allWaterSources.filter(
          item => item.waterSourceGroupId === val || item.id === 'all',
        ),
      });
    }
  };

  onChangeWaterSource = (e, val) => {
    if (val !== this.selectAll[0].id) {
      let selectedWaterSources = [];
      selectedWaterSources.push({ id: val });
      this.setState({ selectedWaterSources: selectedWaterSources });
    } else {
      let selectedWaterSources = this.state.waterSourceChoices.map(({ waterSourceGroupId, name, ...rest }) => rest);
      this.setState({ selectedWaterSources: selectedWaterSources });
    }
  };

  onChangeTime = dataTime => {
    this.setState({
      typeTime: dataTime.typeTime,
      valueTimeFrom: dataTime.valueTimeFrom,
      valueTimeTo: dataTime.valueTimeTo,
    });
  };

  onChangeWaterParameter = (e, val) => {
    let selectedParamSymbol = this.state.allWaterParams.filter(item => item.id == val)[0].symbol;
    this.setState({ selectedWaterParam: { id: val }, selectedParamSymbol: selectedParamSymbol });
  };

  submitFilter = () => {
    let filter = {};
    filter.selectedWaterSources = this.state.selectedWaterSources.filter(item => item.id !== this.selectAll[0].id);
    filter.selectedWaterParam = this.state.selectedWaterParam;
    filter.selectedParamSymbol = this.state.selectedParamSymbol.toLowerCase();
    filter.typeTime = this.state.typeTime;
    filter.valueTimeFrom = this.state.valueTimeFrom;
    filter.valueTimeTo = this.state.valueTimeTo;
    this.props.queryReport(filter);
    this.setState({ filter: filter });
  };
  render() {
    const { translate, handlePrint } = this.props;
    return (
      <Paper>
        <FlexFormFilter formName={'reportQuality'}>
          <Grid middle container>
            <SelectInput
              source="sourceGroup"
              label={translate('resources.reportmaterials.fields.selectGroup')}
              choices={this.state.allWaterSourceGroups}
              style={{ marginLeft: '5px' }}
              onChange={this.onChangeSourceGroup}
            />
            <SelectInput
              source="waterSource"
              label={translate('resources.reportmaterials.fields.selectSource')}
              choices={this.state.waterSourceChoices}
              style={{ marginLeft: '5px' }}
              onChange={this.onChangeWaterSource}
              disabled={!this.state.selectedSourceWaterGroup}
            />
            <SelectInput
              source="waterParam"
              label={translate('resources.reportqualities.fields.selectParameter')}
              choices={this.state.allWaterParams}
              style={{ marginLeft: '5px' }}
              defaultValue={'flow'}
              onChange={this.onChangeWaterParameter}
            />

            <SelectHourDayMonthYearFromTo
              onChangeTime={this.onChangeTime}
              sourceTypeTime={'typeTime'}
              sourceDayFrom={'dayFrom'}
              sourceDayTo={'dayTo'}
              sourceMonthFrom={'monthFrom'}
              sourceMonthTo={'monthTo'}
              sourceYearFrom={'yearFrom'}
              sourceYearTo={'yearTo'}
              sourceHour={'hour'}
            />
            <Button
              label={translate('generic.statistic.labelButtonStatistic')}
              style={{ marginTop: '35px', marginLeft: '5px', width: '120px', align: 'right' }}
              onClick={this.submitFilter}
            >
              <StatisticButtonIcon />
            </Button>
            <Button
              label={translate('generic.print')}
              style={{ marginTop: '35px', marginLeft: '0px', width: '50px', align: 'right', float: 'left' }}
              onClick={handlePrint}
              disabled={Object.keys(this.state.filter).length === 0}
            >
              <PrintIcon />
            </Button>
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
  handlePrint: PropTypes.func,
};
ReportFilter.defaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const enhance = compose(connect(null, {}), withTheme, withStyles(styles), translate, withDataProvider);

export default enhance(ReportFilter);
