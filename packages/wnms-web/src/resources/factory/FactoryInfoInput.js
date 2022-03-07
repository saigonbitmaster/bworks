import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextInput,
  NumberInput,
  TagInput,
  EditorInput,
  required,
  DateInput,
  minLength,
  maxLength,
  minValue,
  FlexItemForward,
  withDataProvider,
  // MapNodeInput,
  // URL_ONLY,
  translate,
  MapNodeSelectInput,
  HiddenInput,
  // MapDmaInput,
} from 'ra-loopback3';
import { Grid, withTheme } from '@material-ui/core';
import { iconToMap } from '../../styles/Icons';
import { KmlView } from 'web-common';

class DmaInfoInput extends Component {
  static propTypes = {
    subFlex: PropTypes.bool,
    defaultZoom: PropTypes.number,
    defaultCenter: PropTypes.object,
    formRef: PropTypes.any,
    dataProvider: PropTypes.func,
    translate: PropTypes.func,
    theme: PropTypes.any,
  };
  static defaultProps = {
    subFlex: true,
  };
  constructor(props) {
    super(props);
    this.state = {
      factoryIcon: '',
      factoryActiveIcon: '',
    };
  }
  sanitizeRest(props) {
    const { dataProvider, ...rest } = props;
    return rest;
  }
  async componentDidMount() {
    let { theme, dataProvider } = this.props;
    const resIcon = await dataProvider('URL_ONLY', 'icons', {
      subUrl: 'dropView/Factory',
      query: {
        size: 64,
        color: theme.status.normal,
      },
    });
    const resActiveIcon = await dataProvider('URL_ONLY', 'icons', {
      subUrl: 'dropView/Factory',
      query: {
        size: 64,
        color: theme.status.active,
      },
    });
    this.safeSetState({
      factoryIcon: resIcon.data.url,
      factoryActiveIcon: resActiveIcon.data.url,
    });
  }
  safeSetState = state => {
    if (!this.unmount) this.setState(state);
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  iconLink = (color = 'normal') => {
    // let res = await this.props.dataProvider(URL_ONLY, 'icons', {
    //   subUrl: 'view/FactoryIcon',
    //   query: { color: 'normal', size: 128 },
    //   ignoreToken: true,
    // });
    // return url;

    let urlIcon = iconToMap({
      iconElement: 'FactoryIcon',
      dropView: false,
      color,
      formatType: 'svg',
      // width: 128,
    });
    // console.log('link icon factory', urlIcon);
    return urlIcon;
  };

  render() {
    const { translate, defaultCenter, defaultZoom } = this.props;
    let { factoryIcon, factoryActiveIcon } = this.state;
    // console.log('factory: ', this.state);
    return (
      <FlexItemForward {...this.sanitizeRest(this.props)}>
        <HiddenInput source="nodeId" />
        <Grid middle container spacing={2}>
          <Grid middle item xs={12} sm={6}>
            <TextInput
              source="name"
              validate={[required(), minLength(3), maxLength(32)]}
              label={translate('resources.factories.fields.name')}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <NumberInput source="acreage" label={translate('resources.factories.fields.acreage')} />
          </Grid>
          <Grid middle item xs={12}>
            {/* <MapNodeInput
              fullWidth
              zoom={defaultZoom}
              customIcon={this.iconLink()}
              source="position"
              center={defaultCenter}
              onChange={this.onPositionChange}
              validate={[required()]}
            /> */}
            <MapNodeSelectInput
              style={{ marginTop: 0 }}
              fullWidth
              model={'Factory'}
              icon={{ url: factoryIcon }}
              activeIcon={{ url: factoryActiveIcon }}
              // icon={this.iconLink()}
              // activeIcon={this.iconLink(theme.materials.edit.color)}
              source="nodeId"
              defaultCenter={defaultCenter}
              defaultZoom={defaultZoom}
              validate={[required()]}
              label={translate('resources.factories.positionFactory')}
            >
              <KmlView common="all" />
            </MapNodeSelectInput>
          </Grid>
          {/* <Grid middle item xs={12}>
            <MapDmaInput
              style={{ marginTop: 0 }}
              fullWidth
              defaultCenter={defaultCenter}
              defaultZoom={defaultZoom}
              center={null}
              source="boundary"
              validate={[required()]}
              label={translate('resources.factories.areaFactory')}
              enableSearchGadm={false}
              enableSearchDma={true}
              enableCropPolygons={true}
              enableDeletePolygons={true}
              enableDrawManyPolygons={false}
              formRef={formRef}
            />
          </Grid> */}
          <Grid middle item xs={12} sm={6}>
            <NumberInput
              source="designCapacityDay"
              validate={[required(), minValue(0)]}
              label={translate('resources.factories.fields.designCapacityDay')}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <NumberInput
              source="currentCapacityDay"
              validate={[required(), minValue(0)]}
              label={translate('resources.factories.fields.currentCapacityDay')}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <NumberInput
              source="avgPH"
              validate={[required(), minValue(0)]}
              label={translate('resources.factories.fields.avgPH')}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <NumberInput
              source="avgTurbidity"
              validate={[required(), minValue(0)]}
              label={translate('resources.factories.fields.avgTurbidity')}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <NumberInput
              source="currentLossRate"
              validate={[required(), minValue(0)]}
              label={translate('resources.factories.fields.currentLossRate')}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <NumberInput
              source="powerConsumption"
              validate={[required(), minValue(0)]}
              label={translate('resources.factories.fields.powerConsumption')}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <DateInput
              source="useStartDate"
              validate={[required(), minValue(0)]}
              label={translate('resources.factories.fields.useStartDate')}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <TagInput source="tags" />
          </Grid>
          <Grid middle item xs={12}>
            <EditorInput fullWidth source="description" label={translate('resources.factories.fields.description')} />
          </Grid>
        </Grid>
      </FlexItemForward>
    );
  }
}
const mapStateToProps = state => ({
  defaultZoom: state.design.defaultZoom,
  defaultCenter: state.design.defaultCenter,
});
const enhance = compose(withDataProvider, translate, withTheme, connect(mapStateToProps));
export default enhance(DmaInfoInput);
