import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withDataProvider, CUSTOM, Edit, TabbedFlexForm, FlexFormTab, MetaFields, translate } from 'ra-loopback3';
import camelcase from 'camelcase';
import MaterialUseInfoInput from './MaterialUseInfoInput';

const MaterialUseEditTitle = ({ record }) => <span>{record.name}</span>;
MaterialUseEditTitle.propTypes = { record: PropTypes.object };

class MaterialUseEdit extends Component {
  formRef = React.createRef;
  save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    // console.log(record);
    this.props.dataProvider(
      CUSTOM,
      'materialuses',
      {
        method: 'PUT',
        subUrl: `editMatInMap/${record.id}`,
        body: { data: record },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };
  render() {
    const { dataProvider, translate, dispatch, redirect, model: type, icon, basePath: rawPath, ...rest } = this.props;
    let basePath = rawPath.replace(':model', type);
    return (
      <Edit
        save={this.save}
        {...rest}
        resource="materialuses"
        undoable={false}
        basePath={basePath}
        title={<MaterialUseEditTitle translate={translate} label={`resources.materialuses.${camelcase(type)}Create`} />}
      >
        <TabbedFlexForm formRef={this.formRef} redirect={redirect}>
          <FlexFormTab label={translate('generic.info')}>
            <MaterialUseInfoInput
              subFlex
              formRef={this.formRef}
              icon={icon}
              type={type}
              {...rest}
              translate={translate}
              flgEdit={'true'}
            />
          </FlexFormTab>
          <FlexFormTab label={translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}
MaterialUseEdit.propTypes = {
  basePath: PropTypes.string,
  icon: PropTypes.any,
  redirect: PropTypes.string,
  dispatch: PropTypes.any,
  translate: PropTypes.func,
  model: PropTypes.string,
  dataProvider: PropTypes.func,
};

const enhance = compose(withDataProvider, translate);
export default enhance(MaterialUseEdit);
