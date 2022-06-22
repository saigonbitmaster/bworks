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
  {waterSourceName: "Write Cardano ESROW smart contract", employer: "Employer name/wallet address: Peter", bidValue: "Bid at value (ADA): 120"},
  {waterSourceName: "Create Cardano Native and NFT token", employer: "Employer name/wallet address: addr_test1qrtzr4zdlc3kw7mv4mtg2v3f3q592za2psnpmvsm4x9t0t43ge73vmf7xvkn23tkyq30gd2jtlgztf3rw0mtvkjzv4vqcv0ejv", bidValue: "Bid value (ADA): 120"},
  {waterSourceName: "Build Cardano testNet node", employer: "Employer name/wallet address: Jenny", bidValue: "Bid at value (ADA): 120"},
  {waterSourceName: "Develop android/IOS walllet", employer: "Employer name/wallet address: Jackson", bidValue: "Bid at value (ADA): 120"}
]
  return (
    <List component="div" disablePadding>
      {currentStatus1.map(waterSource => (
        <Fragment key={waterSource.waterSourceName}>
          <ListItem button style={{ paddingLeft: getDmaPadding({ level: 1 }) }} key={waterSource.waterSourceName}>
            <ListItemIcon>
              <WaterSourceIcon />
            </ListItemIcon>
            <ListItemText style={{ paddingLeft: theme.spacing(1) }} primary={<b>{waterSource.waterSourceName}</b>} />
            <ListItemSecondaryAction>
              <Tooltip title={translate('generic.emp.widget.bidDate')}>
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
            key={waterSource.logTime}
          >
            <ListItemSecondaryAction>
            
                <Fragment key={waterSource.waterSourceName}>
                  <Tooltip title={translate('generic.emp.widget.bidDate')}>
                    <Chip
                      avatar={
                        <Avatar className={classes.chipIcon}>
                          <LogTimeIcon />
                        </Avatar>
                      }
                      className={classes.chip}
                      label={moment().format('YYYY-MM-DD HH:mm')}
                      style={{ color: translateColor(waterSource.alert) }}
                    />
                  </Tooltip>
                </Fragment>
             
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem
            button
            onClick={() => this.showStatistic(waterSource.waterSourceName)}
            className={classes.nested}
            style={{ paddingLeft: getDmaPadding({ level: 2 }) + theme.spacing(1) }}
            key={waterSource.totalFlowRate}
          >
            <ListItemSecondaryAction>
              
                <Fragment key={waterSource.waterSourceName}>
                  <Tooltip title={translate('generic.emp.widget.employer')}>
                    <Chip
                      className={classes.chip}
                      label={waterSource.employer}
                      style={{ color: translateColor(waterSource.alert) }}
                    />
                  </Tooltip>
                </Fragment>
             
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem
            button
            onClick={() => this.showStatistic(waterSource.waterSourceName)}
            className={classes.nested}
            style={{ paddingLeft: getDmaPadding({ level: 2 }) + theme.spacing(1) }}
            key={waterSource.avgNtu}
          >
            <ListItemSecondaryAction>
             
                <Fragment key={waterSource.waterSourceName}>
                  <Tooltip title={translate('generic.emp.widget.bidValue')}>
                    <Chip
                      className={classes.chip}
                      label={waterSource.bidValue}
                      style={{ color: translateColor(waterSource.alert) }}
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

