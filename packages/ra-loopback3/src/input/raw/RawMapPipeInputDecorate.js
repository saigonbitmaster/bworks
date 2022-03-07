import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { GET_ONE } from 'ra-core/lib/dataFetchActions';
import withDataProvider from '../../data/withDataProvider';
import MapDmaList from '../../map/MapDmaList';
import { CUSTOM } from '../../data/LoopbackRest';

class RawMapPipeInputDecorate extends Component {
  static propTypes = {
    onMouseMove: PropTypes.func,
    mapitemprops: PropTypes.object,
    dataProvider: PropTypes.func.isRequired,
    dmaId: PropTypes.string,
    deep: PropTypes.number,
    currentPipeId: PropTypes.string,
  };
  static defaultProps = {
    dmaId: '',
    deep: 1,
    currentPipeId: '',
  };

  constructor(props) {
    super(props);
    const { dmaId, deep, currentPipeId } = props;
    this.state = {
      dmaId,
      deep,
      currentPipeId,
      dmas: [],
      pipes: [],
    };
  }

  updateDma() {
    const { dataProvider } = this.props;
    const { dmaId } = this.props;
    let dmas = [];
    if (dmaId) {
      // current dma
      dataProvider(GET_ONE, 'dmas', { id: dmaId })
        .then(res => {
          if (res.data) {
            dmas.push(res.data);
            return res.data.parentDmaId;
          }
          return null;
        })
        // parent dma
        .then(parentDmaId => {
          if (parentDmaId) {
            return dataProvider(GET_ONE, 'dmas', { id: parentDmaId });
          }
          return null;
        })
        .then(res => {
          if (res && res.data) {
            dmas.push(res.data);
          }
          // set to state
          if (!this.unmount) {
            this.setState({
              dmaId,
              dmas,
            });
          }
        });
    } else {
      dataProvider(CUSTOM, 'dmas', {
        filter: {
          where: { level: 1 },
        },
      }).then(res => {
        if (res && res.data && res.data.length > 0) {
          dmas = res.data;
        }
        if (!this.unmount) {
          this.setState({
            dmaId,
            dmas,
          });
        }
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.dmaId !== this.state.dmaId) {
      this.updateDma();
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { dmaId, deep, currentPipeId } = props;
    return {
      ...state,
      dmaId,
      deep,
      currentPipeId,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState);
  }

  componentWillUnmount() {
    this.unmount = true;
  }

  render() {
    const { ...state } = this.state;
    const { dmaId, deep, currentPipeId, mapitemprops, ...rest } = this.props;
    return (
      <Fragment>
        <MapDmaList {...state} {...rest} mapitemprops={{ ...mapitemprops, noFill: true }} />
      </Fragment>
    );
  }
}

export default withDataProvider(RawMapPipeInputDecorate);
