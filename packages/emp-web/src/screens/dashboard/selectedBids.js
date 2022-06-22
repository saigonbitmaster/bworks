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

const SelectedBids = ({ currentStatus, classes, translate, theme, getPadding }) => {
  // console.log('currentStatus', currentStatus);
  // if (!currentStatus || currentStatus.length < 1 || !currentStatus[0].logTime) {
  //   return null;
  // }
let currentStatus1 = [
  {bidName: "Write Cardano ESROW smart contract", bidder: "Candidate name/wallet address: Peter", bidValue: "Bid at value (ADA): 120"},
  {bidName: "Create Cardano Native and NFT token", bidder: "Candidate name/wallet address: addr_test1qrtzr4zdlc3kw7mv4mtg2v3f3q592za2psnpmvsm4x9t0t43ge73vmf7xvkn23tkyq30gd2jtlgztf3rw0mtvkjzv4vqcv0ejv", bidValue: "Bid value (ADA): 120"},
  {bidName: "Build Cardano testNet node", bidder: "Candidate name/wallet address: Jenny", bidValue: "Bid at value (ADA): 120"},
  {bidName: "Develop android/IOS walllet", bidder: "Candidate name/wallet address: Jackson", bidValue: "Bid at value (ADA): 120"}
]
  return (
    <List component="div" disablePadding>
      {currentStatus1.map(bid => (
        <Fragment key={bid.bidName}>
          <ListItem button style={{ paddingLeft: getPadding({ level: 1 }) }} key={bid.bidName}>
            <ListItemIcon>
              <WaterSourceIcon />
            </ListItemIcon>
            <ListItemText style={{ paddingLeft: theme.spacing(1) }} primary={<b>{bid.bidName}</b>} />
            <ListItemSecondaryAction>
              <Tooltip title={translate('generic.totalAlert')}>
                <Chip
                  avatar={
                    bid.totalAlert == 0 ? (
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
                  label={bid.totalAlert}
                />
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider style={{ marginLeft: getPadding({ level: 2 }) + theme.spacing(1) }} />

          <ListItem
            button
            onClick={() => this.showStatistic(bid.bidName)}
            className={classes.nested}
            style={{ paddingLeft: getPadding({ level: 2 }) + theme.spacing(1) }}
            key={bid.logTime}
          >
            <ListItemSecondaryAction>
            
                <Fragment key={bid.bidName}>
                  <Tooltip title={translate('generic.lastSignal')}>
                    <Chip
                      avatar={
                        <Avatar className={classes.chipIcon}>
                          <LogTimeIcon />
                        </Avatar>
                      }
                      className={classes.chip}
                      label={moment().format('YYYY-MM-DD HH:mm')}
                      style={{ color: translateColor(bid.alert) }}
                    />
                  </Tooltip>
                </Fragment>
             
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem
            button
            onClick={() => this.showStatistic(bid.bidName)}
            className={classes.nested}
            style={{ paddingLeft: getPadding({ level: 2 }) + theme.spacing(1) }}
            key={bid.totalFlowRate}
          >
            <ListItemSecondaryAction>
              
                <Fragment key={bid.bidName}>
                  <Tooltip title={translate('generic.totalFlowRate')}>
                    <Chip
                      className={classes.chip}
                      label={bid.bidder}
                      style={{ color: translateColor(bid.alert) }}
                    />
                  </Tooltip>
                </Fragment>
             
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem
            button
            onClick={() => this.showStatistic(bid.bidName)}
            className={classes.nested}
            style={{ paddingLeft: getPadding({ level: 2 }) + theme.spacing(1) }}
            key={bid.avgNtu}
          >
            <ListItemSecondaryAction>
             
                <Fragment key={bid.bidName}>
                  <Tooltip title={translate('generic.turbidityAvg')}>
                    <Chip
                      className={classes.chip}
                      label={bid.bidValue}
                      style={{ color: translateColor(bid.alert) }}
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

SelectedBids.propTypes = {
  getPadding: PropTypes.func,
  currentStatus: PropTypes.array,
  classes: PropTypes.object,
  theme: PropTypes.object,
  translate: PropTypes.func,
};

const enhance = compose(translate);
export default enhance(SelectedBids);
