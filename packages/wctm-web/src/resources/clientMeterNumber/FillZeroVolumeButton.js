import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { Button, withDataProvider, CUSTOM, showNotification, refreshView } from 'ra-loopback3';
import { WriteMeterNumberIcon } from '../../styles/Icons';

class FillZeroVolumeButton extends Component {
  onClick = async () => {
    const getCurrentFilter = get(this.props, 'refController.current.getCurrentFilter');
    let filter = getCurrentFilter();
    const month = get(filter, 'and[0].startMeterDate.lt', null);
    if (month && filter) {
      this.props
        .dataProvider(CUSTOM, 'clientmeternumbers', {
          subUrl: 'fillZeroVolume',
          method: 'POST',
          body: {
            ids: [],
            month,
            filterValues: filter,
          },
        })
        .then(res => {
          if (res.data) {
            this.props.showNotification('generic.messages.inTermZeroScessfull', 'info', {
              messageArgs: { record_count: res.data },
            });
            this.props.refreshView();
          }
        });
    }
  };
  render() {
    // console.log(this.props);
    const {
      basePath,
      push,
      refFilter,
      showNotification,
      dataProvider,
      refController,
      refreshView,
      filterValues,
      displayedFilters,
      showFilter,
      ...rest
    } = this.props;
    return (
      <Button label={'generic.fillZeroTerm'} onClick={this.onClick} {...rest}>
        <WriteMeterNumberIcon />
      </Button>
    );
  }
}

FillZeroVolumeButton.propTypes = {
  label: PropTypes.string,
  status: PropTypes.string,
  dataProvider: PropTypes.func,
  refreshView: PropTypes.func,
  showNotification: PropTypes.func,
};

const enhance = compose(withDataProvider, connect(null, { showNotification, refreshView }));

export default enhance(FillZeroVolumeButton);
