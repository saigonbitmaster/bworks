import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlexItemForward, MapNodeSelectInput, required } from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import get from 'lodash/get';
import { iconToMap } from '../../styles/Icons';

class MetaOtherInput extends Component {
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
MetaOtherInput.propTypes = {
  theme: PropTypes.object,
  options: PropTypes.any,
  translate: PropTypes.func,
  onFromNodeChange: PropTypes.func,
  subFlex: PropTypes.bool,
  defaultCenter: PropTypes.object,
  defaultZoom: PropTypes.number,
};

export default MetaOtherInput;
