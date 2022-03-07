import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { findLastIndex } from 'lodash';
import { SelectInput, GET_LIST } from 'react-admin';
import withDataProvider from '../data/withDataProvider';
import { addSpaceByLevel } from '../util/utils';

class DmaSelectInput extends Component {
  static propTypes = {
    dataProvider: PropTypes.func,
    maxLevel: PropTypes.number,
    exCludeId: PropTypes.any,
    record: PropTypes.any,
    allowEmpty: PropTypes.bool,
    onChange: PropTypes.func,
    alldma: PropTypes.string,
    flgAllLevel1: PropTypes.bool,
  };
  static defaultProps = {
    maxLevel: 3,
    flgAllLevel1: false,
  };
  state = {
    choices: [],
  };

  renderChoises = (data, allowEmpty, alldma) => {
    const { exCludeId, record = {}, flgAllLevel1 } = this.props;
    let result = [];
    if (allowEmpty) {
      result.push({ id: '', name: '' });
    }
    if (alldma) {
      result.push({ id: 'AllDma', name: 'generic.allDma' });
    }
    if (flgAllLevel1) {
      result.push({ id: 'AllDma', name: 'generic.allDmaLevel1' });
    }
    if (data.length > 0) {
      data.map(row => {
        if (row.id !== exCludeId && row.id !== record.id) {
          if (!row.parentDmaId) {
            result.push(row);
          } else {
            const index = findLastIndex(
              result,
              item => item.id === row.parentDmaId || item.parentDmaId === row.parentDmaId,
            );
            row.name = addSpaceByLevel(row) + row.name;
            result.splice(index + 1, 0, row);
          }
        }
      });
    }
    return result;
  };

  componentDidMount() {
    const { dataProvider, maxLevel, allowEmpty, alldma } = this.props;
    let self = this;
    dataProvider(GET_LIST, 'dmas', {
      rawFilter: {
        where: { level: { lte: maxLevel } },
        fields: { id: true, level: true, name: true, parentDmaId: true, center: true },
        order: ['level ASC', 'name ASC'],
      },
    }).then(res => {
      if (res && res.data && res.data.length > 0) {
        this.setState({
          choices: self.renderChoises(res.data, allowEmpty, alldma),
        });
      }
    });
  }
  handleChange = (e, newData, oldData) => {
    let fullData = {};
    const { choices } = this.state;
    const { onChange } = this.props;
    for (let i = 0; i < choices.length; i++) {
      if (choices[i] && choices[i].id === newData) {
        fullData = choices[i];
        break;
      }
    }
    if (onChange) {
      onChange(e, newData, oldData, fullData);
    }
  };

  render() {
    const { dataProvider, onChange, exCludeId, maxLevel, allowEmpty, alldma, flgAllLevel1, ...rest } = this.props;
    const { choices } = this.state;
    return <SelectInput onChange={this.handleChange} {...rest} choices={choices} translateChoice={true} />;
  }
}
const enhance = compose(withDataProvider);
export default enhance(DmaSelectInput);
