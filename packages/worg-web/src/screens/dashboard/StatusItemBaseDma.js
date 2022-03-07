import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Tooltip,
  Chip,
  Avatar,
  Divider,
  List,
} from '@material-ui/core';
import { translate } from 'ra-loopback3';
import config from '../../Config';
import { NormalWaterSourceIcon, AlertWaterSourceIcon, LogTimeIcon, WaterSourceIcon } from '../../styles/Icons';

const translateColor = alert => {
  switch (alert) {
    case 1:
      return config.color.status.criticalAlert;
    case 2:
      return config.color.status.alert;
    case 3:
      return config.color.status.normal;
    default:
      break;
  }
};

const StatusItemBaseDma = ({ currentStatus, classes, translate, theme, getDmaPadding }) => {
  if (!currentStatus || currentStatus.length < 1 || !currentStatus[0].logTime) {
    return null;
  }
  return (
    <List component="div" disablePadding>
      {currentStatus.map(waterSource => (
        <Fragment key={waterSource.waterSourceId}>
          <ListItem button style={{ paddingLeft: getDmaPadding({ level: 1 }) }}>
            <ListItemIcon>
              <WaterSourceIcon />
            </ListItemIcon>
            <ListItemText style={{ paddingLeft: theme.spacing(1) }} primary={<b>{waterSource.waterSourceName}</b>} />
            <ListItemSecondaryAction>
              <Tooltip title={translate('generic.totalAlert')}>
                <Chip
                  avatar={
                    waterSource.totalAlert == 0 ? (
                      <Avatar className={classes.chipIcon}>
                        <NormalWaterSourceIcon style={{ color: translateColor(3) }} />
                      </Avatar>
                    ) : (
                      <Avatar className={classes.chipIcon}>
                        <AlertWaterSourceIcon style={{ color: translateColor(2) }} />
                      </Avatar>
                    )
                  }
                  className={classes.chip}
                  label={waterSource.totalAlert}
                />
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider style={{ marginLeft: getDmaPadding({ level: 2 }) + theme.spacing(1) }} />

          <ListItem
            button
            onClick={() => this.showStatistic(waterSource.waterSourceName)}
            className={classes.nested}
            style={{ paddingLeft: getDmaPadding({ level: 2 }) + theme.spacing(1) }}
          >
            <ListItemSecondaryAction>
              {waterSource.logTime ? (
                <Tooltip title={translate('generic.lastSignal')}>
                  <Chip
                    avatar={
                      <Avatar className={classes.chipIcon}>
                        <LogTimeIcon />
                      </Avatar>
                    }
                    className={classes.chip}
                    label={moment(waterSource.logTime).format('YYYY-MM-DD HH:mm')}
                    style={{ color: translateColor(waterSource.alert) }}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={translate('generic.lastSignal')}>
                  <Chip
                    avatar={
                      <Avatar className={classes.chipIcon}>
                        <LogTimeIcon />
                      </Avatar>
                    }
                    className={classes.chip}
                    style={{ color: theme.status.critical }}
                    label={translate('generic.noLogData')}
                  />
                </Tooltip>
              )}
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem
            button
            onClick={() => this.showStatistic(waterSource.waterSourceName)}
            className={classes.nested}
            style={{ paddingLeft: getDmaPadding({ level: 2 }) + theme.spacing(1) }}
          >
            <ListItemSecondaryAction>
              {waterSource.totalFlowRate ? (
                <Tooltip title={translate('generic.totalFlowRate')}>
                  <Chip
                    className={classes.chip}
                    label={translate('generic.totalFlowRate') + ': ' + `${waterSource.totalFlowRate}`}
                    style={{ color: translateColor(waterSource.alert) }}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={translate('generic.lastSignal')}>
                  <Chip
                    className={classes.chip}
                    style={{ color: theme.status.critical }}
                    label={translate('generic.noLogData')}
                  />
                </Tooltip>
              )}
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem
            button
            onClick={() => this.showStatistic(waterSource.waterSourceName)}
            className={classes.nested}
            style={{ paddingLeft: getDmaPadding({ level: 2 }) + theme.spacing(1) }}
          >
            <ListItemSecondaryAction>
              {waterSource.avgNtu ? (
                <Tooltip title={translate('generic.turbidityAvg')}>
                  <Chip
                    className={classes.chip}
                    label={translate('generic.turbidityAvg') + ': ' + `${waterSource.avgNtu}`}
                    style={{ color: translateColor(waterSource.alert) }}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={translate('generic.turbidityAvg')}>
                  <Chip
                    className={classes.chip}
                    style={{ color: theme.status.critical }}
                    label={translate('generic.turbidityAvg')}
                  />
                </Tooltip>
              )}
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem
            button
            onClick={() => this.showStatistic(waterSource.waterSourceName)}
            className={classes.nested}
            style={{ paddingLeft: getDmaPadding({ level: 2 }) + theme.spacing(1) }}
          >
            <ListItemSecondaryAction>
              {waterSource.avgPh ? (
                <Tooltip title={translate('generic.phAvg')}>
                  <Chip
                    className={classes.chip}
                    label={translate('generic.phAvg') + ': ' + `${waterSource.avgPh}`}
                    style={{ color: translateColor(waterSource.alert) }}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={translate('generic.phAvg')}>
                  <Chip
                    className={classes.chip}
                    style={{ color: theme.status.critical }}
                    label={translate('generic.noLogData')}
                  />
                </Tooltip>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        </Fragment>
      ))}
    </List>
  );
};

StatusItemBaseDma.propTypes = {
  getDmaPadding: PropTypes.func,
  currentStatus: PropTypes.array,
  classes: PropTypes.object,
  theme: PropTypes.object,
  translate: PropTypes.func,
};

const enhance = compose(translate);
export default enhance(StatusItemBaseDma);
