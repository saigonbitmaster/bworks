import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import {
  Create,
  FlexForm,
  translate,
  TextInput,
  MapNodeInput,
  TagInput,
  EditorInput,
  required,
  minLength,
  maxLength,
} from 'ra-loopback3';
import Geocode from 'react-geocode';
import { NodeIcon } from '../../styles/Icons';
import { KmlView } from 'web-common';
const CreateNode = ({ label }) => <span>{label}</span>;
CreateNode.propTypes = { label: PropTypes.string.isRequired };

class PipeCreate extends Component {
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
    // console.log(rest);
    return (
      <Create
        {...rest}
        resource="nodes"
        undoable={false}
        basePath={basePath}
        title={
          <CreateNode
            label={translate('ra.page.create', {
              name: translate('resources.nodes.name').toLowerCase(),
            })}
          />
        }
      >
        <FlexForm formRef={this.formRef} redirect={rest.redirect}>
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
                center={center}
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
        </FlexForm>
      </Create>
    );
  }
}
PipeCreate.propTypes = {
  basePath: PropTypes.string,
  dispatch: PropTypes.any,
  translate: PropTypes.func,
  zoom: PropTypes.number,
  center: PropTypes.object,
};
const mapStateToProps = state => ({
  zoom: state.design.defaultZoom,
  center: state.design.defaultCenter,
});
const enhance = compose(connect(mapStateToProps), translate);
export default enhance(PipeCreate);
