import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  FlexFormFilter,
  translate,
  SelectInput,
  withDataProvider,
  CUSTOM,
  Button,
  TimeRangeInput,
  SelectArrayInput,
} from 'ra-loopback3';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Grid, Paper } from '@material-ui/core';
import { StatisticButtonIcon, PrintIcon } from '../../../styles/Icons';
import config from '../../../Config';
import get from 'lodash/get';
import { change } from 'redux-form';

const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    widthFormGroup: { float: 'left', paddingRight: '8px' },
  };
};

class FilterReportWaterSource extends Component {
  formRefFilter = React.createRef();
  constructor(props) {
    super(props);
    this.selectAll = config.selectAll;
    this.conditionTypes = config.filterConditions.map(({ conditions, ...rest }) => rest);
    this.filterConditions = config.filterConditions;

    this.state = {
      allWaterSourceGroups: [],
      allWaterSources: [],
      allWaterParams: [],

      waterSourceChoices: [],
      selectedWaterSources: [],
      selectedSourceWaterGroup: null,
      selectedWaterSource: null,

      filter: {},
    };
  }
  componentDidMount() {
    const { showWaterParameter, flgMaterial } = this.props;

    this.getAllWaterGroups();
    this.getAllWaterSources();

    if (showWaterParameter) {
      this.getWaterParams();
    }

    if (flgMaterial) {
      let conditionChoices = this.filterConditions.filter(item => item.id == '1')[0].conditions;
      this.setState({ conditionChoices: conditionChoices, selectedConditionType: '1' }, () => this.submitFilter());
    }
  }

  getAllWaterGroups = () => {
    let { dataProvider } = this.props;
    dataProvider(CUSTOM, 'watersourcegroups', { filter: { fields: { id: true, name: true } } }).then(res => {
      this.setState({ allWaterSourceGroups: [...res.data, ...this.selectAll] });
    });
  };

  getAllWaterSources = () => {
    let { dataProvider, showWaterParameter } = this.props;
    dataProvider(CUSTOM, 'watersources', {
      filter: { fields: { id: true, name: true, waterSourceGroupId: true } },
    }).then(res => {
      if (showWaterParameter) {
        this.setState({
          waterSourceChoices: [...res.data, ...this.selectAll],
          allWaterSources: [...res.data, ...this.selectAll],
          selectedWaterSources: [...res.data, ...this.selectAll],
        });
      } else {
        this.setState(
          {
            waterSourceChoices: [...res.data, ...this.selectAll],
            allWaterSources: [...res.data, ...this.selectAll],
            selectedWaterSources: [...res.data, ...this.selectAll],
          },
          () => this.submitFilter(),
        );
      }
    });
  };

  onChangeSourceGroup = (e, val) => {
    let { formName, change } = this.props;
    let { allWaterSources } = this.state;
    this.setState({ selectedSourceWaterGroup: val });

    //select all
    if (val === this.selectAll[0].id) {
      this.setState({ waterSourceChoices: allWaterSources });
    } else {
      this.setState({
        waterSourceChoices: allWaterSources.filter(item => item.waterSourceGroupId === val || item.id === 'all'),
        selectedWaterSources: allWaterSources.filter(item => item.waterSourceGroupId === val || item.id === 'all'),
      });
    }
    change(formName, 'waterSource', 'all');
  };

  onChangeWaterSource = (e, val) => {
    let { waterSourceChoices } = this.state;
    if (val !== this.selectAll[0].id) {
      let selectedWaterSources = [];
      selectedWaterSources.push({ id: val });
      this.setState({ selectedWaterSources: selectedWaterSources });
    } else {
      let selectedWaterSources = waterSourceChoices.map(({ waterSourceGroupId, name, ...rest }) => rest);
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
    this.setState({ selectedWaterParam: { id: val } });
  };

  getWaterParams = () => {
    let { formName, change, dataProvider } = this.props;
    dataProvider(CUSTOM, 'waterparameters', { filter: { fields: { id: true, name: true, symbol: true } } }).then(
      res => {
        change(formName, 'waterParam', res.data[0].id);
        this.setState(
          {
            allWaterParams: res.data,
            selectedWaterParam: res.data[0].id,
            selectedParamSymbol: res.data[0].symbol.toLowerCase(),
          },
          () => this.submitFilter(),
        );
      },
    );
  };

  onChangeWaterParameter = (e, val) => {
    let selectedParamSymbol = this.state.allWaterParams.filter(item => item.id == val)[0].symbol.toLowerCase();
    this.setState({ selectedWaterParam: val, selectedParamSymbol: selectedParamSymbol });
  };

  onChangeSelectType = (e, val) => {
    const { change, formName } = this.props;
    let conditionChoices = this.filterConditions.filter(item => item.id == val)[0].conditions;

    change(
      formName,
      'selectCondition',
      conditionChoices.map(item => item.id),
    ); // set default

    this.setState({ conditionChoices: conditionChoices, selectedConditionType: val });
  };
  onChangeSelectMaterial = (e, val) => {
    const { change, formName } = this.props;
    //let conditionChoices = this.filterConditions.filter(item => item.id == val)[0].conditions;

    change(formName, 'selectMaterial', val); // set default

    // this.setState({ conditionChoices: conditionChoices, selectedConditionType: val });
  };
  onChangeCondition = (e, val) => {
    this.setState({ selectedConditions: val });
  };

  submitFilter = () => {
    let { selectedWaterSources, selectedParamSymbol, selectedWaterParam } = this.state;
    let { showWaterParameter, flgMaterial, flgDetail, flgChart, queryReport } = this.props;

    let filter = {};

    let tmp = get(this.formRefFilter, 'current.props.values');
    // console.log('before format filter: ', tmp);

    // filter of chart
    if (flgChart) {
      // console.log('after format filter chart: ', tmp);
      tmp.selectedParamSymbol = selectedParamSymbol;
      queryReport(tmp);
    }

    let arr = [];
    for (let i = 0; i < selectedWaterSources.length; i++) {
      let item = selectedWaterSources[i];
      if (item.id !== this.selectAll[0].id) arr.push({ id: item.id });
    }
    if (!arr.length) return;

    // filter of list
    if (flgDetail) {
      filter.selectedWaterSources = arr;
      filter.typeTime = get(tmp, 'timeRange.type');
      filter.valueTimeFrom = get(tmp, 'timeRange.from');
      filter.valueTimeTo = get(tmp, 'timeRange.to');
      if (showWaterParameter) {
        filter.selectedWaterParam = selectedWaterParam; // id
        filter.selectedParamSymbol = selectedParamSymbol; // name
      }
      // console.log('after format filter detail: ', filter);
      queryReport(filter);
    }

    // filter of report material
    if (flgMaterial) {
      filter.selectedWaterSources = arr;
      filter.conditionType = get(tmp, 'selectType');
      filter.selectConditions = get(tmp, 'selectCondition');
      filter.selectMaterial = get(tmp, 'selectMaterial');
      // console.log('after format filter material: ', filter);
      queryReport(filter);
    }
    // this.setState({ filter: filter });
  };
  render() {
    const {
      showWaterParameter,
      translate,
      handlePrint,
      classes,
      typeTimes,
      formName,
      hasPrint,
      defaultFilter,
      flgMaterial,
    } = this.props;

    let { allWaterSourceGroups, waterSourceChoices, allWaterParams, filter, conditionChoices } = this.state;

    return (
      <Paper>
        <FlexFormFilter formRef={this.formRefFilter} formName={formName} defaultValue={defaultFilter}>
          <Grid middle container>
            <SelectInput
              source="sourceGroup"
              label={translate('resources.reportmaterials.fields.selectGroup')}
              choices={allWaterSourceGroups}
              style={{ marginLeft: '5px', marginTop: '25px' }}
              onChange={this.onChangeSourceGroup}
            />
            <SelectInput
              source="waterSource"
              label={translate('resources.reportmaterials.fields.selectSource')}
              choices={waterSourceChoices}
              style={{ marginLeft: '5px', marginTop: '25px' }}
              onChange={this.onChangeWaterSource}
            />
            {showWaterParameter && (
              <SelectInput
                source="waterParam"
                label={translate('resources.reportqualities.fields.selectParameter')}
                choices={allWaterParams}
                style={{ marginLeft: '5px', marginTop: '25px' }}
                defaultValue={'flow'}
                onChange={this.onChangeWaterParameter}
              />
            )}
            {flgMaterial && (
              <Fragment>
                <SelectInput
                  source="selectMaterial"
                  label={translate('resources.reportmaterials.fields.selectMaterial')}
                  choices={config.selectMaterial}
                  style={{ marginLeft: '5px' }}
                  onChange={this.onChangeSelectMaterial}
                />

                <SelectInput
                  source="selectType"
                  label={translate('resources.reportmaterials.fields.selectType')}
                  choices={this.conditionTypes}
                  style={{ marginLeft: '5px' }}
                  onChange={this.onChangeSelectType}
                />

                <SelectArrayInput
                  label={translate('resources.reportmaterials.fields.selectCondition')}
                  choices={conditionChoices}
                  source="selectCondition"
                  style={{ marginLeft: '5px', width: '200px' }}
                  onChange={this.onChangeCondition}
                />
              </Fragment>
            )}

            {!flgMaterial && (
              <TimeRangeInput
                style={{ marginLeft: '5px', marginTop: '25px' }}
                fullWidth
                label={''}
                types={typeTimes}
                source={'timeRange'}
                formClassName={classes.widthFormGroup}
              />
            )}
            <Button
              label={translate('generic.statistic.labelButtonStatistic')}
              style={{ marginTop: '35px', marginLeft: '0px', width: '120px', align: 'right' }}
              onClick={this.submitFilter}
            >
              <StatisticButtonIcon />
            </Button>

            {hasPrint && (
              <Button
                label={translate('generic.print')}
                style={{ marginTop: '35px', marginLeft: '0px', width: '50px', align: 'right', float: 'left' }}
                onClick={handlePrint}
                disabled={Object.keys(filter).length === 0}
              >
                <PrintIcon />
              </Button>
            )}
          </Grid>
        </FlexFormFilter>
      </Paper>
    );
  }
}

FilterReportWaterSource.propTypes = {
  translate: PropTypes.func,
  classes: PropTypes.object,
  queryReport: PropTypes.func,
  dataProvider: PropTypes.any,
  handlePrint: PropTypes.func,
  change: PropTypes.func,
  formName: PropTypes.string.isRequired,
  typeTimes: PropTypes.array,
  hasPrint: PropTypes.bool,
  formRef: PropTypes.object,

  defaultFilter: PropTypes.object.isRequired,

  showWaterParameter: PropTypes.bool, // show parameter water

  flgMaterial: PropTypes.bool, // filter of report material
  flgChart: PropTypes.bool, // filter of chart
  flgDetail: PropTypes.bool, // filter of list
};
FilterReportWaterSource.defaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
  hasPrint: false,
  showWaterParameter: false,

  flgDetail: false,
  flgMaterial: false,
  flgChart: false,
};
const enhance = compose(connect(null, { change }), withTheme, withStyles(styles), translate, withDataProvider);

export default enhance(FilterReportWaterSource);
