import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Create, FlexForm, translate, withDataProvider } from 'ra-loopback3';
import PumpStationInfoInput from './PumpStationInfoInput';

const PumpStationCreateTitle = ({ label }) => <span>{label}</span>;
PumpStationCreateTitle.propTypes = { label: PropTypes.string.isRequired };
class PumpStationCreate extends Component {
  formRef = React.createRef;
  render() {
    const { dataProvider, translate, dispatch, redirect, ...rest } = this.props;
    return (
      <Create
        {...rest}
        resource="pumpstations"
        undoable={false}
        title={
          <PumpStationCreateTitle
            label={translate('ra.page.create', {
              name: translate('resources.pumpstations.name'),
            })}
          />
        }
      >
        <FlexForm formRef={this.formRef} redirect={'list'}>
          <PumpStationInfoInput subFlex formRef={this.formRef} {...rest} translate={translate} />
        </FlexForm>
      </Create>
    );
  }
}
PumpStationCreate.propTypes = {
  basePath: PropTypes.string,
  redirect: PropTypes.string,
  dispatch: PropTypes.any,
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
};

const enhance = compose(withDataProvider, translate);
export default enhance(PumpStationCreate);
