import React, { Component } from 'react';
import { GET_LIST } from 'react-admin';
import { maxRecord } from '../data/pagination';
const withDmaData = ({ dataProvider, parentDmaId, excludeId, includeParent = true, deep = 1 }) => BaseComponent => {
  class DmaData extends Component {
    state = {
      dmas: [],
    };
    componentDidMount() {
      let rawFilter = {
        // limit fields
        fields: { id: true, name: true, center: true, boundary: true, parentDmaId: true, level: true },
      };
      // has parent dma id case
      if (parentDmaId) {
        if (includeParent) {
          rawFilter.where = { or: [{ id: parentDmaId }, { parentDmaId: parentDmaId }] };
        } else {
          rawFilter.where = { parentDmaId: parentDmaId };
        }
        if (excludeId) {
          rawFilter.where.or[1].id = { neq: excludeId };
        }
      } else {
        // not parent dma id case
        rawFilter.where = {
          and: [{ parentDmaId: { exists: false } }],
        };
        if (excludeId) {
          rawFilter.where.and.push({ id: { neq: excludeId } });
        }
      }
      dataProvider(GET_LIST, 'dmas', { rawFilter, pagination: maxRecord }).then(res => {
        if (!this.willUnmount) {
          this.setState({
            dmas: res.data,
          });
          this.getDmaDeep(deep - 1, res.data);
        }
      });
    }

    getDmaDeep(currentDeep, dmas) {
      if (currentDeep > 0 && dmas && dmas.length > 0) {
        let dmaIds = [];
        dmas.map(dma => {
          if (dma.id !== parentDmaId) {
            dmaIds.push(dma.id);
          }
        });
        dataProvider(GET_LIST, 'dmas', {
          rawFilter: {
            fields: { id: true, name: true, center: true, boundary: true, parentDmaId: true, level: true },
            where: { parentDmaId: { in: dmaIds } },
          },
          pagination: maxRecord,
        }).then(res => {
          if (!this.willUnmount) {
            this.setState({
              dmas: this.state.dmas.concat(res.data),
            });
            this.getDmaDeep(currentDeep - 1, res.data);
          }
        });
      }
    }

    componentWillUnmount() {
      this.willUnmount = true;
    }

    render() {
      const { dmas } = this.state;
      return <BaseComponent {...this.props} dmas={dmas || []} />;
    }
  }
  return DmaData;
};

export default withDmaData;
