import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlexForm,
  Create,
  TextInput,
  NumberInput,
  DateInput,
  minValue,
  required,
  SelectInput,
  ReferenceInput,
  translate,
  MaterialSelectInput,
  FormDataConsumer,
  Button,
  ListButton,
  minLength,
  maxLength,
  CardActions,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { push as pushAction } from 'react-router-redux';
import queryString from 'query-string';
import { AddMatTypeIcon } from '../../styles/Icons';
import common from '../../util/common';
class RawPostActions extends Component {
  onClickCreateMatType = () => {
    const { location } = this.props;
    let query = queryString.stringify({ redirect: location.pathname });
    this.props.push(`/materialDetailType/create?${query}`);
  };
  render() {
    const { translate, hasList, hasEdit, hasShow, hasCreate, push, ...rest } = this.props;
    return (
      <CardActions>
        <Button
          onClick={this.onClickCreateMatType}
          label={this.props.translate('resources.materialdetailtypes.createMatType')}
        >
          <AddMatTypeIcon />
        </Button>
        <ListButton {...rest} />
      </CardActions>
    );
  }
}
RawPostActions.propTypes = {
  push: PropTypes.func,
  translate: PropTypes.func,
  basePath: PropTypes.string,
  location: PropTypes.object,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};
const PostActions = connect(null, {
  push: pushAction,
})(RawPostActions);

class ImportMatStock extends Component {
  formRef = React.createRef();
  onMaterialChange = () => {
    this.formRef.current.props.reset();
  };
  render() {
    const { translate, ...rest } = this.props;
    // console.log(this.props);
    return (
      <Create
        {...rest}
        title={'generic.manageMat.importStock'}
        resource="materialstocks"
        actions={<PostActions {...this.props} />}
      >
        <FlexForm
          formRef={this.formRef}
          style={{ flexGrow: 1 }}
          spacing={2}
          redirect="list"
          defaultValue={{ importDate: new Date(), dom: new Date(), usedTime: 0 }}
        >
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <MaterialSelectInput
                allowEmpty
                source={'type'}
                validate={[required()]}
                onChange={this.onMaterialChange}
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <FormDataConsumer>
                {({ formData, staticcontext, ...rest }) => {
                  let filter = undefined;
                  if (formData.type) {
                    filter = { type: formData.type };
                    return (
                      <ReferenceInput
                        key={formData.type}
                        reference="materialdetailtypes"
                        source="detailTypeId"
                        {...rest}
                        filter={filter}
                        allowEmpty
                        label={translate('resources.materialstocks.selectMat')}
                        validate={[required()]}
                      >
                        <SelectInput optionText="name" />
                      </ReferenceInput>
                    );
                  } else {
                    return (
                      <TextInput
                        source="detailTypeId"
                        label={translate('resources.materialstocks.selectMat')}
                        validate={[required()]}
                        disabled
                      />
                    );
                  }
                }}
              </FormDataConsumer>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required(), minLength(3), maxLength(32)]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <FormDataConsumer>
                {({ formData }) => {
                  let label = `${translate('resources.materialstocks.fields.initValue')}`;
                  if (formData.type) {
                    let unit = translate(common.getUnitByMatType(formData.type));
                    label = `${label} (${unit})`;
                  }
                  return (
                    <NumberInput
                      source="initValue"
                      label={label}
                      validate={[required(), minValue(0)]}
                      style={{ width: 250 }}
                    />
                  );
                }}
              </FormDataConsumer>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="egeTime" validate={[required(), minValue(0)]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="usedTime" validate={[required(), minValue(0)]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateInput source="dom" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateInput source="importDate" validate={[required()]} />
            </Grid>
          </Grid>
        </FlexForm>
      </Create>
    );
  }
}
ImportMatStock.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
};

ImportMatStock.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default compose(translate)(ImportMatStock);
