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
  // ListItemIcon,
} from '@material-ui/core';
import { truncate } from 'lodash';
import moment from 'moment-timezone';
import { translate, addSpaceByLevel } from 'ra-loopback3';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push as pushAction } from 'react-router-redux';
import { PressureIcon, FlowRateIcon, LogTimeIcon, FlowLoggerIcon } from '../../styles/Icons';

class StatusItemBaseFlowLogger extends Component {
  showStatistic = id => {
    this.props.push(`statisticFlowLogger/${id}`);
  };

  viewKey = key => {
    const len = key.length;
    if (key.length > 6) {
      return `...${key.substr(len - 4)}`;
    }
    return key || 'N/A';
  };

  render() {
    const { currentStatus, classes, theme, getDmaPadding, onDmaOver, onLoggerOver, translate } = this.props;
    const __this = this;
    return (
      <List component="div" disablePadding>
        {currentStatus.map((dma, index) => (
          <Fragment key={dma.id}>
            <ListItem
              button
              onMouseOver={() => onDmaOver(dma)}
              onMouseLeave={() => onDmaOver({})}
              style={{ paddingLeft: 0 }}
              key={dma.id}
            >
              {/* <ListItemIcon style={{ minWidth: 24 }}>
                <DmaIcon />
              </ListItemIcon> */}
              <ListItemText style={{ paddingLeft: 0 }} primary={<b>{addSpaceByLevel(dma) + dma.name}</b>} />
              <ListItemSecondaryAction>
                <Chip
                  avatar={
                    <Avatar className={classes.chipIcon}>
                      <FlowLoggerIcon />
                    </Avatar>
                  }
                  className={classes.chip}
                  label={dma.flowLoggers.length}
                />
              </ListItemSecondaryAction>
            </ListItem>
            {dma.flowLoggers.length > 0 && (
              <List component="div" disablePadding>
                {dma.flowLoggers.map(flowLogger => (
                  <Fragment key={flowLogger.id}>
                    <Divider style={{ marginLeft: getDmaPadding(dma) + theme.spacing(1) }} />
                    <ListItem
                      button
                      onClick={() => __this.showStatistic(flowLogger.id)}
                      onMouseOver={() => onLoggerOver(flowLogger)}
                      onMouseLeave={() => onLoggerOver({})}
                      className={classes.nested}
                      style={{ paddingLeft: getDmaPadding(dma) + theme.spacing(1) }}
                      key={flowLogger.id}
                    >
                      <ListItemText
                        component="div"
                        style={{ paddingLeft: theme.spacing(1) }}
                        primary={`${truncate(flowLogger.name, { length: 10 })} - ${__this.viewKey(
                          flowLogger.optionKey,
                        )}`}
                      />
                      <ListItemSecondaryAction>
                        {flowLogger.logTime ? (
                          <Fragment>
                            <Tooltip title={translate('generic.lastSignal')}>
                              <Chip
                                avatar={
                                  <Avatar className={classes.chipIcon}>
                                    <LogTimeIcon />
                                  </Avatar>
                                }
                                className={classes.chip}
                                label={moment(flowLogger.logTime).fromNow()}
                                style={{ color: theme.status[flowLogger.timeStatus] }}
                              />
                            </Tooltip>
                            <br />
                            <Tooltip title={translate('generic.nameWithUnits.pressure')}>
                              <Chip
                                avatar={
                                  <Avatar className={classes.chipIcon}>
                                    <PressureIcon />
                                  </Avatar>
                                }
                                style={{ color: theme.status[flowLogger.status] }}
                                className={classes.chip}
                                label={flowLogger.pressure}
                              />
                            </Tooltip>
                            <Tooltip title={translate('generic.nameWithUnits.flowRate')}>
                              <Chip
                                avatar={
                                  <Avatar className={classes.chipIcon}>
                                    <FlowRateIcon />
                                  </Avatar>
                                }
                                className={classes.chip}
                                style={{ color: theme.status.ok }}
                                label={flowLogger.flowRate}
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
                  </Fragment>
                ))}
              </List>
            )}
            {index < currentStatus.length - 1 && <Divider style={{ marginLeft: getDmaPadding(dma) }} />}
          </Fragment>
        ))}
      </List>
    );
  }
}

StatusItemBaseFlowLogger.propTypes = {
  translate: PropTypes.func,
  getDmaPadding: PropTypes.func,
  onLoggerOver: PropTypes.func,
  onDmaOver: PropTypes.func,
  currentStatus: PropTypes.array,
  classes: PropTypes.object,
  theme: PropTypes.object,
  push: PropTypes.func,
};

const enhance = compose(translate, connect(null, { push: pushAction }));
export default enhance(StatusItemBaseFlowLogger);
