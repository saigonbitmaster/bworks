import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  MenuItem,
  TextField,
  Grid,
  withStyles,
  Checkbox,
  Fab,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputAdornment,
} from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import moment from 'moment-timezone';
import {
  Button,
  SaveButton,
  withDataProvider,
  fetchStart,
  fetchEnd,
  refreshView,
  showNotification,
  translate,
  crudGetMatching,
} from 'ra-loopback3';
import compose from 'recompose/compose';
import { submit, reset } from 'redux-form';
import { set } from 'lodash';
import { connect } from 'react-redux';
import config from '../../Config';

const INIT_FORM = {
  periodic: 'weekly',
  countUnit: 1,
  dailyTime: '08:00',
  weeklyDay: {
    MON: false,
    TUE: false,
    WED: false,
    THU: false,
    FRI: false,
    SAT: false,
    SUN: false,
  },
  monthlyDay: [],
  yearlyMonth: [],
  endTime: {
    checkedOrder: 0,
    noLimited: true,
    endDate: '',
    limit: 0,
  },
};

const DAY_OF_MONTH = Array.from(Array(28), (e, i) => i + 1);
const MONTH_OF_YEAR = Array.from(Array(12), (e, i) => i + 1);

Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter(key => predicate(obj[key]))
    .reduce((res, key) => ((res[key] = obj[key]), res), {});

class RecurrenceDialog extends Component {
  constructor(props) {
    super(props);
    const { repeat = {} } = props;
    this.state = {
      form: this.convertCronToSetting(repeat),
    };
  }

  convertCronToSetting = repeat => {
    const { cron, endDate, limit } = repeat || {};
    // cron format 'sec min day month dayOfWeek'
    if (!cron) return INIT_FORM;
    // const cron = '00 08 12 */12 *';
    const cronArray = cron.split(' ');
    const regArray = cron.match(/(?=\*\/(\d+))/);
    const countUnit = regArray ? parseInt(regArray[1]) : 1;
    const monthlyDay = cronArray[2].includes('*') ? null : cronArray[2].split(',').map(d => parseInt(d, 10));
    const yearlyMonth = cronArray[3].includes('*') ? null : cronArray[3].split(',').map(d => parseInt(d, 10));
    let weeklyDay = INIT_FORM.weeklyDay;
    if (cronArray[4] !== '*') {
      cronArray[4].split(',').forEach(dayValue => {
        set(weeklyDay, [dayValue], true);
      });
    }
    let periodic = '';
    if (monthlyDay) {
      if (yearlyMonth) {
        periodic = 'yearly';
      } else {
        periodic = 'monthly';
      }
    } else {
      if (weeklyDay) {
        periodic = 'weekly';
      } else {
        periodic = 'daily';
      }
    }
    let checkedOrder = 0;
    if (endDate) {
      checkedOrder = 1;
    } else if (limit) {
      checkedOrder = 2;
    }
    return {
      ...INIT_FORM,
      dailyTime: `${cronArray[1]}:${cronArray[0]}`,
      monthlyDay: monthlyDay || [],
      yearlyMonth: yearlyMonth || [],
      weeklyDay,
      countUnit,
      endTime: {
        ...INIT_FORM.endTime,
        checkedOrder,
        endDate: endDate ? moment(endDate).format('YYYY-MM-DD') : '',
        limit: parseInt(limit || 0, 10),
      },
      periodic: periodic || 'weekly',
    };
  };

  resetForm = event =>
    this.setState({
      form: {
        ...INIT_FORM,
        periodic: event.target.value || 'weekly',
      },
    });

  handleChange = name => event => {
    this.setState({ form: { ...this.state.form, [name]: event.target.value } });
  };

  renderOnDailyRepeat = () => {
    const { form } = this.state;
    return (
      <Grid container item direction="row" spacing={1} justify="flex-start" alignItems="center">
        <Grid item>Giờ: </Grid>
        <Grid item>
          <TextField
            id="time"
            type="time"
            onChange={this.handleChange('dailyTime')}
            inputProps={{
              step: 300, // 5 min
            }}
            value={form.dailyTime}
          />
        </Grid>
      </Grid>
    );
  };

  renderOnWeeklyRepeat = () => {
    const { classes, translate } = this.props;
    const { form } = this.state;
    return (
      <Grid
        container
        item
        direction="column"
        spacing={1}
        justify="flex-start"
        // alignItems="center"
      >
        <Grid item>Thứ:</Grid>
        <Grid item container direction="row" spacing={1}>
          {config.notifySetting.weekly.map((day, key) => {
            const { id, name, value } = day;
            const currentValue = form.weeklyDay[value];
            return (
              <Grid key={key} item>
                <Fab
                  title={translate(name)}
                  color={currentValue ? 'primary' : null}
                  className={classes.fab}
                  size="small"
                  value={currentValue}
                  onClick={() =>
                    this.setState({
                      form: {
                        ...this.state.form,
                        weeklyDay: { ...this.state.form.weeklyDay, [value]: !this.state.form.weeklyDay[value] },
                      },
                    })
                  }
                >
                  {id}
                </Fab>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    );
  };

  renderOnMonthlyRepeat = () => {
    const { classes, translate } = this.props;
    const { form } = this.state;
    const title = translate('resources.notifysetting.periodic.monthly.titleSelect');
    return (
      <Grid container item direction="row" spacing={1} justify="flex-start" alignItems="center">
        <Grid item>Ngày: </Grid>
        <Grid item>
          <TextField
            variant="outlined"
            title={title}
            select
            value={form.monthlyDay}
            onChange={this.handleChange('monthlyDay')}
            SelectProps={{
              classes: {
                root: classes.selectRoot,
                select: classes.select,
              },
              multiple: true,
            }}
          >
            {DAY_OF_MONTH.map((value, index) => (
              <MenuItem key={index} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
          {/* {' hằng tháng'} */}
        </Grid>
      </Grid>
    );
  };

  renderOnYearlyRepeat = () => {
    const { classes, translate } = this.props;
    const { form } = this.state;
    const title = translate('resources.notifysetting.periodic.yearly.titleSelect');
    return (
      <Grid container item direction="row" spacing={1} justify="flex-start" alignItems="center">
        <Grid item>Tháng: </Grid>
        <Grid item>
          <TextField
            variant="outlined"
            title={title}
            select
            value={form.yearlyMonth}
            onChange={this.handleChange('yearlyMonth')}
            SelectProps={{
              classes: {
                root: classes.selectRoot,
                select: classes.select,
              },
              multiple: true,
            }}
          >
            {MONTH_OF_YEAR.map((value, index) => (
              <MenuItem key={index} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    );
  };

  renderPeriodicSetting = () => {
    const {
      form: { periodic },
    } = this.state;
    switch (periodic) {
      case 'daily': {
        return (
          <Grid item container direction="column" spacing={1} justify="space-around" alignItems="flex-start">
            {this.renderOnDailyRepeat()}
          </Grid>
        );
      }
      case 'weekly': {
        return (
          <Grid item container direction="column" spacing={1} justify="space-around" alignItems="flex-start">
            {this.renderOnDailyRepeat()}
            {this.renderOnWeeklyRepeat()}
          </Grid>
        );
      }
      case 'monthly': {
        return (
          <Grid item container direction="column" spacing={1} justify="space-around" alignItems="flex-start">
            {this.renderOnDailyRepeat()}
            {this.renderOnMonthlyRepeat()}
          </Grid>
        );
      }
      case 'yearly': {
        return (
          <Grid item container direction="column" spacing={1} justify="space-around" alignItems="flex-start">
            {this.renderOnDailyRepeat()}
            <Grid item container xs={12} direction="row" spacing={1} justify="flex-start" alignItems="flex-start">
              <Grid item xs={6}>
                {this.renderOnMonthlyRepeat()}
              </Grid>
              <Grid item xs={6}>
                {this.renderOnYearlyRepeat()}
              </Grid>
            </Grid>
          </Grid>
        );
      }
      default: {
        return null;
      }
    }
  };

  renderDueSetting = () => {
    const { translate, classes } = this.props;
    const {
      form: {
        endTime: { endDate, limit, checkedOrder },
      },
    } = this.state;
    const min = moment()
      .locale('en')
      .format('YYYY-MM-DD');
    return (
      <Grid item>
        <FormControl className={classes.formControl} fullWidth>
          <FormLabel>{translate('resources.notifysetting.due.label')}</FormLabel>
          <FormGroup
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              flexDirection: 'column',
            }}
          >
            <FormControlLabel
              control={<Checkbox checked={checkedOrder === 0 ? true : false} />}
              label={translate('resources.notifysetting.due.prefix.never')}
              onClick={this.handleDueCheckBox(0)}
            />
            <FormControl
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              <FormControlLabel
                control={<Checkbox checked={checkedOrder === 1 ? true : false} />}
                label={translate('resources.notifysetting.due.prefix.expireOn')}
                onClick={this.handleDueCheckBox(1)}
              />
              <TextField
                id="endDate"
                variant="outlined"
                type="date"
                value={endDate}
                disabled={checkedOrder !== 1 ? true : false}
                style={{ width: '170px' }}
                className={classes.textField}
                onChange={this.handleDueSetting}
                inputProps={{ min }}
                InputProps={{
                  style: { height: '40px' },
                }}
              />
            </FormControl>
            <FormControl
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              <FormControlLabel
                control={<Checkbox checked={checkedOrder === 2 ? true : false} />}
                label={translate('resources.notifysetting.due.prefix.expireAfter')}
                onClick={this.handleDueCheckBox(2)}
              />
              <TextField
                id="limit"
                type="number"
                variant="outlined"
                error={limit < 1 ? true : false}
                style={{ width: '170px' }}
                disabled={checkedOrder !== 2 ? true : false}
                value={limit}
                onChange={this.handleDueSetting}
                inputProps={{ min: 1 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {translate('resources.notifysetting.due.prefix.perTime')}
                    </InputAdornment>
                  ),
                  style: { height: '40px' },
                }}
              />
            </FormControl>
          </FormGroup>
        </FormControl>
      </Grid>
    );
  };

  handleDueCheckBox = order => () => {
    this.setState({ form: { ...this.state.form, endTime: { ...INIT_FORM.endTime, checkedOrder: order } } });
  };

  handleDueSetting = event => {
    const {
      form: {
        endTime: { checkedOrder },
      },
    } = this.state;
    switch (checkedOrder) {
      case 0: {
        this.setState({ form: { ...this.state.form, endTime: { checkedOrder: 0, noLimited: true } } });
        break;
      }
      case 1: {
        this.setState({ form: { ...this.state.form, endTime: { checkedOrder: 1, endDate: event.target.value } } });
        break;
      }
      case 2: {
        this.setState({
          form: { ...this.state.form, endTime: { checkedOrder: 2, limit: parseInt(event.target.value, 10) } },
        });
        break;
      }
    }
  };

  getExpireSetting = () => {
    const {
      form: {
        endTime: { checkedOrder, limit, endDate, noLimited },
      },
    } = this.state;
    switch (checkedOrder) {
      case 0: {
        return { noLimited };
      }
      case 1: {
        return { endDate };
      }
      case 2: {
        return { limit };
      }
    }
  };

  exportRecurrence = () => {
    const {
      form: { dailyTime, monthlyDay: validateTempDay, yearlyMonth: valiedateTempMonth, weeklyDay, countUnit, periodic },
    } = this.state;
    const monthlyDay = validateTempDay.join(',') || '*';
    const yearlyMonth = valiedateTempMonth.join(',') || '*';
    let cron = [];
    const timeTemp = moment(dailyTime, 'hh:mm');
    cron.push(timeTemp.format('mm') || '0');
    cron.push(timeTemp.format('hh') || '0');
    if (countUnit > 1) {
      switch (periodic) {
        case 'daily': {
          cron.push(`*/${countUnit}`);
          cron.push(yearlyMonth);
          break;
        }
        case 'monthly': {
          cron.push(monthlyDay);
          cron.push(`*/${countUnit}`);
        }
      }
    } else {
      cron.push(monthlyDay);
      cron.push(yearlyMonth);
    }
    const dayOfWeekSelected = Object.keys(weeklyDay)
      .filter(key => weeklyDay[key] === true)
      .join(',');
    cron.push(dayOfWeekSelected || '*');
    cron = cron.join(' ');
    this.props.handleRecurrenceSetting({
      cron,
      expire: this.getExpireSetting(),
    });
    this.props.toggleDialog();
    // return {
    //   repeat: cron,
    //   expire: this.getExpireSetting(),
    // };
  };

  renderPeriodic = () => {
    const { translate, classes } = this.props;
    const {
      form: { countUnit, periodic },
    } = this.state;
    return (
      <Grid item container direction="row" spacing={1} justify="flex-start" alignItems="center">
        <Grid item>Lặp lại mỗi:</Grid>
        {periodic === 'weekly' || periodic === 'yearly' ? (
          <Grid item>
            <TextField
              id="countUnit-disabled"
              defaultValue={1}
              value={1}
              disabled
              style={{ width: '80px' }}
              InputProps={{
                className: classes.input,
              }}
              type="number"
              variant="outlined"
            />
          </Grid>
        ) : (
          <Grid item>
            <TextField
              id="countUnit"
              value={countUnit}
              error={countUnit < 1}
              onChange={this.handleChange('countUnit')}
              style={{ width: '80px' }}
              InputProps={{
                className: classes.input,
              }}
              type="number"
              variant="outlined"
            />
          </Grid>
        )}
        <Grid item>
          <TextField
            variant="outlined"
            select
            value={periodic}
            onChange={this.resetForm}
            SelectProps={{
              classes: {
                root: classes.selectRoot,
                select: classes.select,
              },
            }}
          >
            {config.notifySetting.periodic.map((option, index) => (
              <MenuItem key={index} value={option.id}>
                {translate(option.name)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { translate, toggleDialog, showDialog } = this.props;
    return (
      <Dialog fullWidth maxWidth="md" open={showDialog} disableEnforceFocus={true}>
        <DialogTitle>{translate('resources.notifysetting.customRecurrence.label')}</DialogTitle>
        <DialogContent>
          <Grid container direction="column" spacing={1}>
            {this.renderPeriodic()}
            <Grid item container xs={12}>
              <Grid item xs={6}>
                {this.renderPeriodicSetting()}
              </Grid>
              <Grid item xs={6}>
                {this.renderDueSetting()}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <SaveButton onClick={this.exportRecurrence} />
          <Button label="resources.importgeogroups.modal.exit" onClick={toggleDialog}>
            <Cancel />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = () => ({
  input: {
    height: 40,
  },
  button: {
    height: 40,
  },
  selectRoot: {
    height: 40,
    display: 'table',
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
  },
  select: {
    height: 40,
    paddingTop: 0,
    paddingBottom: 0,
    display: 'table-cell',
    verticalAlign: 'middle',
  },
});

RecurrenceDialog.propTypes = {
  change: PropTypes.func,
  classes: PropTypes.any,
  crudGetMatching: PropTypes.func,
  dataProvider: PropTypes.func,
  fetchEnd: PropTypes.func,
  fetchStart: PropTypes.func,
  handleRecurrenceSetting: PropTypes.func,
  refreshView: PropTypes.func,
  repeat: PropTypes.object,
  reset: PropTypes.func,
  showDialog: PropTypes.bool,
  showNotification: PropTypes.func,
  submit: PropTypes.func,
  toggleDialog: PropTypes.func,
  translate: PropTypes.func,
};

const enhance = compose(
  withDataProvider,
  translate,
  withStyles(styles),
  connect(null, { submit, reset, fetchStart, fetchEnd, showNotification, refreshView, crudGetMatching }),
);

export default enhance(RecurrenceDialog);
