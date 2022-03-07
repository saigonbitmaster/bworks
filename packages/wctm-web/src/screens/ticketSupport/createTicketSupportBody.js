import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ra-loopback3';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { AnswerIcon } from '../../styles/Icons';

const styles = {
  button: {
    margin: '10px 24px',
    position: 'relative',
  },
  iconPaddingStyle: {
    paddingRight: '0.5em',
  },
};

const CreateTicketSupportBodies = ({ record, translate }) => (
  <Button
    label={translate('generic.answerButtonLable')}
    disabled={record.id === undefined || record.isClosed}
    component={Link}
    color="primary"
    variant="raised"
    to={{
      pathname: '/ticketsupport/ticketbody',
      state: { record: { ticketSupportId: record.id } },
    }}
  >
    <AnswerIcon />
  </Button>
);
CreateTicketSupportBodies.propTypes = {
  record: PropTypes.object,
  translate: PropTypes.func,
};

export default withStyles(styles)(CreateTicketSupportBodies);
