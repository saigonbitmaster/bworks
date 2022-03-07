import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Create, FlexForm, translate, CUSTOM, withDataProvider } from 'ra-loopback3';
import PipeInfoInput from './PipeInfoInput';

const PipeCreateTitle = ({ label }) => <span>{label}</span>;
PipeCreateTitle.propTypes = { label: PropTypes.string.isRequired };
class PipeCreate extends Component {
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
    const { dataProvider, translate, dispatch, redirect, basePath: rawPath, ...rest } = this.props;
    let basePath = rawPath.replace(':model', rest.model);
    return (
      <Create
        {...rest}
        resource="materialuses"
        undoable={false}
        basePath={basePath}
        title={
          <PipeCreateTitle
            label={translate('ra.page.create', {
              name: translate('resources.materialstocks.types.pipe').toLowerCase(),
            })}
          />
        }
        save={this.save}
      >
        <FlexForm formRef={this.formRef} defaultValue={{ type: 'Pipe', useStartDate: new Date() }} redirect={redirect}>
          <PipeInfoInput subFlex formRef={this.formRef} {...rest} translate={translate} />
        </FlexForm>
      </Create>
    );
  }
}
PipeCreate.propTypes = {
  basePath: PropTypes.string,
  redirect: PropTypes.string,
  dispatch: PropTypes.any,
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
};

const enhance = compose(withDataProvider, translate);
export default enhance(PipeCreate);
