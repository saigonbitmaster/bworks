import React from 'react';
import { Button } from 'ra-loopback3';
import { ClientContractIcon } from '../../styles/Icons';

const ApprovedButton = ({ record, handleApproved, ...rest }) => {
  // Invoke the API to approve
  return (
    <Button {...rest} disabled={record.approved} onClick={() => handleApproved(record.id)}>
      <ClientContractIcon />
    </Button>
  );
};

export default ApprovedButton;
