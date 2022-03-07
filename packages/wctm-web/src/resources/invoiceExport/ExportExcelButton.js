import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { Button, withDataProvider, CUSTOM, showNotification, refreshView } from 'ra-loopback3';
import { ExportIcon } from '../../styles/Icons';

class ExportExcelButton extends Component {
  state = { saving: false };
  onClick = async () => {
    const { filterValues } = this.props;
    const month = get(filterValues, 'termInvoice.gte', null);
    const quarterId = get(filterValues, 'quarterId');
    if (month && quarterId) {
      this.setState({ saving: true });
      this.props
        .dataProvider(CUSTOM, 'clientmeternumbers', {
          subUrl: 'exportExcelByGeo',
          fullUrl: true,
          method: 'GET',
          stream: 'file',
          query: {
            month,
            quarterId,
          },
        })
        .finally(() => {
          this.setState({ saving: false });
        });
    } else {
      this.props.showNotification('generic.messages.pleaseSelectQuarter', 'warning');
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
      <Button saving={this.state.saving} label={'generic.exportExcel'} onClick={this.onClick} {...rest}>
        <ExportIcon />
      </Button>
    );
  }
}

ExportExcelButton.propTypes = {
  label: PropTypes.string,
  status: PropTypes.string,
  dataProvider: PropTypes.func,
  refreshView: PropTypes.func,
  showNotification: PropTypes.func,
};

const enhance = compose(withDataProvider, connect(null, { showNotification, refreshView }));

export default enhance(ExportExcelButton);
