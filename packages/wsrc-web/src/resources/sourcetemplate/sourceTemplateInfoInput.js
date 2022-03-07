import React, { Component } from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import {
  SelectInput,
  DisabledInput,
  translate,
  withDataProvider,
  SingleFileInput,
  EditorInput,
  FlexItemForward,
  TextInput,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';

class SourceTemplateInfoInput extends Component {
  render() {
    const { enumId, id, translate, dataProvider, ...rest } = this.props;
    return (
      <FlexItemForward {...rest}>
        <Grid middle="true" container spacing={2}>
          <Grid middle="true" item xs={12} sm={6}>
            {id ? <DisabledInput source="id" /> : <SelectInput source="id" choices={enumId} />}
          </Grid>
          <Grid middle="true" item xs={12} sm={6}>
            <TextInput source="name" choices={enumId} />
          </Grid>
          <Grid middle="true" item xs={12} sm={6}>
            <SingleFileInput
              accept=".doc, .docx"
              source="data"
              storage="SourceFiles"
              translate={translate}
              dataProvider={dataProvider}
            />
          </Grid>
          <Grid middle="true" item xs={12} sm={12}>
            <EditorInput fullWidth source="description" />
          </Grid>
        </Grid>
      </FlexItemForward>
    );
  }
}

SourceTemplateInfoInput.propTypes = {
  dataProvider: PropTypes.func,
  translate: PropTypes.any,
  enumId: PropTypes.any,
  id: PropTypes.string,
};

const enhance = compose(translate, withDataProvider);

export default enhance(SourceTemplateInfoInput);
