import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  ListItem,
  ListItemText,
  Tooltip,
  Chip,
  Avatar,
  Divider,
  List,
  ListItemSecondaryAction,
  ListItemIcon,
} from '@material-ui/core';
import moment from 'moment-timezone';
import { translate } from 'ra-loopback3';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push as pushAction } from 'react-router-redux';
import { WaterSourceIcon, LogTimeIcon, FlowLoggerIcon } from '../../styles/Icons';
import config from '../../Config';

class StatusItemBaseFlowLogger extends Component {
  showStatistic = id => {
    this.props.push(`statisticFlowLogger/${id}`);
  };

  translateColor(alert) {
    switch (alert) {
      case 1:
        return config.color.status.criticalAlert;
      // break;
      case 2:
        return config.color.status.alert;
      // break;
      case 3:
        return config.color.status.normal;
      // break;
      default:
        break;
    }
  }
  render() {
    const { currentStatus, classes, theme, getDmaPadding, translate } = this.props;
    if (!currentStatus[0].dataLoggers || currentStatus[0].dataLoggers.length < 1) {
      return null;
    }
    return (
      <List component="div" disablePadding>
        {currentStatus.map((waterSource, index) => (
          <Fragment key={waterSource.waterSourceName}>
            <ListItem button style={{ paddingLeft: getDmaPadding({ level: 1 }) }} key={waterSource.waterSourceName}>
              <ListItemIcon>
                <WaterSourceIcon />
              </ListItemIcon>
              <ListItemText style={{ paddingLeft: theme.spacing(1) }} primary={<b>{waterSource.waterSourceName}</b>} />
              <ListItemSecondaryAction>
                <Tooltip title={translate('generic.totalDataLogger')}>
                  <Chip
                    avatar={
                      <Avatar className={classes.chipIcon}>
                        <FlowLoggerIcon />
                      </Avatar>
                    }
                    className={classes.chip}
                    label={waterSource.dataLoggers.length}
                  />
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
            {waterSource.dataLoggers.length > 0 && (
              <List component="div" disablePadding>
                {waterSource.dataLoggers.map(dataLogger => (
                  <Fragment key={dataLogger._id}>
                    <Divider style={{ marginLeft: getDmaPadding({ level: 2 }) + theme.spacing(1) }} />
                    <ListItem
                      button
                      onClick={() => this.showStatistic(dataLogger._id)}
                      className={classes.nested}
                      style={{ paddingLeft: getDmaPadding({ level: 2 }) + theme.spacing(1) }}
                      key={dataLogger._id}
                    >
                      <ListItemText
                        component="div"
                        style={{ paddingLeft: theme.spacing(1) }}
                        primary={dataLogger.dataLoggerName || translate('generic.noNaming')}
                      />

                      <ListItemSecondaryAction>
                        {dataLogger.logTime ? (
                          <Fragment>
                            <Tooltip title={translate('generic.lastSignal')}>
                              <Chip
                                avatar={
                                  <Avatar className={classes.chipIcon}>
                                    <LogTimeIcon />
                                  </Avatar>
                                }
                                className={classes.chip}
                                label={moment(dataLogger.logTime).format('YYYY-MM-DD HH:mm')}
                                style={{ color: this.translateColor(dataLogger.alert) }}
                              />
                            </Tooltip>
                          </Fragment>
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
                      onClick={() => this.showStatistic(dataLogger._id)}
                      className={classes.nested}
                      style={{ paddingLeft: getDmaPadding({ level: 2 }) + theme.spacing(1) }}
                      key={dataLogger._id}
                    >
                      <ListItemSecondaryAction>
                        {dataLogger.ntu ? (
                          <Fragment>
                            <Tooltip title={translate('generic.turbidity')}>
                              <Chip
                                className={classes.chip}
                                label={translate('generic.turbidity') + ': ' + `${dataLogger.ntu}`}
                                style={{ color: this.translateColor(dataLogger.alert) }}
                              />
                            </Tooltip>
                          </Fragment>
                        ) : (
                          <Tooltip title={translate('generic.turbidity')}>
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
                      onClick={() => this.showStatistic(dataLogger._id)}
                      className={classes.nested}
                      style={{ paddingLeft: getDmaPadding({ level: 2 }) + theme.spacing(1) }}
                      key={dataLogger._id}
                    >
                      <ListItemSecondaryAction>
                        {dataLogger.ph ? (
                          <Fragment>
                            <Tooltip title={translate('generic.ph')}>
                              <Chip
                                className={classes.chip}
                                label={translate('generic.ph') + ': ' + `${dataLogger.ph}`}
                                style={{ color: this.translateColor(dataLogger.alert) }}
                              />
                            </Tooltip>
                          </Fragment>
                        ) : (
                          <Tooltip title={translate('generic.ph')}>
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
                      onClick={() => this.showStatistic(dataLogger._id)}
                      className={classes.nested}
                      style={{ paddingLeft: getDmaPadding({ level: 2 }) + theme.spacing(1) }}
                      key={dataLogger._id}
                    >
                      <ListItemSecondaryAction>
                        {dataLogger.flowRate ? (
                          <Fragment>
                            <Tooltip title={translate('generic.flowRate')}>
                              <Chip
                                className={classes.chip}
                                label={translate('generic.flowRate') + ': ' + `${dataLogger.flowRate}`}
                                style={{ color: this.translateColor(dataLogger.alert) }}
                              />
                            </Tooltip>
                          </Fragment>
                        ) : (
                          <Tooltip title={translate('generic.flowRate')}>
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
            )}
            {index < currentStatus.length - 1 && <Divider style={{ marginLeft: getDmaPadding({ level: 1 }) }} />}
          </Fragment>
        ))}
      </List>
    );
  }
}

StatusItemBaseFlowLogger.propTypes = {
  translate: PropTypes.func,
  getDmaPadding: PropTypes.func,
  currentStatus: PropTypes.array,
  classes: PropTypes.object,
  theme: PropTypes.object,
  push: PropTypes.func,
};

const enhance = compose(translate, connect(null, { push: pushAction }));
export default enhance(StatusItemBaseFlowLogger);
