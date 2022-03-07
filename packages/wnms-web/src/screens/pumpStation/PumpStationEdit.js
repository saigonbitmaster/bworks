import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withDataProvider, Edit, TabbedFlexForm, FlexFormTab, MetaFields, translate } from 'ra-loopback3';
import PumpStationInfoInput from './PumpStationInfoInput';

const PumpStationEditTitle = ({ record }) => <span>{record.name}</span>;
PumpStationEditTitle.propTypes = { record: PropTypes.object };
class PumpStationEdit extends Component {
  formRef = React.createRef;
  render() {
    const { dataProvider, translate, dispatch, redirect, basePath, ...rest } = this.props;
    return (
      <Edit
        {...rest}
        resource="pumpstations"
        undoable={false}
        basePath={basePath}
        title={<PumpStationEditTitle translate={translate} />}
      >
        <TabbedFlexForm formRef={this.formRef} redirect={redirect}>
          <FlexFormTab label={translate('generic.info')}>
            <PumpStationInfoInput subFlex formRef={this.formRef} {...rest} translate={translate} />
          </FlexFormTab>
          <FlexFormTab label={translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}
PumpStationEdit.propTypes = {
  basePath: PropTypes.string,
  redirect: PropTypes.string,
  dispatch: PropTypes.any,
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
};

const enhance = compose(withDataProvider, translate);
export default enhance(PumpStationEdit);
