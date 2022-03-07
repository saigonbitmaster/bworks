import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate } from 'ra-loopback3';
import find from 'lodash/find';
import { withStyles } from '@material-ui/core/styles';
import MapControl from '../../containers/map/MapControl';
// eslint-disable-next-line
const styles = theme => ({
  circleActive: {
    height: '10px',
    width: '10px',
    backgroundColor: 'blue',
    borderRadius: '50%',
    display: 'inline-block',
  },
  circlePause: {
    height: '10px',
    width: '10px',
    backgroundColor: 'orange',
    borderRadius: '50%',
    display: 'inline-block',
  },
  circleStop: {
    height: '10px',
    width: '10px',
    backgroundColor: 'red',
    borderRadius: '50%',
    display: 'inline-block',
  },
});
class MapClientDescription extends Component {
  count = (data, status) => {
    let tmp = find(data, item => item && item._id && item._id.status === status);
    let count = tmp ? tmp.countClient : 0;
    return count;
  };

  render() {
    const { classes, translate, data = [], selectedStatus } = this.props;
    let count = this.count(data, selectedStatus);
    // console.log('>>>', data, countActive, countPause, countStop);
    return (
      <MapControl position={window.google.maps.ControlPosition.BOTTOM_RIGHT}>
        <div>
          {selectedStatus === 'ACTIVE' ? (
            <Fragment>
              <li className={classes.circleActive} />
              <span style={{ color: 'blue', fontSize: '1.2em', paddingLeft: '10px', paddingRight: '10px' }}>
                {translate('resources.clients.clientDistributionMap.active', { val: count })}
              </span>
            </Fragment>
          ) : null}
          {selectedStatus === 'PAUSE' ? (
            <Fragment>
              <li className={classes.circlePause} />
              <span style={{ color: 'orange', fontSize: '1.2em', paddingLeft: '10px', paddingRight: '10px' }}>
                {translate('resources.clients.clientDistributionMap.pause', { val: count })}
              </span>
            </Fragment>
          ) : null}
          {selectedStatus === 'STOP' ? (
            <Fragment>
              <li className={classes.circleStop} />
              <span style={{ color: 'red', fontSize: '1.2em', paddingLeft: '10px', paddingRight: '10px' }}>
                {translate('resources.clients.clientDistributionMap.stop', { val: count })}
              </span>
            </Fragment>
          ) : null}
        </div>
      </MapControl>
    );
  }
}
MapClientDescription.propTypes = {
  classes: PropTypes.object,
  translate: PropTypes.func,
  data: PropTypes.array,
  selectedStatus: PropTypes.string,
};
export default compose(translate, withStyles(styles))(MapClientDescription);
