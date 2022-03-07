import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { isEqual } from 'lodash';
import { URL_ONLY, withDataProvider, CUSTOM, MapNode } from 'ra-loopback3';

class MapFactory extends Component {
  state = {
    // update: 0,
    factories: [],
  };
  componentDidMount() {
    this.updateData(this.props.filter);
  }
  shouldComponentUpdate(nexProps, nexState) {
    if (!isEqual(nexProps.filter, this.props.filter)) {
      this.updateData(nexProps.filter);
    }
    return nexState.update !== this.state.update;
  }

  updateData = filter => {
    let condition = {};
    if (filter) {
      condition.rawFilter = filter;
    }
    this.props.dataProvider(CUSTOM, 'factories', condition).then(res => {
      if (this.props.onChange) {
        this.props.onChange(res.data);
      }
      this.safeSetState({ factories: res.data });
    });
  };
  iconLink = () => {
    let url = this.props.dataProvider(URL_ONLY, 'icons', {
      subUrl: 'view/FactoryIcon',
      query: { color: 'normal', size: 128 },
      ignoreToken: true,
    }).url;
    return url;
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  safeSetState = (state, cb) => {
    if (!this.unmount) this.setState(state, cb);
  };

  render() {
    const { factories } = this.state;
    if (!factories || factories.length === 0) return null;
    let maps = google.maps; // eslint-disable-line
    return (
      <Fragment>
        {factories.map(factory => {
          return <MapNode key={factory.id} node={factory} icon={this.iconLink()} />;
        })}
      </Fragment>
    );
  }
}
MapFactory.propTypes = {
  currentStatus: PropTypes.array,
  theme: PropTypes.object,
  dataProvider: PropTypes.func,
  classes: PropTypes.object,
  filter: PropTypes.object,
  onChange: PropTypes.func,
};
const enhance = compose(withDataProvider);
export default enhance(MapFactory);
