import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Create, FlexForm, translate, withDataProvider } from 'ra-loopback3';
import PipeInfoInput from './PipeInfoInput';

const PipeCreateTitle = ({ label }) => <span>{label}</span>;
PipeCreateTitle.propTypes = { label: PropTypes.string.isRequired };
class PipeCreate extends Component {
  formRef = React.createRef;
  render() {
    const { dataProvider, translate, dispatch, redirect, ...rest } = this.props;
    return (
      <Create
        {...rest}
        resource="pipes"
        undoable={false}
        title={
          <PipeCreateTitle
            label={translate('ra.page.create', {
              name: translate('resources.pipes.name'),
            })}
          />
        }
      >
        <FlexForm formRef={this.formRef} redirect={'list'}>
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
