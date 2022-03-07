import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Chip,
  Avatar,
  Divider,
  List,
} from '@material-ui/core';
import { translate } from 'ra-loopback3';
import { PressureIcon, FlowRateIcon, LogTimeIcon } from '../../styles/Icons';

const StatusItemBaseDma = ({ currentStatus, classes, translate, theme, getDmaPadding }) => (
  <List>
    {currentStatus &&
      currentStatus.map((dma, index) => (
        <Fragment key={dma.id}>
          <ListItem button style={{ paddingLeft: getDmaPadding(dma) }} key={dma.id}>
            <ListItemText style={{ paddingLeft: theme.spacing(1) }} primary={dma.name} />
            <ListItemSecondaryAction>
              {dma.dmaData.logTime && dma.dmaData.logTime ? (
                <Fragment>
                  <Tooltip title={translate('generic.lastSignal')}>
                    <Chip
                      avatar={
                        <Avatar className={classes.chipIcon}>
                          <LogTimeIcon />
                        </Avatar>
                      }
                      className={classes.chip}
                      label={moment(dma.dmaData.logTime).fromNow()}
                      style={{ color: theme.status[dma.dmaData.timeStatus] }}
                    />
                  </Tooltip>
                  <br />
                  <Tooltip title={'Áp lực (Bar)'}>
                    <Chip
                      avatar={
                        <Avatar className={classes.chipIcon}>
                          <PressureIcon />
                        </Avatar>
                      }
                      style={{ color: theme.status[dma.dmaData.status] }}
                      className={classes.chip}
                      label={dma.dmaData.pressure}
                    />
                  </Tooltip>
                  <Tooltip title={'Lưu lượng tức thời (m3/h)'}>
                    <Chip
                      avatar={
                        <Avatar className={classes.chipIcon}>
                          <FlowRateIcon />
                        </Avatar>
                      }
                      className={classes.chip}
                      style={{ color: theme.status.ok }}
                      label={dma.dmaData.flowRate}
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
          {index < currentStatus.length - 1 && <Divider />}
        </Fragment>
      ))}
  </List>
);

StatusItemBaseDma.propTypes = {
  getDmaPadding: PropTypes.func,
  currentStatus: PropTypes.array,
  classes: PropTypes.object,
  theme: PropTypes.object,
  translate: PropTypes.func,
};

const enhance = compose(translate);
export default enhance(StatusItemBaseDma);
