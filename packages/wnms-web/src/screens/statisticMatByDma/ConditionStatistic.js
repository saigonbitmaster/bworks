import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { compose } from 'recompose';
import classNames from 'classnames';
import { FlexFormFilter, MaterialSelectInput, BooleanInput, DmaSelectInput } from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import moment from 'moment-timezone';
import SelectMonthYear from '../../util/SelectMonthYear';

const styles = () => ({
  model: {
    float: 'right',
  },
});

class ConditionStatistic extends Component {
  formRef = React.createRef();
  defaultValue = {
    typeMat: 'AllMat',
    typeTime: 'month',
    month: new Date(),
    year: moment().format('YYYY'),
    checkedChildDma: true,
    dmaId: 'AllDma',
    flgIncludeChild: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      filter: this.defaultValue,
    };
  }
  onChangeFilter = filter => {
    // console.log('onChangeFilter', filter);
    let { typeTime, month, year, typeMat, dmaId, flgIncludeChild } = filter;
    let valueTime = '';
    if (typeTime === 'month') {
      valueTime = moment(month).format('YYYY-MM');
    } else if (typeTime === 'year') {
      valueTime = year;
    }
    this.props.onStatistic({ typeMat, typeTime, valueTime, dmaId, flgIncludeChild });
  };
  // eslint-disable-next-line
  onChangeTime = dataTime => {
  };

  // handleChangeCheckedChilDma = (event, value) => {
  //   this.setState({ checkedChildDma: value });
  // };

  // eslint-disable-next-line
  onChangeDma = (e, val) => {
  };
  render() {
    const { classes, translate } = this.props;
    return (
      <FlexFormFilter
        formName="filter-form-statistic-mat-dma"
        onChange={this.onChangeFilter}
        formRef={this.formRef}
        defaultValue={this.defaultValue}
      >
        <Grid middle container spacing={2}>
          <DmaSelectInput
            source={'dmaId'}
            label={translate('generic.dma').toUpperCase()}
            style={{ marginLeft: '20px' }}
            alldma={'true'}
            onChange={this.onChangeDma}
          />
          {/* <FormControlLabel
            control={
              <Checkbox
                checked={this.state.checkedChildDma}
                color="primary"
                onChange={this.handleChangeCheckedChilDma}
              />
            }
            label={translate('resources.customstatisticmatbydmas.includeChildDma')}
            style={{ marginTop: '30px', marginLeft: '10px', width: '165px' }}
          /> */}
          <BooleanInput
            label={translate('resources.customstatisticmatbydmas.includeChildDma')}
            source="flgIncludeChild"
            style={{ marginTop: '30px', marginLeft: '10px', width: '185px' }}
          />
          <MaterialSelectInput
            source={'typeMat'}
            label={translate('generic.selectGroupMat')}
            className={classNames(classes.model)}
            style={{ marginLeft: '0px' }}
            allmat={'true'}
          />
          <SelectMonthYear onChangeTime={this.onChangeTime} />
        </Grid>
      </FlexFormFilter>
    );
  }
}

ConditionStatistic.propTypes = {
  push: PropTypes.func,
  translate: PropTypes.func,
  onStatistic: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

const enhance = compose(
  withStyles(styles),
  connect(null, {
    push,
  }),
);

export default enhance(ConditionStatistic);
