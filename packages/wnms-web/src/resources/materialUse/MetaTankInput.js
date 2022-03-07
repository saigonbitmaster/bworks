import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlexItemForward, MapNodeSelectInput, NumberInput, required } from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import get from 'lodash/get';
import { iconToMap } from '../../styles/Icons';

class MetaTankInput extends Component {
  render() {
    const {
      subFlex,
      defaultCenter,
      defaultZoom,
      onFromNodeChange,
      translate,
      options: { icon },
      theme,
      ...rest
    } = this.props;
    return (
      <FlexItemForward {...rest}>
        <Grid middle item xs={12} sm={6}>
          <NumberInput source="meta.volume" validate={[required()]} label={translate('generic.metaExtend.volume')} />
        </Grid>
        <Grid middle item xs={12} sm={6}>
          <NumberInput
            source="meta.capacity"
            validate={[required()]}
            label={translate('generic.metaExtend.capacity')}
          />
        </Grid>
        <Grid middle item xs={12} sm={6}>
          <NumberInput
            source="meta.powerConsumption"
            validate={[required()]}
            label={translate('generic.metaExtend.powerConsumption')}
          />
        </Grid>
        <Grid middle item xs={12}>
          <MapNodeSelectInput
            style={{ marginTop: 0 }}
            fullWidth
            model={rest.type}
            icon={iconToMap({ iconElement: get(icon, 'iconElement', icon) })}
            activeIcon={iconToMap({ iconElement: get(icon, 'iconElement', icon), color: theme.materials.edit.color })}
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
MetaTankInput.propTypes = {
  theme: PropTypes.object,
  options: PropTypes.any,
  translate: PropTypes.func,
  onFromNodeChange: PropTypes.func,
  subFlex: PropTypes.bool,
  defaultCenter: PropTypes.object,
  defaultZoom: PropTypes.number,
};

export default MetaTankInput;
