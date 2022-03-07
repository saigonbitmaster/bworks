import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiTab from '@material-ui/core/Tab';
import { translate } from 'react-admin';

import classnames from 'classnames';
import FlexFieldItem from './FlexFieldItem';

/**
 * Tab element for the SimpleShowLayout.
 *
 * The `<Tab>` component accepts the following props:
 *
 * - label: The string displayed for each tab
 * - icon: The icon to show before the label (optional). Must be an element.
 *
 * @example
 *     // in src/posts.js
 *     import React from 'react';
 *     import FavoriteIcon from '@material-ui/icons/Favorite';
 *     import PersonPinIcon from '@material-ui/icons/PersonPin';
 *     import { Show, TabbedFlexShowLayout, FlexShowTab, TextField } from 'react-admin';
 *
 *     export const PostShow = (props) => (
 *         <Show {...props}>
 *             <TabbedFlexShowLayout>
 *                 <FlexShowTab label="Content" icon={<FavoriteIcon />}>
 *                     <TextField source="title" />
 *                     <TextField source="subtitle" />
 *                </FlexShowTab>
 *                 <FlexShowTab label="Metadata" icon={<PersonIcon />}>
 *                     <TextField source="category" />
 *                </FlexShowTab>
 *             </TabbedFlexShowLayout>
 *         </Show>
 *     );
 *
 *     // in src/App.js
 *     import React from 'react';
 *     import { Admin, Resource } from 'react-admin';
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
class FlexShowTab extends Component {
  renderHeader = ({ className, label, icon, value, translate, ...rest }) => (
    <MuiTab
      key={label}
      label={translate(label, { _: label })}
      value={value}
      icon={icon}
      className={classnames('show-tab', className)}
      {...rest}
    />
  );

  renderContent = ({ className, children, ...rest }) => (
    <div className={className}>
      <FlexFieldItem elements={children} forward={rest} />
    </div>
  );

  render() {
    const { children, className, context, icon, label, translate, value, ...rest } = this.props;
    return context === 'header'
      ? this.renderHeader({
          className,
          label,
          icon,
          value,
          translate,
          ...rest,
        })
      : this.renderContent({ children, className, ...rest });
  }
}

FlexShowTab.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  context: PropTypes.oneOf(['header', 'content']),
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
  value: PropTypes.number,
};

export default translate(FlexShowTab);
