import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Button, withDataProvider, CUSTOM, showNotification, refreshView } from 'ra-loopback3';
import { Link } from 'react-router-dom';
import { ActiveButtonIcon } from '../../styles/Icons';

class ActiveButton extends Component {
  static propTypes = {
    record: PropTypes.object,
    basePath: PropTypes.string,
  };
  onClick = () => {
    let { record, showNotification, refreshView } = this.props;
    this.props
      .dataProvider(CUSTOM, 'ctmcompanies', {
        method: 'POST',
        subUrl: 'doActive',
        filter: { where: { id: record.id } },
      })
      .then(res => {
        if (res && res.data && res.data.count === 1) {
          showNotification('resources.ctmcompanies.messages.activeSuccess', 'info');
        } else {
          showNotification('error.CTMCOMPANY_ERROR_ACTIVE', 'warning');
        }
        refreshView();
      })
      .catch(e => {
        if (e && e.message) {
          showNotification(e.message, 'warning');
        } else {
          showNotification('error.CTMCOMPANY_ERROR_ACTIVE', 'warning');
        }
      });
  };
  render() {
    const { record, basePath, permission } = this.props;
    return (
      <Button
        component={Link}
        label="resources.ctmcompanies.activeButton"
        disabled={record.active}
        to={{ pathname: basePath }}
        onClick={this.onClick}
        permission={permission}
      >
        <ActiveButtonIcon />
      </Button>
    );
  }
}
ActiveButton.propTypes = {
  dataProvider: PropTypes.func,
  showNotification: PropTypes.func,
  refreshView: PropTypes.func,
  permission: PropTypes.object,
};
// eslint-disable-next-line
const mapStateToProps = state => {
  return {};
};
const enhance = compose(withDataProvider, connect(mapStateToProps, { showNotification, refreshView }));

export default enhance(ActiveButton);
