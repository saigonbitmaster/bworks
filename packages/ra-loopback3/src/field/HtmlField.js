import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import pure from 'recompose/pure';
import { default as sanitizeRestProps } from 'ra-ui-materialui/lib/input/sanitizeRestProps';

const HtmlField = ({ className, source, record = {}, addLabel, ...rest }) => {
  return (
    <div
      className={className}
      style={{ position: 'relative' }}
      {...sanitizeRestProps(rest)}
      dangerouslySetInnerHTML={{ __html: get(record, source) }}
    />
  );
};

HtmlField.propTypes = {
  addLabel: PropTypes.bool,
  basePath: PropTypes.string,
  className: PropTypes.string,
  cellClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
};

const PureHtmlField = pure(HtmlField);

PureHtmlField.defaultProps = {
  addLabel: true,
};

export default PureHtmlField;
