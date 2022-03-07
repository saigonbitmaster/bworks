import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import FlexFieldItem from './FlexFieldItem';

const styles = {
  root: { padding: '0 1em 1em 1em' },
};

const sanitizeRestProps = ({
  children,
  className,
  classes,
  record,
  resource,
  basePath,
  version,
  initialValues,
  translate,
  ...rest
}) => rest;

/**
 * Simple Layout for a Show view, showing fields in one column.
 *
 * Receives the current `record` from the parent `<Show>` component,
 * and passes it to its childen. Children should be Field-like components.
 *
 * @example
 *     // in src/posts.js
 *     import React from 'react';
 *     import { Show, FlexShowLayout, TextField } from 'ra-loopback3/client';
 *
 *     export const PostShow = (props) => (
 *         <Show {...props}>
 *             <FlexShowLayout>
 *                <div middle>
 *                  <TextField source="title" />
 *                </div>
 *             </FlexShowLayout>
 *         </Show>
 *     );
 *
 *     // in src/App.js
 *     import React from 'react';
 *     import { Admin, Resource } from 'ra-loopback3/client';
 *
 *     import { PostShow } from './posts';
 *
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" show={PostShow} />
 *         </Admin>
 *     );
 *     export default App;
 */
export const FlexShowLayout = ({ basePath, className, children, classes, record, resource, version, ...rest }) => (
  <div className={classnames(classes.root, className)} key={version} {...sanitizeRestProps(rest)}>
    <FlexFieldItem elements={children} forward={{ basePath, record, resource }} />
  </div>
);

FlexShowLayout.propTypes = {
  basePath: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  classes: PropTypes.object,
  record: PropTypes.object,
  resource: PropTypes.string,
  version: PropTypes.number,
};

export default withStyles(styles)(FlexShowLayout);
