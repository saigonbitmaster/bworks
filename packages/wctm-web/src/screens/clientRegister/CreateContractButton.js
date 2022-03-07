import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import { Button } from 'ra-loopback3';
import { Link } from 'react-router-dom';
import { ClientContractIcon } from '../../styles/Icons';

@pure
export default class CreateContractButton extends Component {
  static propTypes = {
    record: PropTypes.object,
    basePath: PropTypes.string,
  };

  render() {
    const { record, basePath } = this.props;
    let flgShow = record.status === 'NEW' && record.statusSurvey && record.resultSurvey;
    return (
      <Button
        component={Link}
        label="generic.signContract"
        disabled={!flgShow}
        to={{ pathname: `${basePath}/contract`, state: { clientRegister: record } }}
      >
        <ClientContractIcon />
      </Button>
    );
  }
}
