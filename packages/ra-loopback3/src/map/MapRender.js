/* eslint-disable no-unused-vars */
import React, { Component, Fragment } from 'react';
import { Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-admin';
import { compose } from 'recompose';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import UnionIcon from '@material-ui/icons/LibraryAdd';
import DrawManyPolygonIcon from '@material-ui/icons/Layers';
import SubtractIcon from '@material-ui/icons/FlipToFront';
import DeleteIcon from '@material-ui/icons/Delete';
import grey from '@material-ui/core/colors/grey';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { debounce } from 'lodash';
import MapSearchBox from './MapSearchBox';
import standard from './mapStyles/default';
import GadmInput from './GadmInput';
import DmaInput from './DmaInput';
const styles = theme => ({
  button: {
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
    textTransform: 'none',
    borderRadius: 1,
    minHeight: '40px',
    minWidth: '40px !important',
    padding: '8px 0px',
    margin: theme.spacing(1),
    backgroundColor: grey[50],
  },
  leftIcon: {
    //marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 20,
  },
});
const PreMapRender = withScriptjs(
  withGoogleMap(({ refMap, styles = standard, options = {}, ...props }) => (
    <GoogleMap
      ref={refMap}
      defaultOptions={{ styles }}
      options={{ styles, ...options }}
      defaultZoom={14}
      defaultCenter={{ lat: 21.00921, lng: 106.80209 }}
      {...props}
    />
  )),
);

const containerStyles = ({ width = '100%', height = '100vh - 110px', minHeight = '300px', maxHeight = null }) => {
  let result = {
    width,
    height: height.indexOf(' ') ? `calc(${height})` : height,
    minHeight,
  };
  if (maxHeight) {
    result.maxHeight = maxHeight;
  }
  return result;
};

class MapRender extends Component {
  static propTypes = {
    onCenterChanged: PropTypes.func,
    searchPosition: PropTypes.func,
    mapApiKey: PropTypes.string,
    isPaper: PropTypes.bool,
    options: PropTypes.object,
    searchBox: PropTypes.bool,
    children: PropTypes.any,
    center: PropTypes.any,
    translate: PropTypes.func,
    getAreaPoint: PropTypes.func,
    enableSearchGadm: PropTypes.bool,
    enableSearchDma: PropTypes.bool,
    enableCropPolygons: PropTypes.bool,
    classes: PropTypes.object,
    handleUnion: PropTypes.func,
    handleSubtract: PropTypes.func,
    handleDrawMany: PropTypes.func,
    clearPolygon: PropTypes.func,
    enableDeletePolygons: PropTypes.bool,
    enableDrawManyPolygons: PropTypes.bool,
    className: PropTypes.string,
  };
  static defaultProps = {
    isPaper: false,
    searchBox: true,
  };

  refSearchBox = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      center: props.center,
      checked: false,
    };
    this.refGadmInput = React.createRef();
  }

  onPlacesChanged = e => {
    let refSearchBox = this.refSearchBox;
    let places = refSearchBox.current.getPlaces();
    if (places && places.length > 0) {
      let center = { lat: places[0].geometry.location.lat(), lng: places[0].geometry.location.lng() };
      this.setState({ center });
      this.handleSearchBoxCenter(center, refSearchBox);
      this.onResetSearchGadm();
    }
  };

  handleSearchBoxCenter = debounce((center, ref) => {
    if (this.props.searchPosition) {
      this.props.searchPosition(center, ref);
    }
  }, 100);

  static getDerivedStateFromProps(nexProps, preState) {
    return {
      ...preState,
      center: nexProps.center || preState.center,
    };
  }
  onClickUnionButton = e => {
    this.props.handleUnion();
  };
  onClickDrawManyButton = e => {
    this.props.handleDrawMany();
  };
  onClickSubtractButton = e => {
    this.props.handleSubtract();
  };
  onClickDeleteButton = e => {
    this.props.clearPolygon();
    if (this.props.enableSearchGadm || this.props.enableSearchDma) {
      this.refGadmInput.onReset();
      document.getElementById('idSearchBoxDefault').value = '';
    }
  };
  onResetSearchGadm = () => {
    // clear current polygon
    if (this.props.enableSearchGadm || this.props.enableSearchDma) {
      this.props.clearPolygon();
      this.refGadmInput.onReset();
    }
  };
  onResetSearchBoxDefault = () => {
    if (this.props.enableSearchGadm || this.props.enableSearchDma) {
      // console.log('onResetSearchBoxDefault', document.getElementById('idSearchBoxDefault').value);
      this.props.clearPolygon();
      // same with id SearchBox
      document.getElementById('idSearchBoxDefault').value = '';
    }
  };
  render() {
    let {
      mapApiKey,
      options = {},
      isPaper,
      children,
      searchBox,
      enableSearchGadm,
      enableSearchDma,
      center,
      getAreaPoint,
      translate,
      enableCropPolygons,
      enableDrawManyPolygons,
      classes,
      clearPolygon,
      enableDeletePolygons,
      className,
      ...rest
    } = this.props;
    let { checked } = this.state;
    // console.log('map render: ', this.props);
    let mapUrl = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places';
    if (mapApiKey) {
      mapUrl = mapUrl.replace('js?', `js?key=${mapApiKey}&`);
    }
    if (!rest.center || !rest.center.lat) {
      delete rest.center;
    }
    let styles = containerStyles(options);
    let props = {};
    if (this.state.center) {
      props.center = this.state.center;
    }
    return (
      <PreMapRender
        isMarkerShown
        googleMapURL={mapUrl}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={
          isPaper ? <Paper style={styles} className={className} /> : <div className={className} style={styles} />
        }
        mapElement={<div style={{ height: `100%`, position: 'relative' }} />}
        options={options}
        {...rest}
        {...props}
      >
        {!enableSearchGadm && !enableSearchDma && searchBox && (
          <MapSearchBox refSearchBox={this.refSearchBox} onPlacesChanged={this.onPlacesChanged} />
        )}
        {enableDrawManyPolygons && (
          <Fragment>
            <Tooltip title={translate('ra.map.drawManyPolygons')}>
              <Button
                variant="contained"
                className={classes.button}
                style={{
                  position: 'absolute',
                  marginTop: 10,
                  top: 0,
                  right: 204,
                }}
                onClick={this.onClickDrawManyButton}
              >
                <DrawManyPolygonIcon className={classes.leftIcon} style={{ color: '#666' }} />
              </Button>
            </Tooltip>
          </Fragment>
        )}
        {enableCropPolygons && (
          <Fragment>
            <Tooltip title={translate('ra.map.union')}>
              <Button
                variant="contained"
                className={classes.button}
                style={{
                  position: 'absolute',
                  marginTop: 10,
                  top: 0,
                  right: 152,
                }}
                onClick={this.onClickUnionButton}
              >
                <UnionIcon className={classes.leftIcon} style={{ color: '#666' }} />
              </Button>
            </Tooltip>
            <Tooltip title={translate('ra.map.subtract')}>
              <Button
                variant="contained"
                className={classes.button}
                style={{
                  position: 'absolute',
                  marginTop: 10,
                  top: 0,
                  right: 102,
                }}
                onClick={this.onClickSubtractButton}
              >
                <SubtractIcon className={classes.leftIcon} style={{ color: '#666' }} />
              </Button>
            </Tooltip>
            <Tooltip title={translate('ra.map.delete')}>
              <Button
                variant="contained"
                className={classes.button}
                style={{
                  position: 'absolute',
                  marginTop: 10,
                  top: 0,
                  right: 52,
                }}
                onClick={this.onClickDeleteButton}
              >
                <DeleteIcon className={classes.leftIcon} style={{ color: '#666' }} />
              </Button>
            </Tooltip>
          </Fragment>
        )}
        {enableSearchGadm && searchBox && (
          <div>
            <MapSearchBox
              clearPolygon={clearPolygon}
              enableSearchGadm={enableSearchGadm}
              refSearchBox={this.refSearchBox}
              onPlacesChanged={this.onPlacesChanged}
            />
            <GadmInput
              getAreaPoint={getAreaPoint}
              onRef={ref => (this.refGadmInput = ref)}
              onResetSearchBoxDefault={this.onResetSearchBoxDefault}
            />
          </div>
        )}
        {enableSearchDma && searchBox && (
          <div>
            <MapSearchBox
              clearPolygon={clearPolygon}
              enableSearchDma={enableSearchDma}
              refSearchBox={this.refSearchBox}
              onPlacesChanged={this.onPlacesChanged}
            />
            <DmaInput
              getAreaPoint={getAreaPoint}
              onRef={ref => (this.refGadmInput = ref)}
              onResetSearchBoxDefault={this.onResetSearchBoxDefault}
            />
          </div>
        )}
        {children}
      </PreMapRender>
    );
  }
}

const mapStateToProps = state => ({
  mapApiKey: state.common.mapApiKey,
});

export default compose(translate, withStyles(styles), connect(mapStateToProps))(MapRender);
