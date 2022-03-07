import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import {
  Edit,
  TabbedFlexForm,
  translate,
  TextInput,
  MapNodeInput,
  TagInput,
  EditorInput,
  required,
  minLength,
  maxLength,
  FlexFormTab,
  MetaFields,
} from 'ra-loopback3';
import Geocode from 'react-geocode';
import { NodeIcon } from '../../styles/Icons';
import { KmlView } from 'web-common';

const EditTitle = ({ record }) => <span>{record.name}</span>;
EditTitle.propTypes = { record: PropTypes.object };

class PipeEdit extends Component {
  state = { dmaId: '' };
  formRef = React.createRef();
  onPositionChange = (e, position) => {
    Geocode.fromLatLng(position.lat, position.lng).then(response => {
      const address = response.results[0].formatted_address || '';
      let size = address.indexOf(',', 20);
      size = size > 20 ? size : 20;
      this.formRef.current.props.change('name', address.substr(0, size));
    });
  };
  render() {
    const { translate, zoom, center, dispatch, basePath: rawPath, ...rest } = this.props;
    let basePath = rawPath.replace(':model', rest.model);
    return (
      <Edit
        {...rest}
        resource="nodes"
        undoable={false}
        basePath={basePath}
        redirect={rest.redirect || 'list'}
        title={<EditTitle />}
      >
        <TabbedFlexForm formRef={this.formRef}>
          <FlexFormTab label={translate('generic.info')}>
            <Grid middle container spacing={2}>
              <Grid middle item xs={12} sm={6}>
                <TextInput source="name" validate={[required(), minLength(3), maxLength(64)]} />
              </Grid>
              <Grid middle item xs={12}>
                <Typography variant={'caption'}>{translate('resources.nodes.position')}</Typography>
                <MapNodeInput
                  style={{ marginTop: 0 }}
                  fullWidth
                  zoom={zoom}
                  icon={<NodeIcon />}
                  source="position"
                  onChange={this.onPositionChange}
                  validate={[required()]}
                >
                  <KmlView common="all" />
                </MapNodeInput>
              </Grid>
              <Grid middle item xs={12}>
                <TagInput source="tags" />
              </Grid>
              <Grid middle item xs={12}>
                <EditorInput fullWidth source="description" />
              </Grid>
            </Grid>
          </FlexFormTab>
          <FlexFormTab label={translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}
PipeEdit.propTypes = {
  basePath: PropTypes.string,
  dispatch: PropTypes.any,
  translate: PropTypes.func,
  zoom: PropTypes.number,
  center: PropTypes.object,
};
const mapStateToProps = state => ({
  zoom: state.design.defaultZoom,
});
const enhance = compose(connect(mapStateToProps), translate);
export default enhance(PipeEdit);
