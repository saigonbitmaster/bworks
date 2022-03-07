import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { MapMaterialNode, withDataProvider, MapDma } from 'ra-loopback3';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push as pushAction } from 'react-router-redux';
import { iconToMap } from '../../styles/Icons';
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';
// import { withTheme } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

const keyStatusPressure = {
  high: 'high',
  low: 'low',
  loss: 'loss',
};

const keyStatusTime = {
  error: 'error',
  warning: 'warning',
};
class MapFlowLoggerStatus extends Component {
  state = { loggerURL: '' };
  iconLink = data => {
    // new
    let color = this.getColorByStatus(data);
    let urlIcon = iconToMap({ iconElement: 'FlowLoggerIcon', color, formatType: 'svg' });
    return urlIcon;
  };

  // get color marker dua vao trang thai
  getColorByStatus = data => {
    let { theme } = this.props;
    let color = theme.status.ok; // ok
    let { status, timeStatus } = data;

    // status: trang thai ap luc gom: high, low, loss
    // statusTime: gom 'error', 'warning'
    if (!status || !timeStatus || status === keyStatusPressure.high || timeStatus === keyStatusTime.error) {
      color = theme.status.error;
    } else {
      if (status === keyStatusPressure.low || timeStatus === keyStatusTime.warning) {
        color = theme.status.warning;
      } else if (status === keyStatusPressure.loss) {
        color = theme.status.low;
      }
    }

    return color;
  };

  onClickLogger = flowLogger => {
    this.props.push(`statisticFlowLogger/${flowLogger.id}`);
  };
  render() {
    const { currentStatus, dataProvider, flgShowInfo, focus } = this.props;
    if (currentStatus && currentStatus.length > 0) {
      return (
        <Fragment>
          {currentStatus.map(dma => {
            let result = [];
            if (dma.flowLoggers && dma.flowLoggers.length > 0) {
              result = dma.flowLoggers.map(flowLogger => {
                return (
                  <MapMaterialNode
                    key={flowLogger.id}
                    focus={flowLogger.id == focus.id}
                    data={flowLogger}
                    model="FlowLogger"
                    onClick={() => this.onClickLogger(flowLogger)}
                    marker={{ options: {} }}
                    icon={this.iconLink(flowLogger)}
                    dataProvider={dataProvider}
                    flgShowInfo={flgShowInfo}
                  />
                );
              });
            }
            if (focus && focus.id === dma.id) {
              result.push(
                <Fragment key={'dma' + dma.id}>
                  <MapDma
                    dma={dma}
                    mapitemprops={{
                      polygon: {
                        options: {
                          fillOpacity: 0.3,
                          fillColor: blue[500],
                          strokeWeight: 1,
                          strokeColor: blue[500],
                          zIndex: 1,
                        },
                      },
                    }}
                  />
                  <MarkerWithLabel
                    position={dma.center}
                    icon=" "
                    labelClass="marker-label"
                    labelAnchor={{ x: 0, y: 0 }}
                    labelStyle={{
                      color: 'white',
                      fontSize: `${100 + Math.round(50 / dma.level)}%`,
                      animation: 'blink1 1s linear infinite',
                    }}
                  >
                    <div>{dma.name}</div>
                  </MarkerWithLabel>
                </Fragment>,
              );
            }
            return result;
          })}
        </Fragment>
      );
    }
    return null;
  }
}

MapFlowLoggerStatus.propTypes = {
  theme: PropTypes.object,
  currentStatus: PropTypes.array,
  getStatus: PropTypes.func,
  dataProvider: PropTypes.func,
  push: PropTypes.func,
  flgShowInfo: PropTypes.bool,
  focus: PropTypes.any,
};
const enhance = compose(
  withDataProvider,
  // withTheme,
  connect(null, { push: pushAction }),
);
export default enhance(MapFlowLoggerStatus);
