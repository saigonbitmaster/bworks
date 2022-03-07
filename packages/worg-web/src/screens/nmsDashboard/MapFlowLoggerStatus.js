import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { MapMaterialNode, withDataProvider } from 'ra-loopback3';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push as pushAction } from 'react-router-redux';
import { iconToMap } from '../../styles/Icons';

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
    // OLD
    // let url = this.props.dataProvider(URL_ONLY, 'icons', {
    //   subUrl: 'dropView/FlowLoggerIcon',
    //   query: status,
    //   ignoreToken: true,
    //   abc: 'xyz',
    // }).url;
    // return url;

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
    const { currentStatus, dataProvider, flgShowInfo } = this.props;
    if (currentStatus && currentStatus.length > 0) {
      return (
        <Fragment>
          {currentStatus.map(dma => {
            if (dma.flowLoggers && dma.flowLoggers.length > 0) {
              return dma.flowLoggers.map(flowLogger => {
                // let status = getStatus(flowLogger);
                // console.log(flowLogger);
                return (
                  <MapMaterialNode
                    key={flowLogger.id}
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
            return null;
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
};
const enhance = compose(withDataProvider, connect(null, { push: pushAction }));
export default enhance(MapFlowLoggerStatus);
