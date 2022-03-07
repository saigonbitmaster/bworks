import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  FlexFormFilter,
  translate,
  SelectInput,
  withDataProvider,
  CUSTOM,
  Button,
  TimeRangeInput,
  DmaSelectInput,
} from 'ra-loopback3';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Grid, Paper } from '@material-ui/core';
import { StatisticButtonIcon, PrintIcon } from '../../styles/Icons';
import config from '../../Config';
import get from 'lodash/get';
import { change } from 'redux-form';

const ALL_DMA = 'AllDma';

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
    this.state = {
      loggerGroup: [],
      parameterGroup: [],
      selectedWaterParam: [],
      dmaGroup: [],
      filter: {},
    };
  }
  componentDidMount() {
    this.getDmaGroup();
    this.getParameterGroup();
  }

  getDmaGroup = () => {
    let { dataProvider } = this.props;
    dataProvider(CUSTOM, 'dmas', { filter: { fields: { id: true, name: true } } }).then(res => {
      this.setState({ dmaGroup: [...this.selectAll, ...res.data] }, () => {
        this.onChangeDmaGroup('', ALL_DMA);
        this.submitFilter();
      });
    });
  };
  onChangeDmaGroup = (e, val) => {
    let { dataProvider, formName } = this.props;
    let { dmaGroup } = this.state;
    let ids = [];
    if (val === ALL_DMA) {
      // chon tat ca
      for (let i = 0; i < dmaGroup.length; i++) {
        if (dmaGroup[i].id !== this.selectAll[0].id) {
          ids.push(dmaGroup[i].id);
        }
      }
    } else {
      ids.push(val);
    }
    dataProvider(CUSTOM, 'materialuses', {
      filter: {
        where: { and: [{ dmaId: { inq: ids } }, { type: 'QualityLogger' }] },
        fields: { id: true, name: true, waterParameter: true, optionKey: true },
      },
    }).then(res => {
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
      this.setState({ loggerGroup: [...this.selectAll, ...tmp] });
    });
    change(formName, 'loggerId', '');
  };

  // eslint-disable-next-line
  onChangeLoggerSource = (e, val) => {
    // let { translate } = this.props;
    // let { loggerGroup } = this.state;
    // let tmp = loggerGroup.filter(item => item.id === val);
    // if (!tmp || !tmp.length) {
    //   this.setState({ parameterGroup: [] });
    //   return;
    // }
    // let waterParameter = get(tmp[0], 'waterParameter', '');
    // if (!waterParameter || !waterParameter.length) {
    //   this.setState({ parameterGroup: [] });
    //   return;
    // }
  };

  getParameterGroup = () => {
    let { translate } = this.props;
    let waterParameter = ['ntu', 'ph', 'cod'];
    let parameterGroup = waterParameter.map(item => {
      return { name: translate(`generic.symbol.${item}`), id: item };
    });
    this.setState({ parameterGroup });
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

  submitFilter = () => {
    // let { selectedWaterSources, selectedParamSymbol, selectedWaterParam } = this.state;
    let { queryReport } = this.props;

    // let filter = {};

    let tmp = get(this.formRefFilter, 'current.props.values');
    // console.log(tmp);

    // // filter.selectedWaterSources = arr;
    // filter.typeTime = get(tmp, 'timeRange.type');
    // filter.valueTimeFrom = get(tmp, 'timeRange.from');
    // filter.valueTimeTo = get(tmp, 'timeRange.to');
    queryReport(tmp);
    return;
  };
  render() {
    const { translate, handlePrint, classes, typeTimes, formName, hasPrint, defaultFilter } = this.props;

    let { loggerGroup, parameterGroup, filter } = this.state;

    return (
      <Paper>
        <FlexFormFilter formRef={this.formRefFilter} formName={formName} defaultValue={defaultFilter}>
          <Grid middle container>
            <DmaSelectInput
              allowEmpty={false}
              source={'dmaId'}
              label={translate('generic.dma').toUpperCase()}
              style={{ marginLeft: '5px' }}
              alldma={ALL_DMA}
              formClassName={classes.widthFormGroup}
              onChange={this.onChangeDmaGroup}
            />
            <SelectInput
              source="loggerId"
              label={translate('resources.reportqualities.fields.selectLogger')}
              choices={loggerGroup}
              style={{ marginLeft: '5px' }}
              onChange={this.onChangeLoggerSource}
            />

            <SelectInput
              source="waterParameter"
              label={translate('resources.reportqualities.fields.selectParameter')}
              choices={parameterGroup}
              style={{ marginLeft: '5px' }}
              onChange={this.onChangeWaterParameter}
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
  flgChart: PropTypes.bool, // filter of chart
  flgDetail: PropTypes.bool, // filter of list
};
FilterReportWaterSource.defaultProps = {
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

export default enhance(FilterReportWaterSource);
