import React, { Component } from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  withStyles,
  withTheme,
  // Avatar,
  Checkbox,
  FormControlLabel,
  TextField,
} from '@material-ui/core';
import { withDataProvider, translate } from 'ra-loopback3';

// import { StatusIcon } from '../../styles/Icons';
import StatusItemBaseDma from './StatusItemBaseDma';
import StatusItemBaseFlowLogger from './StatusItemBaseFlowLogger';

const styles = theme => {
  return {
    header: {
      backgroundColor: theme.palette.primary.main,
      color: `${theme.palette.primary.contrastText} !important`,
    },
    subheader: {
      color: theme.palette.grey[400],
    },
    chip: {
      height: '18px',
    },
    chipIcon: {
      backgroundColor: theme.palette.grey[300],
      color: theme.palette.primary.main,
      height: '18px',
      width: '18px',
    },
    left: {
      float: 'left',
    },
    statusIcon: {
      backgroundColor: theme.palette.primary.main,
    },
    iconMeno: {
      width: 24,
      height: 24,
    },
    dmaItem: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  };
};
class LatestStatus extends Component {
  getDmaPadding = dma => {
    return (dma.level * 2 - 2) * this.props.theme.spacing(1);
  };

  onDmaOver = item => {
    const focus = { id: item.id, position: item.center || item.node, type: 'Dma' };
    this.props.onChangeFocus(focus);
  };
  onLoggerOver = item => {
    const focus = { id: item.id, position: item.center || item.node, type: 'Material' };
    this.props.onChangeFocus(focus);
  };

  render() {
    const {
      classes,
      theme,
      filter,
      onChangeFilter,
      currentStatus,
      baseOnFlowLogger,
      onChangeDisPlay,
      translate,
    } = this.props;
    return (
      <Card style={{ width: '100%' }}>
        <CardHeader
          // avatar={
          //   <Avatar className={classes.statusIcon}>
          //     <StatusIcon />
          //   </Avatar>
          // }
          title={
            <TextField
              id="standard-basic"
              label={translate('generic.search')}
              value={filter}
              onChange={e => onChangeFilter(e.target.value)}
            />
          }
          subheader={
            <div>
              <FormControlLabel
                label={translate('generic.widgets.flowLogger')}
                control={<Checkbox onChange={onChangeDisPlay} checked={baseOnFlowLogger} />}
              />
            </div>
          }
        />
        <CardContent className={classes.dmaItem}>
          <Divider />
          {baseOnFlowLogger ? (
            <StatusItemBaseFlowLogger
              currentStatus={currentStatus}
              classes={classes}
              filter={filter}
              theme={theme}
              onDmaOver={this.onDmaOver}
              onLoggerOver={this.onLoggerOver}
              getDmaPadding={this.getDmaPadding}
            />
          ) : (
            <StatusItemBaseDma
              currentStatus={currentStatus}
              classes={classes}
              filter={filter}
              theme={theme}
              onDmaOver={this.onDmaOver}
              getDmaPadding={this.getDmaPadding}
            />
          )}
        </CardContent>
      </Card>
    );
  }
}
LatestStatus.propTypes = {
  dataProvider: PropTypes.func,
  theme: PropTypes.object,
  classes: PropTypes.object,
  currentStatus: PropTypes.array,
  baseOnFlowLogger: PropTypes.bool,
  filter: PropTypes.string,
  onChangeFilter: PropTypes.func,
  onChangeDisPlay: PropTypes.func,
  onChangeFocus: PropTypes.func,
  translate: PropTypes.func,
};
const enhance = compose(withStyles(styles), withTheme, withDataProvider, translate);
export default enhance(LatestStatus);
