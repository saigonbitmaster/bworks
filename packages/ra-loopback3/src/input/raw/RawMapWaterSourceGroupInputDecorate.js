import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { GET_ONE, GET_LIST } from 'ra-core/lib/dataFetchActions';
import withDataProvider from '../../data/withDataProvider';
import MapDmaList from '../../map/MapDmaList';
import { CUSTOM } from '../../data/LoopbackRest';

class RawMapWaterSourceGroupInputDecorate extends Component {
  static propTypes = {
    dataProvider: PropTypes.func.isRequired,
    excludeId: PropTypes.string,
    parentDmaId: PropTypes.string,
    inCludeChild: PropTypes.bool,
  };
  static defaultProps = {
    excludeId: '',
    parentDmaId: '',
    inCludeChild: false,
  };

  constructor(props) {
    super(props);
    const { excludeId, inCludeChild, parentDmaId } = props;
    this.state = {
      excludeId,
      inCludeChild,
      parentDmaId,
      dmas: [],
      pipes: [],
    };
  }

  updateDma() {
    const { dataProvider, parentDmaId, inCludeChild, excludeId } = this.props;
    let dmas = [];
    if (parentDmaId) {
      // parentDma
      dataProvider(GET_ONE, 'watersourcegroups', { id: parentDmaId })
        .then(res => {
          if (res.data) {
            dmas.push(res.data);
            if (inCludeChild) {
              return dataProvider(GET_LIST, 'watersourcegroups', {
                rawFilter: {
                  where: {
                    parentDmaId: res.data.id,
                    id: { neq: excludeId },
                  },
                },
              });
            }
          }
          return null;
        })
        .then(res => {
          if (res && res.data) {
            dmas = dmas.concat(res.data);
          }
          // set to state
          this.safeSetState({
            parentDmaId,
            inCludeChild,
            excludeId,
            dmas,
          });
        });
    } else {
      dataProvider(CUSTOM, 'watersourcegroups', {
        filter: {
          where: { id: { neq: excludeId } },
        },
      }).then(res => {
        if (res && res.data && res.data.length > 0) {
          dmas = res.data;
        }
        this.safeSetState({
          parentDmaId,
          inCludeChild,
          excludeId,
          dmas,
        });
      });
    }
  }

  updatePipe() {
    // const { dataProvider } = this.props;
    // const { dmaId } = this.props;
  }

  componentDidMount() {
    this.updateDma();
    this.updatePipe();
  }
  safeSetState = state => {
    if (!this.unmount) this.setState(state);
  };
  componentWillUnmount() {
    this.unmount = true;
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.excludeId !== this.state.excludeId ||
      prevState.inCludeChild !== this.state.inCludeChild ||
      prevState.parentDmaId !== this.state.parentDmaId
    ) {
      this.updateDma();
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { parentDmaId, inCludeChild, excludeId } = props;
    return {
      ...state,
      inCludeChild,
      excludeId,
      parentDmaId,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState);
  }

  render() {
    const { mapitemprops } = this.props;
    const { dmas } = this.state;
    return (
      <Fragment>
        <MapDmaList dmas={dmas} mapitemprops={{ ...mapitemprops, noFill: true }} />
      </Fragment>
    );
  }
}

RawMapWaterSourceGroupInputDecorate.propTypes = {
  mapitemprops: PropTypes.object,
};

export default withDataProvider(RawMapWaterSourceGroupInputDecorate);
