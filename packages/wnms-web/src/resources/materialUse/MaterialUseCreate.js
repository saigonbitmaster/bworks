import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Create, FlexForm, translate, CUSTOM, withDataProvider } from 'ra-loopback3';
import camelcase from 'camelcase';
import MaterialUseInfoInput from './MaterialUseInfoInput';

const MaterialUseCreateTitle = ({ label }) => <span>{label}</span>;
MaterialUseCreateTitle.propTypes = { label: PropTypes.string.isRequired };

class MaterialUseCreate extends Component {
  formRef = React.createRef;
  save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    // console.log(record);
    this.props.dataProvider(
      CUSTOM,
      'materialuses',
      {
        method: 'POST',
        subUrl: 'createMatInMap',
        body: { data: record },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };

  render() {
    const { dataProvider, translate, dispatch, model: type, redirect, basePath: rawPath, ...rest } = this.props;
    let basePath = rawPath.replace(':model', type);
    return (
      <Create
        {...rest}
        resource="materialuses"
        basePath={basePath}
        undoable={false}
        title={
          <MaterialUseCreateTitle
            label={translate('ra.page.create', {
              name: translate(`resources.materialstocks.types.${camelcase(type)}`).toLowerCase(),
            })}
          />
        }
        hasList
        save={this.save}
      >
        <FlexForm formRef={this.formRef} defaultValue={{ type: type, useStartDate: new Date() }} redirect={redirect}>
          <MaterialUseInfoInput formRef={this.formRef} type={type} {...rest} translate={translate} />
        </FlexForm>
      </Create>
    );
  }
}
MaterialUseCreate.propTypes = {
  basePath: PropTypes.string,
  icon: PropTypes.any,
  redirect: PropTypes.string,
  dispatch: PropTypes.any,
  translate: PropTypes.func,
  model: PropTypes.string,
  dataProvider: PropTypes.func,
};

const enhance = compose(withDataProvider, translate);
export default enhance(MaterialUseCreate);
