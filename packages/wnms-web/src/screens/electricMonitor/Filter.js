import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlexFormFilter, translate, SelectInput, withDataProvider, CUSTOM, Button, TimeRangeInput } from 'ra-loopback3';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Grid, Paper } from '@material-ui/core';
import { StatisticButtonIcon } from '../../styles/Icons';
import config from '../../Config';
import get from 'lodash/get';
import { change } from 'redux-form';

const ALL = 'all';

const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    widthFormGroup: { float: 'left', paddingRight: '8px' },
  };
};

class Filter extends Component {
  formRefFilter = React.createRef();
  constructor(props) {
    super(props);
    this.selectAll = config.selectAll;
    this.state = {
      loggers: [],
      pumps: [],
      pumpStations: [],
      filter: {},
    };
  }
  componentDidMount() {
    this.getPumpStation();
    this.getPump();
    this.getElectricLogger();
  }

  // data tram bom
  getPumpStation = () => {
    let { dataProvider } = this.props;
    dataProvider(CUSTOM, 'pumpstations', { filter: { fields: { id: true, name: true } } }).then(res => {
      this.setState({ pumpStations: [...this.selectAll, ...res.data] }, () => {
        // this.onChangePump('', ALL);
        this.submitFilter();
      });
    });
  };

  // data may bom
  getPump = () => {
    let { dataProvider } = this.props;
    dataProvider(CUSTOM, 'materialuses', {
      filter: { where: { type: 'Pump' } },
      fields: { id: true, name: true },
    }).then(res => {
      this.setState({ pumps: [...this.selectAll, ...res.data] }, () => {
        // this.onChangePumpStation('', ALL);
        // this.submitFilter();
      });
    });
  };

  getElectricLogger = () => {
    let { dataProvider } = this.props;
    dataProvider(CUSTOM, 'materialuses', {
      filter: { where: { type: 'ElectricLogger' } },
      fields: { id: true, name: true },
    }).then(res => {
      this.setState({ loggers: [...this.selectAll, ...res.data] }, () => {
        // this.onChangePumpStation('', ALL);
        // this.submitFilter();
      });
    });
  };

  onChangePumpStation = (e, val) => {
    let { dataProvider } = this.props;
    let { pumpStations } = this.state;
    let ids = [];
    if (val === ALL) {
      // chon tat ca
      for (let i = 0; i < pumpStations.length; i++) {
        if (pumpStations[i].id !== this.selectAll[0].id) {
          ids.push(pumpStations[i].id);
        }
      }
    } else {
      ids.push(val);
    }
    dataProvider(CUSTOM, 'materialuses', {
      filter: {
        where: { and: [{ pumpStationId: { inq: ids } }, { type: 'Pump' }] },
        fields: { id: true, name: true, electricLoggerId: true },
      },
    }).then(res => {
      let tmp = [];
      if (res.data && res.data.length) {
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          tmp.push({
            id: item.id,
            name: `${item.name}`,
            electricLoggerId: item.electricLoggerId,
          });
        }
      }
      if (tmp.length)
        this.setState({ pumps: [...this.selectAll, ...tmp], loggers: [] }, () => {
          // this.onChangePump('', ALL);
        });
      else
        this.setState({ pumps: [], loggers: [] }, () => {
          // this.onChangePump('', ALL);
        });
    });
    // change(formName, 'pumpId', ALL);
  };

  onChangePump = (e, val) => {
    // console.log('change pump:', val);
    let { dataProvider, formName } = this.props;
    let { pumps } = this.state;
    let ids = [];
    if (val === ALL) {
      // chon tat ca
      for (let i = 0; i < pumps.length; i++) {
        if (pumps[i].id !== this.selectAll[0].id) {
          ids.push(pumps[i].id);
        }
      }
    } else {
      ids.push(val);
    }
    dataProvider(CUSTOM, 'materialuses', {
      filter: {
        where: { and: [{ id: { inq: ids } }, { type: 'Pump' }] },
        fields: { id: true, name: true, electricLoggerId: true },
      },
    }).then(res => {
      // console.log('res pump', res);
      if (res.data && res.data.length) {
        let electricLoggerIds = [];
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          let electricLoggerId = item.electricLoggerId;
          if (electricLoggerId) {
            electricLoggerIds.push(electricLoggerId);
          }
        }
        if (electricLoggerIds.length) {
          dataProvider(CUSTOM, 'materialuses', {
            filter: {
              where: { and: [{ id: { inq: electricLoggerIds } }, { type: 'ElectricLogger' }] },
              fields: { id: true, name: true, electricLoggerId: true, optionKey: true },
            },
          }).then(res => {
            // console.log('res logger', res);
            let tmp = [];
            if (res.data && res.data.length) {
              for (let i = 0; i < res.data.length; i++) {
                let item = res.data[i];
                tmp.push({
                  id: item.id,
                  name: `${item.name} - ${item.optionKey}`,
                });
              }
            }
            if (tmp.length) this.setState({ loggers: [...this.selectAll, ...tmp] });
            else this.setState({ loggers: [] });
          });
        }
      }
    });
    if (e === '') change(formName, 'pumpId', ALL);
  };

  onChangeTime = dataTime => {
    this.setState({
      typeTime: dataTime.typeTime,
      valueTimeFrom: dataTime.valueTimeFrom,
      valueTimeTo: dataTime.valueTimeTo,
    });
  };

  submitFilter = () => {
    let { queryReport } = this.props;

    // let filter = {};

    let tmp = get(this.formRefFilter, 'current.props.values');
    // console.log(tmp);
    queryReport(tmp);
    return;
  };
  render() {
    const { translate, classes, typeTimes, formName, defaultFilter } = this.props;

    let { loggers, pumpStations, pumps } = this.state;

    return (
      <Paper>
        <FlexFormFilter formRef={this.formRefFilter} formName={formName} defaultValue={defaultFilter}>
          <Grid middle container>
            <SelectInput
              source="pumpStationId"
              label={translate('generic.selectPumpStation')}
              choices={pumpStations}
              style={{ marginLeft: '5px' }}
              onChange={this.onChangePumpStation}
            />
            <SelectInput
              source="pumpId"
              label={translate('generic.selectPump')}
              choices={pumps}
              style={{ marginLeft: '5px' }}
              onChange={this.onChangePump}
            />
            <SelectInput
              source="loggerId"
              label={translate('generic.selectElectricLogger')}
              choices={loggers}
              style={{ marginLeft: '5px' }}
              onChange={this.onChangeLoggerSource}
            />
            <TimeRangeInput
              style={{ marginLeft: '5px' }}
              fullWidth
              label={''}
              types={typeTimes}
              source={'timeRange'}
              formClassName={classes.widthFormGroup}
            />

            <Button
              label={translate('generic.statistic.labelButtonStatistic')}
              style={{ marginTop: '35px', marginLeft: '0px', width: '120px', align: 'right' }}
              onClick={this.submitFilter}
            >
              <StatisticButtonIcon />
            </Button>
          </Grid>
        </FlexFormFilter>
      </Paper>
    );
  }
}

Filter.propTypes = {
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
  flgChart: PropTypes.bool, // filter of chart
  flgDetail: PropTypes.bool, // filter of list
};
Filter.defaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
  hasPrint: false,

  flgDetail: false,
  flgChart: false,
};
// function mapStateToProps(state) {
//   return {
//     fieldForm: getFormValues('nms-filter-report-quality-chart')(state),
//   };
// }
const enhance = compose(connect(null, { change }), withTheme, withStyles(styles), translate, withDataProvider);

export default enhance(Filter);
