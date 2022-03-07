import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { clone, debounce, get } from 'lodash';
import camelCase from 'camelcase';
import { withTheme } from '@material-ui/core';
import { GET_ONE } from 'ra-core/lib/dataFetchActions';
// import { Marker } from 'react-google-maps';
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';
import { grey } from '@material-ui/core/colors';
import { Marker } from 'react-google-maps';

class MapMaterialNode extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      data,
    };
  }
  componentDidMount() {
    if (this.props.id) {
      this.updateData(this.props.id);
    }
  }

  updateData = debounce(id => {
    const { dataProvider } = this.props;
    if (id) {
      dataProvider(GET_ONE, 'nodes', { id: id }).then(({ data }) => {
        if (data && data.position && !this.unmount) {
          let dataNode = { node: data.position };
          this.setState({ data: dataNode });
        }
      });
    }
  }, 200);

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      if (this.props.id) {
        this.updateData(this.props.id);
      } else if (this.state.data) {
        this.setState({ data: null });
      }
    }
  }

  componentWillUnmount() {
    this.unmount = true;
  }

  render() {
    const { data = this.state.data, icon, focus } = this.props;
    // console.log('render map material node ', this.props);
    if (!data || !data.node) {
      return null;
    }

    // eslint-disable-next-line
    let maps = google.maps;
    const { theme, marker = {}, model, label, defaultTitle, flgShowInfo, ...rest } = this.props;
    if (!marker.options) {
      marker.options = clone(theme[camelCase(model)]) || { options: {} };
    }
    let content = '';
    if (flgShowInfo) {
      switch (model) {
        case 'FlowLogger':
        case 'QualityLogger':
          content = data.name;
          break;
        default:
          content = '';
      }
    }
    // content =
    //   model === 'FlowLogger' && flgShowInfo ? (
    //     <span>
    //       <b>
    //         {data.name} - {data.optionKey}
    //       </b>
    //       <br />
    //       <span style={{ color: theme.status[data.status] }}>{data.pressure}(bar)</span>
    //       &nbsp;&nbsp;
    //       <span style={{ color: theme.status.ok }}>{data.flowRate}(m³/h)</span>
    //     </span>
    //   ) : (
    //     <span />
    //   );

    // content =
    //   model === 'QualityLogger' && flgShowInfo ? (
    //     <span>
    //       <b>
    //         {data.name} - {data.optionKey}
    //       </b>
    //     </span>
    //   ) : (
    //     <span />
    //   );
    // console.log(flgShowInfo, data);
    if (!flgShowInfo || !content) {
      return (
        <Marker
          {...rest}
          position={data.node}
          zIndex={marker.options.zIndex || 210}
          icon={{
            url: get(icon, 'url', ''),
          }}
        />
      );
    }
    return (
      <MarkerWithLabel
        {...rest}
        labelStyle={{
          textAlign: 'center',
          width: 'auto',
          backgroundColor: 'white',
          fontSize: '13px',
          padding: 1,
          border: `1px solid ${grey[500]}`,
          borderRadius: '3px',
          animation: focus ? 'blink1 1s linear infinite' : undefined,
        }}
        labelClass="marker-label"
        labelAnchor={{ x: 0, y: 0 }}
        key={data.id}
        position={data.node}
        zIndex={marker.options.zIndex || 210}
        icon={{
          url: get(icon, 'url', ''),
        }}
      >
        <div>{content}</div>
      </MarkerWithLabel>
    );
  }
}

MapMaterialNode.propTypes = {
  icon: PropTypes.any,
  data: PropTypes.any,
  id: PropTypes.string,
  model: PropTypes.string,
  dataProvider: PropTypes.func.isRequired,
  marker: PropTypes.object,
  label: PropTypes.any,
  theme: PropTypes.object,
  flgShowInfo: PropTypes.bool,
  defaultTitle: PropTypes.any,
  focus: PropTypes.any,
};
export default withTheme(MapMaterialNode);
