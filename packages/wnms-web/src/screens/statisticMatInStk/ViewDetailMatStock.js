import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Button,
  CardActions,
  CustomPage,
  Datagrid,
  TextField,
  NumberWithUnitField,
  translate,
} from 'ra-loopback3';
import { BackIcon } from '../../styles/Icons';
import { goBack } from 'react-router-redux';
import { compose } from 'recompose';
import { connect } from 'react-redux';
class ViewDetailMatStock extends Component {
  static propTypes = {
    match: PropTypes.object,
    translate: PropTypes.func,
    goBack: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      idTypeMat: this.props.match.params.idTypeMat,
    };
  }
  actions = () => {
    return (
      <CardActions>
        <Button label={this.props.translate('generic.back')} onClick={() => this.props.goBack()}>
          <BackIcon />
        </Button>
      </CardActions>
    );
  };
  render() {
    const { translate, goBack, ...rest } = this.props;
    const { idTypeMat } = this.state;
    let CustomActions = this.actions;
    return (
      <CustomPage title={translate('generic.detail')} card header actions={<CustomActions />}>
        <List
          {...rest}
          resource="customstatisticmatstocks"
          bulkActionButtons={false}
          fixUrl="materialstocks/viewDetailMatStock"
          filter={{ idTypeMat } || {}}
          hideHeader
        >
          <Datagrid>
            <TextField source="name" />
            <NumberWithUnitField source="totalInitValue" unitKey={'unit'} translate={translate} textAlign={'left'} />
            <NumberWithUnitField source="totalExportValue" unitKey={'unit'} translate={translate} textAlign={'left'} />
            <NumberWithUnitField source="totalUseValue" unitKey={'unit'} translate={translate} textAlign={'left'} />
            <NumberWithUnitField source="adjustValue" unitKey={'unit'} translate={translate} textAlign={'left'} />
            <NumberWithUnitField source="totalCurrentValue" unitKey={'unit'} translate={translate} textAlign={'left'} />
          </Datagrid>
        </List>
      </CustomPage>
    );
  }
}

const enhance = compose(translate, connect(null, { goBack }));
export default enhance(ViewDetailMatStock);
