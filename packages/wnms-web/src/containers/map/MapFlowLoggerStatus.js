import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { MapMaterialNode, withDataProvider } from 'ra-loopback3';
import { withTheme, withStyles, Chip, Avatar } from '@material-ui/core';
import { iconToMap, PressureIcon } from '../../styles/Icons';

const styles = theme => ({
  chip: {
    height: '18px',
    opacity: 0.8,
  },
  chipIcon: {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.primary.main,
    height: '18px',
    width: '18px',
  },
});
class MapDmaStatus extends Component {
  render() {
    const { currentStatus = [], theme, dataProvider, classes } = this.props;
    let maps = google.maps; // eslint-disable-line
    return (
      <Fragment>
        {currentStatus.map(dma => {
          if (dma.flowLoggers && dma.flowLoggers.length) {
            return dma.flowLoggers.map(logger => {
              let status = logger.timeStatus !== 'ok' ? logger.timeStatus : logger.status;
              let color = theme.status[status];
              return (
                <MapMaterialNode
                  key={logger.id}
                  data={logger}
                  model="FlowLogger"
                  dataProvider={dataProvider}
                  label={
                    <Chip
                      avatar={
                        <Avatar className={classes.chipIcon}>
                          <PressureIcon />
                        </Avatar>
                      }
                      style={{ backgroundColor: theme.status[logger.status] }}
                      className={classes.chip}
                      label={logger.pressure}
                    />
                  }
                  labelAnchor={new maps.Point(24, 0)}
                  icon={iconToMap({ iconElement: 'FlowLoggerIcon', color })}
                />
              );
            });
          }
          return null;
        })}
      </Fragment>
    );
  }
}
MapDmaStatus.propTypes = {
  currentStatus: PropTypes.array,
  theme: PropTypes.object,
  dataProvider: PropTypes.func,
  classes: PropTypes.object,
};
const enhance = compose(withStyles(styles), withTheme, withDataProvider);
export default enhance(MapDmaStatus);
