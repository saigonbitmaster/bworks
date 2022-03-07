import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate } from 'ra-loopback3';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import MapControl from '../../containers/map/MapControl';
// eslint-disable-next-line
const styles = theme => ({
  circlePaid: {
    height: '10px',
    width: '10px',
    backgroundColor: 'blue',
    borderRadius: '50%',
    display: 'inline-block',
  },
  circleNotPaid: {
    height: '10px',
    width: '10px',
    backgroundColor: 'red',
    borderRadius: '50%',
    display: 'inline-block',
  },
  circleNotUsed: {
    height: '10px',
    width: '10px',
    backgroundColor: 'green',
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
          {selectedStatus === 'paid' ? (
            <Fragment>
              <li className={classes.circlePaid} />
              <span style={{ color: 'blue', fontSize: '1.2em', paddingLeft: '10px', paddingRight: '10px' }}>
                {translate('resources.clients.clientPayMap.paid', { val: count })}
              </span>
            </Fragment>
          ) : selectedStatus === 'notPaid' ? (
            <Fragment>
              <li className={classes.circleNotPaid} />
              <span style={{ color: 'red', fontSize: '1.2em', paddingLeft: '10px', paddingRight: '10px' }}>
                {translate('resources.clients.clientPayMap.notPaid', { val: count })}
              </span>
            </Fragment>
          ) : (
            <Fragment>
              <li className={classes.circleNotUsed} />
              <span style={{ color: 'green', fontSize: '1.2em', paddingLeft: '10px', paddingRight: '10px' }}>
                {translate('resources.clients.clientPayMap.notUsed', { val: count })}
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
