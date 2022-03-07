import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

const HiddenInput = ({ source }) => {
  return <Field name={source} component="input" type="hidden" placeholder="latitude" />;
};
HiddenInput.propTypes = {
  source: PropTypes.string,
};

export default HiddenInput;
