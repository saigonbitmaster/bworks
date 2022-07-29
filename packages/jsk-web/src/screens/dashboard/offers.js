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
};

const Offers = ({ currentStatus, classes, translate, theme, getDmaPadding }) => {
  // console.log('currentStatus', currentStatus);
  // if (!currentStatus || currentStatus.length < 1 || !currentStatus[0].logTime) {
  //   return null;
  // }
let currentStatus1 = [
  {jobName: "Write Cardano ESROW smart contract", employer: "Employer name/wallet address: Peter", bidValue: "Bid at value (ADA): 120"},
  {jobName: "Create Cardano Native and NFT token", employer: "Employer name/wallet address: addr_test1qrtzr4zdlc3kw7mv4mtg2v3f3q592za2psnpmvsm4x9t0t43ge73vmf7xvkn23tkyq30gd2jtlgztf3rw0mtvkjzv4vqcv0ejv", bidValue: "Bid value (ADA): 120"},
  {jobName: "Build Cardano testNet node", employer: "Employer name/wallet address: Jenny", bidValue: "Bid at value (ADA): 120"},
  {jobName: "Develop android/IOS walllet", employer: "Employer name/wallet address: Jackson", bidValue: "Bid at value (ADA): 120"}
]
  return (
    <List component="div" disablePadding>
      {currentStatus1.map(job => (
        <Fragment key={job.jobName}>
          <ListItem button style={{ paddingLeft: getDmaPadding({ level: 1 }) }} key={job.jobName}>
            <ListItemIcon>
              <WaterSourceIcon />
            </ListItemIcon>
            <ListItemText style={{ paddingLeft: theme.spacing(1) }} primary={<b>{job.jobName}</b>} />
            <ListItemSecondaryAction>
              <Tooltip title={translate('generic.emp.widget.bidDate')}>
                <Chip
                  avatar={
                    job.totalAlert == 0 ? (
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
                  label={job.totalAlert}
                />
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider style={{ marginLeft: getDmaPadding({ level: 2 }) + theme.spacing(1) }} />

          <ListItem
            button
            onClick={() => this.showStatistic(job.jobName)}
            className={classes.nested}
            style={{ paddingLeft: getDmaPadding({ level: 2 }) + theme.spacing(1) }}
            key={job.logTime}
          >
            <ListItemSecondaryAction>
            
                <Fragment key={job.jobName}>
                  <Tooltip title={translate('generic.emp.widget.bidDate')}>
                    <Chip
                      avatar={
                        <Avatar className={classes.chipIcon}>
                          <LogTimeIcon />
                        </Avatar>
                      }
                      className={classes.chip}
                      label={moment().format('YYYY-MM-DD HH:mm')}
                      style={{ color: translateColor(job.alert) }}
                    />
                  </Tooltip>
                </Fragment>
             
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem
            button
            onClick={() => this.showStatistic(job.jobName)}
            className={classes.nested}
            style={{ paddingLeft: getDmaPadding({ level: 2 }) + theme.spacing(1) }}
            key={job.jobName}
          >
            <ListItemSecondaryAction>
              
                <Fragment key={job.jobName}>
                  <Tooltip title={translate('generic.emp.widget.employer')}>
                    <Chip
                      className={classes.chip}
                      label={job.employer}
                      style={{ color: translateColor(job.alert) }}
                    />
                  </Tooltip>
                </Fragment>
             
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem
            button
            onClick={() => this.showStatistic(job.jobName)}
            className={classes.nested}
            style={{ paddingLeft: getDmaPadding({ level: 2 }) + theme.spacing(1) }}
            key={job.avgNtu}
          >
            <ListItemSecondaryAction>
             
                <Fragment key={job.jobName}>
                  <Tooltip title={translate('generic.emp.widget.bidValue')}>
                    <Chip
                      className={classes.chip}
                      label={job.bidValue}
                      style={{ color: translateColor(job.alert) }}
                    />
                  </Tooltip>
                </Fragment>
             
            </ListItemSecondaryAction>
          </ListItem>
        
        </Fragment>
      ))}
    </List>
  );
};

Offers.propTypes = {
  getDmaPadding: PropTypes.func,
  currentStatus: PropTypes.array,
  classes: PropTypes.object,
  theme: PropTypes.object,
  translate: PropTypes.func,
};

const enhance = compose(translate);
export default enhance(Offers);

