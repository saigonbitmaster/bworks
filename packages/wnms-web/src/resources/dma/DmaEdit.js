import React, { Component } from 'react';
import { change } from 'redux-form';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Edit, TabbedFlexForm, FlexFormTab, translate, MetaFields } from 'ra-loopback3';
import DmaInfoInput from './DmaInfoInput';

const EditTitle = ({ record }) => <span>{record.name}</span>;
EditTitle.propTypes = { record: PropTypes.object };
class DmaEdit extends Component {
  static propTypes = {
    basePath: PropTypes.string,
    changeFieldValue: PropTypes.any,
    redirect: PropTypes.string,
  };

  formRef = React.createRef();

  render() {
    const { changeFieldValue, redirect, basePath: rawPath, ...rest } = this.props;
    let basePath = rawPath.replace(':model', rest.model);
    // console.log('dmaedit', this.props);
    return (
      <Edit {...rest} resource="dmas" undoable={false} title={<EditTitle />} basePath={basePath}>
        <TabbedFlexForm redirect={redirect} formRef={this.formRef}>
          <FlexFormTab label={rest.translate('generic.info')}>
            <DmaInfoInput formRef={this.formRef} />
          </FlexFormTab>
          <FlexFormTab label={rest.translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changeFieldValue: bindActionCreators(change, dispatch),
});
const enhance = compose(translate, connect(null, mapDispatchToProps));
export default enhance(DmaEdit);
