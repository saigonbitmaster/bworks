import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import slug from 'slug';
import {
  TextInput,
  NumberInput,
  DmaSelectInput,
  TagInput,
  MapDmaInput,
  EditorInput,
  required,
  FormDataConsumer,
  GET_ONE,
  minLength,
  maxLength,
  minValue,
  FlexItemForward,
  withDataProvider,
  translate,
  ReferenceInput,
  SelectInput,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import get from 'lodash/get';
import { KmlView } from 'web-common';

class DmaInfoInput extends Component {
  static propTypes = {
    subFlex: PropTypes.bool,
    defaultZoom: PropTypes.number,
    defaultCenter: PropTypes.object,
    formRef: PropTypes.any,
    dataProvider: PropTypes.func,
    translate: PropTypes.func,
    record: PropTypes.object,
  };
  static defaultProps = {
    subFlex: true,
  };
  constructor(props) {
    super(props);
    this.state = {
      center: undefined,
      disabledFactory: !Object.keys(this.props.record).length
        ? false
        : get(this.props, 'record.level', '') === 1
        ? false
        : true,
    };
  }
  onParentDmaChange = (e, id, oldId, fullData) => {
    let formRef = this.props.formRef;
    if (id) {
      this.props.dataProvider(GET_ONE, 'dmas', { id }).then(res => {
        let newLevel = (res.data.level || 0) + 1;
        formRef.current.props.change('level', newLevel);

        // factory
        this.setState({ disabledFactory: true });
        formRef.current.props.change('factoryId', '');
      });
    } else {
      formRef.current.props.change('level', 1);

      this.setState({ disabledFactory: false });
    }
    if (fullData && fullData.center) {
      this.setState({ center: fullData.center });
    }
  };

  sanitizeRest(props) {
    const { dataProvider, ...rest } = props;
    return rest;
  }

  render() {
    const { center, disabledFactory } = this.state;
    const { translate, defaultCenter, defaultZoom } = this.props;
    // console.log(this.props);
    return (
      <FlexItemForward {...this.sanitizeRest(this.props)}>
        <Grid middle container spacing={2}>
          <Grid middle item xs={12} sm={6}>
            <TextInput
              label={translate('resources.dmas.fields.name')}
              source="name"
              validate={[required(), minLength(3), maxLength(32)]}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <FormDataConsumer>
              {({ formData, ...rest }) => {
                // console.log(formData);
                if (formData) {
                  let newSlug = slug(get(formData, 'name', ''));
                  if (newSlug !== get(formData, 'slug')) {
                    formData.slug = newSlug;
                  }
                }

                return <TextInput disabled source="slug" {...rest} label={translate('resources.dmas.fields.slug')} />;
              }}
            </FormDataConsumer>
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <FormDataConsumer>
              {({ formData, ...rest }) => {
                return (
                  <DmaSelectInput
                    onChange={this.onParentDmaChange}
                    {...rest}
                    allowEmpty
                    exCludeId={get(formData, 'id', '')}
                    source="parentDmaId"
                    label={translate('resources.dmas.fields.parentDmaId')}
                  />
                );
              }}
            </FormDataConsumer>
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <NumberInput disabled source="level" label={translate('resources.dmas.fields.level')} />
          </Grid>

          <Grid middle item xs={12} sm={6}>
            <NumberInput
              source="population"
              validate={[required(), minValue(0)]}
              label={translate('resources.dmas.fields.population')}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <NumberInput
              source="avgDemandDay"
              validate={[required(), minValue(0)]}
              label={translate('resources.dmas.fields.avgDemandDay')}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <NumberInput
              source="supplyCapacityDay"
              validate={[required(), minValue(0)]}
              label={translate('resources.dmas.fields.supplyCapacityDay')}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <NumberInput
              source="designPressure"
              validate={[required(), minValue(0)]}
              label={translate('resources.dmas.fields.designPressure')}
            />
          </Grid>

          <Grid middle item xs={12}>
            <MapDmaInput
              style={{ marginTop: 0 }}
              fullWidth
              defaultCenter={defaultCenter}
              defaultZoom={defaultZoom}
              center={center}
              source="boundary"
              validate={[required()]}
              label={translate('resources.dmas.areaDma')}
            >
              <KmlView common="all" />
            </MapDmaInput>
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <ReferenceInput
              disabled={disabledFactory}
              label="resources.dmas.fields.factoryId"
              source="factoryId"
              reference="factories"
              resource="factories"
              allowEmpty
            >
              <SelectInput optionText="name" />
            </ReferenceInput>
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <TagInput source="tags" />
          </Grid>
          <Grid middle item xs={12}>
            <EditorInput fullWidth source="description" label={translate('resources.dmas.fields.description')} />
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
const enhance = compose(translate, withDataProvider, connect(mapStateToProps));
export default enhance(DmaInfoInput);
