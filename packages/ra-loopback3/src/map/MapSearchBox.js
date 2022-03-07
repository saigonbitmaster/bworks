import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate } from 'react-admin';
import { SearchBox } from 'react-google-maps/lib/components/places/SearchBox';

class MapSearchBox extends Component {
  onKeyPress = e => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();
    }
  };
  render() {
    const {
      bounds,
      onPlacesChanged,
      controlPosition,
      translate,
      refSearchBox,
      enableSearchGadm,
      enableSearchDma,
    } = this.props;
    let maps = google.maps; // eslint-disable-line no-undef
    return (
      <SearchBox
        ref={refSearchBox}
        bounds={bounds}
        controlPosition={controlPosition || maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={onPlacesChanged}
      >
        <input
          id={enableSearchGadm || enableSearchDma ? 'idSearchBoxDefault' : null}
          type="text"
          placeholder={translate('ra.map.searchPosition')}
          on="true"
          onKeyPress={this.onKeyPress}
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `200px`,
            height: `40px`,
            marginTop: `10px`,
            padding: `0 12px`,
            borderRadius: `2px`,
            boxShadow: `rgba(0, 0, 0, 0.3) 0px 1px 4px -1px`,
            fontSize: `16px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
        />
      </SearchBox>
    );
  }
}

MapSearchBox.propTypes = {
  bounds: PropTypes.array,
  onPlacesChanged: PropTypes.func,
  controlPosition: PropTypes.any,
  refSearchBox: PropTypes.any,
  translate: PropTypes.func,
  enableSearchGadm: PropTypes.bool,
  enableSearchDma: PropTypes.bool,
};

export default compose(translate)(MapSearchBox);
