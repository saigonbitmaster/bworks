import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate, Create, FlexForm } from 'ra-loopback3';
import { compose } from 'recompose';
import DmaInfoInput from './DmaInfoInput';

const CreateTitle = ({ label }) => <span>{label}</span>;
CreateTitle.propTypes = { label: PropTypes.string.isRequired };

class DmaCreate extends Component {
  static propTypes = {
    basePath: PropTypes.string,
    model: PropTypes.string,
    changeFieldValue: PropTypes.any,
    redirect: PropTypes.string,
    translate: PropTypes.func,
  };
  formRef = React.createRef();

  render() {
    const { translate, redirect, basePath: rawPath, ...rest } = this.props;
    let basePath = rawPath.replace(':model', rest.model);
    return (
      <Create
        {...rest}
        resource="dmas"
        undoable={false}
        basePath={basePath}
        title={
          <CreateTitle
            label={translate('ra.page.create', {
              name: 'DMA',
            })}
          />
        }
      >
        <FlexForm redirect={redirect} validate={this.validateForm} formRef={this.formRef} defaultValue={{ level: 1 }}>
          <DmaInfoInput formRef={this.formRef} />
        </FlexForm>
      </Create>
    );
  }
}
const enhance = compose(translate);
export default enhance(DmaCreate);
