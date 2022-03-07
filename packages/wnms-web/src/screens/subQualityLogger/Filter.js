import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, FlexFormFilter, translate, SelectInput, withDataProvider, TimeRangeInput } from 'ra-loopback3';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Grid, Paper } from '@material-ui/core';
import { StatisticButtonIcon, PrintIcon, BackIcon } from '../../styles/Icons';
import get from 'lodash/get';
import { change } from 'redux-form';
import { goBack } from 'react-router-redux';
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
    this.state = {
      parameterGroup: [],
      selectedWaterParam: [],
      filter: {},
    };
  }
  componentDidMount() {
    this.getParameterGroup();
  }

  getParameterGroup = () => {
    let { translate } = this.props;
    let waterParameter = ['ntu', 'ph', 'cod'];
    let parameterGroup = waterParameter.map(item => {
      return { name: translate(`generic.symbol.${item}`), id: item };
    });
    this.setState({ parameterGroup }, () => this.submitFilter());
  };

  onChangeWaterParameter = (e, val) => {
    this.setState({ selectedWaterParam: { id: val } });
  };

  submitFilter = () => {
    let { queryReport } = this.props;
    let tmp = get(this.formRefFilter, 'current.props.values');
    queryReport(tmp);
    return;
  };
  actions = () => {
    return (
      <Button
        style={{ marginTop: '35px', marginLeft: '0px', width: '100px', float: 'right' }}
        label={this.props.translate('generic.back')}
        onClick={() => this.props.goBack()}
      >
        <BackIcon />
      </Button>
    );
  };
  render() {
    const { translate, handlePrint, classes, typeTimes, formName, hasPrint, defaultFilter } = this.props;

    let { parameterGroup, filter } = this.state;
    let CustomActions = this.actions;
    return (
      <Paper>
        <FlexFormFilter formRef={this.formRefFilter} formName={formName} defaultValue={defaultFilter}>
          <Grid middle container>
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
            <CustomActions />
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
  goBack: PropTypes.func,
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
const enhance = compose(connect(null, { change, goBack }), withTheme, withStyles(styles), translate, withDataProvider);

export default enhance(Filter);
