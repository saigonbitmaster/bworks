import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
// import { RecordVoiceOver as CustomerNumberIcon } from '@material-ui/icons';

export default class CustomerContactVew extends Component {
  static propTypes = {
    conversation: PropTypes.object,
  };

  render() {
    const { conversation } = this.props;
    const phone = get(conversation, 'data.data.phoneNumber', 'Unknown Number');
    return <label style={{ paddingLeft: 8 }}>{phone}</label>;
  }
}
