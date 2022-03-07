import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  withTheme,
  Grid,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { compose } from 'recompose';
import { translate } from 'ra-loopback3';
import moment from 'moment-timezone';

class PressureNotifyList extends Component {
  static propTypes = {
    translate: PropTypes.func,
    data: PropTypes.object.isRequired,
    theme: PropTypes.object,
    durationType: PropTypes.string,
  };

  render() {
    const { translate, theme, data } = this.props;
    if (!data || !data.length) {
      return (
        <Grid container style={{ marginLeft: 64, marginRight: 32 }}>
          <Grid item xs={12}>
            <Typography variant="title" style={{ color: theme.palette.error.main }}>
              {translate('generic.warn')} - {`(${translate('generic.noWarn')})`}
            </Typography>
          </Grid>
        </Grid>
      );
    }
    // console.log(theme);
    if (this.props) {
      return (
        <ExpansionPanel style={{ marginLeft: 32, marginRight: 32 }}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Typography variant="title" style={{ color: theme.palette.error.main }}>
              {translate('generic.warn')} - {`(${data.length})`}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{translate('generic.typeTime.time')}</TableCell>
                  <TableCell>{translate('generic.nameWithUnits.pressure')}</TableCell>
                  <TableCell>{translate('generic.warn')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(item => (
                  <TableRow key={item.time}>
                    <TableCell>{`${moment(item.time).format('L LT')}`}</TableCell>
                    <TableCell>{item.value}</TableCell>
                    <TableCell>
                      <Typography variant="body" style={{ color: theme.status[item.type] || theme.palette.error.main }}>
                        {translate(`generic.conclusionPressure.${item.type}`)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    }
  }
}

const EnhancePressureNotifyList = compose(translate, withTheme)(PressureNotifyList);

export default EnhancePressureNotifyList;
