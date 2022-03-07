import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
// import numeral from 'numeral';
import { Button, Input, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { translate } from 'react-admin';
import { round } from 'lodash';
import MapRenderSpecifyPosition from '../MapRenderSpecifyPosition';
class RawPositionInput extends Component {
  state = {
    open: false,
    tempLocation: null,
  };

  convertCoordinateToString = val => {
    const { roundPrecision } = this.props;
    let tmp = '';
    if (val) {
      if (typeof val === 'object' && val.lat && val.lng) {
        tmp = round(val.lat, roundPrecision) + ' - ' + round(val.lng, roundPrecision);
      } else if (typeof val === 'string') {
        tmp = val;
      }
    }
    return tmp;
  };
  convertStringToCoordinate = val => {
    // const {roundPrecision } = this.props;
    if (typeof val === 'object' && val.lat && val.lng) {
      return val;
    } else if (typeof val === 'string') {
      let res = val ? val.split(' - ') : '';
      if (Array.isArray(res) && res.length === 2) {
        return { lat: Number(res[0]), lng: Number(res[1]) };
      }
    }
    return null;
  };
  handleClickOpen = () => {
    this.setState({ open: true, tempLocation: this.props.value });
  };

  handleOK = () => {
    this.setState({ open: false });
    this.props.onChange(this.state.tempLocation);
  };
  handleCancel = () => {
    this.setState({ open: false });
  };

  handleTempLocation = e => {
    // console.log(e.target.value);
    const tempLocation = this.convertStringToCoordinate(e.target.value);
    this.setState({ tempLocation });
  };

  getPositionClick = ({ lat, lng }) => {
    const { roundPrecision } = this.props;
    this.setState({ tempLocation: { lat: round(lat, roundPrecision), lng: round(lng, roundPrecision) } });
  };

  render() {
    const { value, translate, defaultCenter, defaultZoom } = this.props;
    const { tempLocation } = this.state;
    return (
      <Fragment>
        <Input
          id="component-simple"
          onFocus={this.handleClickOpen}
          value={this.convertCoordinateToString(value)}
          fullWidth={true}
          placeholder={translate('ra.map.specifyLocation')}
        />
        {this.state.open && (
          <Dialog scroll={'body'} open={true} onClose={this.handleCancel} aria-labelledby="responsive-dialog-title">
            <DialogTitle id="alert-dialog-title">{translate('ra.map.specifyLocation')}</DialogTitle>
            <DialogContent>
              <TextField
                id="standard-name"
                label={translate('ra.map.coordinate')}
                value={this.convertCoordinateToString(tempLocation)}
                onChange={this.handleTempLocation}
                margin="normal"
                fullWidth
              />

              <MapRenderSpecifyPosition
                options={{ height: '600px', width: '555px' }}
                getPositionClick={this.getPositionClick}
                position={tempLocation}
                defaultZoom={defaultZoom}
                defaultCenter={tempLocation || defaultCenter}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleOK} color="primary" autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Fragment>
    );
  }
}

RawPositionInput.propTypes = {
  translate: PropTypes.func,
  onChange: PropTypes.func,
  rest: PropTypes.any,
  value: PropTypes.any,
  defaultCenter: PropTypes.any,
  defaultZoom: PropTypes.number,
  roundPrecision: PropTypes.number,
};

RawPositionInput.defaultProps = {
  roundPrecision: 6,
};

const enhance = compose(translate);
export default enhance(RawPositionInput);
