import React, { Component, Fragment } from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { translate, Edit, TabbedFlexForm, FlexFormTab, MetaFields, withDataProvider, CUSTOM } from 'ra-loopback3';
import { withStyles } from '@material-ui/core/styles';
import ClientMeterNumberInfoInput from './ClientMeterNumberInfoInput';
import menuConfig from '../../Config';

const style = theme => ({
  errorSnackbar: {
    background: theme.palette.common.dark,
    margin: theme.spacing(1),
  },
});

class ClientMeterNumberEdit extends Component {
  constructor(props) {
    super(props);
    this.state = { replaceInvoice: false };
  }

  componentDidMount = () => {
    this.props
      .dataProvider(CUSTOM, 'ClientMeterNumbers', {
        method: 'GET',
        subUrl: 'shouldReplaceEinvoice',
        query: { id: this.props.id },
      })
      .then(({ data: { result } }) => {
        if (result) this.setState({ replaceInvoice: true });
      });
  };

  save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    this.props.dataProvider(
      CUSTOM,
      'clientmeternumbers',
      {
        method: 'POST',
        subUrl: 'updateMonth',
        body: { data: record, project: menuConfig.projectKey },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };

  render() {
    const {
      translate,
      dispatch,
      hasEdit,
      hasCreate,
      hasShow,
      hasDelete,
      hasList,
      dataProvider,
      classes,
      ...rest
    } = this.props;
    const { replaceInvoice } = this.state;

    return (
      <Fragment>
        <Edit {...rest} save={this.save} hasList>
          <TabbedFlexForm redirect={'list'} {...rest}>
            <FlexFormTab key={1} label={translate('generic.info')}>
              <ClientMeterNumberInfoInput
                subFlex
                dataProvider={dataProvider}
                translate={translate}
                replaceInvoice={replaceInvoice}
              />
            </FlexFormTab>
            <FlexFormTab key={2} label={translate('generic.meta')}>
              <MetaFields />
            </FlexFormTab>
          </TabbedFlexForm>
        </Edit>
      </Fragment>
    );
  }
}
ClientMeterNumberEdit.propTypes = {
  id: PropTypes.string,
  hasEdit: PropTypes.any,
  hasCreate: PropTypes.any,
  hasShow: PropTypes.any,
  hasList: PropTypes.any,
  hasDelete: PropTypes.any,
  dataProvider: PropTypes.func,
  translate: PropTypes.func,
  dispatch: PropTypes.any,
  classes: PropTypes.object,
};
const enhance = compose(translate, withDataProvider, withStyles(style));
export default enhance(ClientMeterNumberEdit);
