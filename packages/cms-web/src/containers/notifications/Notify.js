import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { compose } from 'recompose';
import { withDataProvider, CUSTOM, translate } from 'ra-loopback3';
import config from '../../Config';

class Notify extends Component {
  state = { notifyItems: [] };


  colorMap = colorCode => {
    let color = null;
    switch (colorCode) {
      case 1:
        color = { color: config.color.status.criticalAlert };
        break;
      case 2:
        color = { color: config.color.status.alert };
        break;
      case 3:
        color = { color: config.color.status.alert };
        break;
      case 4:
        color = { color: config.color.status.criticalAlert };
        break;
      default:
        break;
    }
    return color;
  };

  renderItem = arr =>
    
    arr.map(item => {
     
      return (
        <Fragment key={item._id}>
          
          {item.alertRecord.totalAlert.map(subItem => {
            return (
              <MenuItem key={subItem.param} style={{ marginLeft: '10px' }} onClick={this.props.handleClose}>
                <Typography gutterBottom noWrap style={this.colorMap(subItem.alert)}>
                  {this.props.translate(`generic.alertLevel.${subItem.param}`)}:{' '}
                  {this.props.translate(`generic.alertLevel.${subItem.alert}`)}
                </Typography>
              </MenuItem>
            );
          })}
        </Fragment>
      );
    });

  render() {
    // const { handleClose } = this.props;
   
   let notifyItems = [{_id: 1, jobName: 2, alertRecord: {totalAlert: [{param: 1, alert: 2}]}}]
    if (notifyItems.length < 1) {
      return null;
    }

    return <Fragment> {this.renderItem(notifyItems)} </Fragment>;
  }
}

Notify.propTypes = {
  dataProvider: PropTypes.func.isRequired,
  handleClose: PropTypes.func,
  translate: PropTypes.func,
};

const enhance = compose(withDataProvider, translate);

export default enhance(Notify);
