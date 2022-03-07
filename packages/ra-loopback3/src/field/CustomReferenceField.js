import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import LinearProgress from 'ra-ui-materialui/lib/layout/LinearProgress';
import Link from 'ra-ui-materialui/lib/Link';
import sanitizeRestProps from 'ra-ui-materialui/lib/field/sanitizeRestProps';
import CustomReferenceFieldController from '../controller/CustomReferenceFieldController';

const styles = theme => ({
  link: {
    color: theme.palette.primary.main,
  },
});

export const CustomReferenceFieldView = ({
  allowEmpty,
  basePath,
  children,
  className,
  classes = {},
  isLoading,
  record,
  reference,
  referenceRecord,
  resource,
  resourceLinkPath,
  source,
  translateChoice = false,
  customData,
  fixSource,
  ...rest
}) => {
  if (isLoading) {
    return <LinearProgress />;
  }

  if (resourceLinkPath) {
    return (
      <Link className={classnames(classes.link, className)} to={resourceLinkPath}>
        {React.cloneElement(children, {
          record: referenceRecord,
          resource: reference,
          allowEmpty,
          basePath,
          translateChoice,
          ...sanitizeRestProps(rest),
        })}
      </Link>
    );
  }

  return React.cloneElement(children, {
    record: referenceRecord,
    resource: reference,
    allowEmpty,
    basePath,
    translateChoice,
    ...sanitizeRestProps(rest),
  });
};

CustomReferenceFieldView.propTypes = {
  allowEmpty: PropTypes.bool,
  basePath: PropTypes.string,
  children: PropTypes.element,
  className: PropTypes.string,
  classes: PropTypes.object,
  isLoading: PropTypes.bool,
  record: PropTypes.object,
  reference: PropTypes.string,
  referenceRecord: PropTypes.object,
  resource: PropTypes.string,
  source: PropTypes.string,
  fixSource: PropTypes.func,
  customData: PropTypes.func,
  resourceLinkPath: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  translateChoice: PropTypes.bool,
};

/**
 * Fetch reference record, and delegate rendering to child component.
 *
 * The reference prop sould be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example
 * <CustomReferenceField label="User" source="userId" reference="users">
 *     <TextField source="name" />
 * </CustomReferenceField>
 *
 * By default, includes a link to the <Edit> page of the related record
 * (`/users/:userId` in the previous example).
 *
 * Set the linkType prop to "show" to link to the <Show> page instead.
 *
 * @example
 * <CustomReferenceField label="User" source="userId" reference="users" linkType="show">
 *     <TextField source="name" />
 * </CustomReferenceField>
 *
 * You can also prevent `<CustomReferenceField>` from adding link to children by setting
 * `linkType` to false.
 *
 * @example
 * <CustomReferenceField label="User" source="userId" reference="users" linkType={false}>
 *     <TextField source="name" />
 * </CustomReferenceField>
 */
const CustomReferenceField = ({ children, ...props }) => {
  if (React.Children.count(children) !== 1) {
    throw new Error('<ReferenceField> only accepts a single child');
  }
  return (
    <CustomReferenceFieldController {...props}>
      {controllerProps => <CustomReferenceFieldView {...props} {...{ children, ...controllerProps }} />}
    </CustomReferenceFieldController>
  );
};

CustomReferenceField.propTypes = {
  addLabel: PropTypes.bool,
  allowEmpty: PropTypes.bool.isRequired,
  basePath: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  classes: PropTypes.object,
  className: PropTypes.string,
  cellClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  label: PropTypes.string,
  record: PropTypes.object,
  reference: PropTypes.string.isRequired,
  resource: PropTypes.string,
  source: PropTypes.string.isRequired,
  translateChoice: PropTypes.any,
  linkType: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  customData: PropTypes.func,
};

CustomReferenceField.defaultProps = {
  allowEmpty: false,
  classes: {},
  linkType: 'edit',
  record: {},
};

const EnhancedCustomReferenceField = withStyles(styles)(CustomReferenceField);

EnhancedCustomReferenceField.defaultProps = {
  addLabel: true,
};

export default EnhancedCustomReferenceField;
