import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextInput,
  required,
  translate,
  EditorInput,
  withDataProvider,
  HiddenInput,
  BooleanInput,
  FlexItemForward,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import { get } from 'lodash';
import ImportButton from './ImportButton';
class CreateKml extends Component {
  getFile = val => {
    // console.log('get file', val);
    let { formRef } = this.props;
    let fileNameReal = get(val, 'fileNameReal', '');
    let fileNameS3 = get(val, 'fileNameS3', '');
    let urlS3 = get(val, 'urlS3', '');
    if (formRef && fileNameReal !== '' && fileNameS3 !== '' && urlS3 !== '') {
      formRef.current.props.change('fileNameReal', fileNameReal);
      formRef.current.props.change('fileNameS3', fileNameS3);
      formRef.current.props.change('urlS3', urlS3);
    }
  };

  render() {
    // eslint-disable-next-line
    const { translate, ...rest } = this.props;
    return (
      <FlexItemForward>
        <HiddenInput source="fileNameS3" />
        <HiddenInput source="urlS3" />
        <Grid middle container spacing={2}>
          <Grid middle item xs={12} sm={12}>
            <TextInput
              label={translate('resources.kmls.fields.fileNameReal')}
              source="fileNameReal"
              validate={[required()]}
              disabled
            />
          </Grid>
          <Grid middle item xs={12} sm={12}>
            <ImportButton {...this.props} getFile={this.getFile} />
          </Grid>
          <Grid middle item xs={12} sm={12}>
            <BooleanInput source="active" label={translate('resources.kmls.fields.active')} />
          </Grid>
          <Grid middle item xs={12} sm={12}>
            <EditorInput fullWidth source="description" label={translate('resources.kmls.fields.description')} />
          </Grid>
        </Grid>
      </FlexItemForward>
    );
  }
}
CreateKml.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  formRef: PropTypes.any,
};

CreateKml.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default compose(translate, withDataProvider)(CreateKml);
