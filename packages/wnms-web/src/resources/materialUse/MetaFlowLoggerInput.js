import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlexItemForward,
  minValue,
  MapNodeSelectInput,
  TextInput,
  required,
  NumberInput,
  BooleanInput,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import get from 'lodash/get';
import { iconToMap } from '../../styles/Icons';

class MetaFlowLoggerInput extends Component {
  render() {
    const {
      subFlex,
      defaultCenter,
      defaultZoom,
      onFromNodeChange,
      translate,
      theme,
      options: { icon },
      ...rest
    } = this.props;
    // console.log('MetaFlowLoggerInput', this.props);
    return (
      <FlexItemForward {...rest}>
        <Grid middle item xs={12}>
          <TextInput
            label={translate('resources.materialuses.flowLoggers.optionKey')}
            source="optionKey"
            validate={[required()]}
          />
        </Grid>
        <Grid middle item xs={12} sm={6}>
          <NumberInput
            label={translate('resources.materialuses.fields.meta.designFlow')}
            source="meta.designFlow"
            validate={[required(), minValue(0)]}
          />
        </Grid>
        <Grid middle item xs={12} sm={6}>
          <BooleanInput label={translate('resources.materialuses.fields.meta.isMiddle')} source="meta.isMiddle" />
        </Grid>
        <Grid middle item xs={12} sm={6}>
          <NumberInput
            label={translate('resources.materialuses.fields.meta.designPressure')}
            source="meta.designPressure"
            validate={[required(), minValue(0)]}
          />
        </Grid>
        <Grid middle item xs={12}>
          <MapNodeSelectInput
            style={{ marginTop: 0 }}
            fullWidth
            model={rest.type}
            icon={iconToMap({ iconElement: get(icon, 'iconElement', icon) })}
            activeIcon={iconToMap({
              iconElement: get(icon, 'iconElement', icon),
              color: theme.materials.edit.color,
            })}
            onChange={onFromNodeChange}
            source="fromNodeId"
            defaultCenter={defaultCenter}
            defaultZoom={defaultZoom}
            validate={[required()]}
            label={translate('generic.specifyPosition')}
          />
        </Grid>
      </FlexItemForward>
    );
  }
}
MetaFlowLoggerInput.propTypes = {
  theme: PropTypes.object,
  options: PropTypes.any,
  translate: PropTypes.func,
  onFromNodeChange: PropTypes.func,
  subFlex: PropTypes.bool,
  defaultCenter: PropTypes.object,
  defaultZoom: PropTypes.number,
};

export default MetaFlowLoggerInput;
