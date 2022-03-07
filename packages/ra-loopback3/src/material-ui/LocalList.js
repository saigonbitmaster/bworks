import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate } from 'ra-core';
import { ListView } from './List';

class LocalList extends Component {
  static propTypes = {
    children: PropTypes.object,
    data: PropTypes.object,
    page: PropTypes.number,
    perPage: PropTypes.number,
    total: PropTypes.number,
    setPage: PropTypes.func.isRequired,
    ids: PropTypes.array,
  };

  state = {
    page: 1,
    total: 0,
    ids: ['a'],
    selectedIds: [],
    extActions: null,
    isLoading: false,
    defaultTitle: null,
    currentSort: {
      field: 'id',
      order: 'ASC',
    },
    bulkActions: false,
    sort: {
      field: 'id',
      order: 'ASC',
    },
  };

  render() {
    const { ...rest } = this.props;
    return <ListView actions={null} {...this.state} {...rest} hideHeader={true} />;
  }
}

LocalList.defaultProps = {
  perPage: 1,
};

const EnhanceLocalList = compose(translate)(LocalList);

export default EnhanceLocalList;
