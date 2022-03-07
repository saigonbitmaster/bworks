import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { MapMaterialNode, withDataProvider } from 'ra-loopback3';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push as pushAction } from 'react-router-redux';
import { iconToMap } from '../../styles/Icons';
class QualityLoggerStatus extends Component {
  iconLink = data => {
    // new
    let color = this.getColorByStatus(data);
    let urlIcon = iconToMap({ iconElement: 'QualityLoggerIcon', color, formatType: 'svg' });
    return urlIcon;
  };

  // eslint-disable-next-line
  getColorByStatus = data => {
    let { theme } = this.props;
    let color = theme.status.ok; // ok
    return color;
  };

  onClickLogger = logger => {
    this.props.push(`subQualityLogger/${logger.id}`);
  };
  render() {
    const { loggers, dataProvider, flgShowInfo } = this.props;
    if (loggers && loggers.length > 0) {
      return (
        <Fragment>
          {loggers.map(logger => {
            return (
              <MapMaterialNode
                key={logger.id}
                data={logger}
                model="QualityLogger"
                onClick={() => this.onClickLogger(logger)}
                marker={{ options: {} }}
                icon={this.iconLink(logger)}
                dataProvider={dataProvider}
                flgShowInfo={flgShowInfo}
              />
            );
          })}
        </Fragment>
      );
    }
    return null;
  }
}

QualityLoggerStatus.propTypes = {
  theme: PropTypes.object,
  loggers: PropTypes.array,
  dataProvider: PropTypes.func,
  push: PropTypes.func,
  flgShowInfo: PropTypes.bool,
};
const enhance = compose(withDataProvider, connect(null, { push: pushAction }));
export default enhance(QualityLoggerStatus);
