import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate } from 'ra-loopback3';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import MapControl from '../../containers/map/MapControl';
// eslint-disable-next-line
const styles = theme => ({
  circleWritten: {
    height: '10px',
    width: '10px',
    backgroundColor: 'blue',
    borderRadius: '50%',
    display: 'inline-block',
  },
  circleNotWritten: {
    height: '10px',
    width: '10px',
    backgroundColor: 'orange',
    borderRadius: '50%',
    display: 'inline-block',
  },
});
class MapClientDescription extends Component {
  count = (data, status) => {
    let tmp = _.find(data, function(item) {
      return item && item._id && item._id.status === status;
    });
    let count = tmp ? tmp.countClient : 0;
    return count;
  };
  render() {
    const { classes, translate, data = [], selectedStatus } = this.props;
    const count = this.count(data, selectedStatus);
    return (
      <MapControl position={window.google.maps.ControlPosition.BOTTOM_RIGHT}>
        <div>
          {selectedStatus === true ? (
            <Fragment>
              <li className={classes.circleWritten} />
              <span style={{ color: 'blue', fontSize: '1.2em', paddingLeft: '10px', paddingRight: '10px' }}>
                {translate('resources.clients.clientWriteMap.written', { val: count })}
              </span>
            </Fragment>
          ) : (
            <Fragment>
              <li className={classes.circleNotWritten} />
              <span style={{ color: 'orange', fontSize: '1.2em', paddingLeft: '10px', paddingRight: '10px' }}>
                {translate('resources.clients.clientWriteMap.notWritten', { val: count })}
              </span>
            </Fragment>
          )}
        </div>
      </MapControl>
    );
  }
}
MapClientDescription.propTypes = {
  classes: PropTypes.object,
  translate: PropTypes.func,
  data: PropTypes.array,
  selectedStatus: PropTypes.bool,
};
export default compose(translate, withStyles(styles))(MapClientDescription);
