import React from 'react';
import PropTypes from 'prop-types';
import FlexFormItem from './FlexFormItem';

const hiddenStyle = { display: 'none' };
// eslint-disable-next-line no-unused-vars
const FlexFormTab = ({ label, icon, hidden, children, basePath, record, resource, forward }) => (
  <div style={hidden ? hiddenStyle : null}>
    <FlexFormItem elements={children} forward={{ basePath, record, resource, ...forward }} />
  </div>
);

FlexFormTab.propTypes = {
  forward: PropTypes.object,
  children: PropTypes.node,
  hidden: PropTypes.bool,
  basePath: PropTypes.string,
  record: PropTypes.object,
  resource: PropTypes.string,
  label: PropTypes.any, // unuse for FlexFormItem
  icon: PropTypes.any, // unuse for FlexFormItem
};

export default FlexFormTab;
