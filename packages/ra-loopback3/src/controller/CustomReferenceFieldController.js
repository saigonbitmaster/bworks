import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';

import { crudGetManyAccumulate as crudGetManyAccumulateAction } from 'ra-core/lib/actions';
import { linkToRecord } from 'ra-core/lib/util';

/**
 * Fetch reference record, and delegate rendering to child component.
 *
 * The reference prop sould be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * By default, includes a link to the <Edit> page of the related record
 * (`/users/:userId` in the previous example).
 *
 * Set the linkType prop to "show" to link to the <Show> page instead.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users" linkType="show">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * You can also prevent `<ReferenceField>` from adding link to children by setting
 * `linkType` to false.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users" linkType={false}>
 *     <TextField source="name" />
 * </ReferenceField>
 */
export class CustomReferenceFieldController extends Component {
  state = {
    referenceRecord: null,
  };

  componentDidMount() {
    this.fetchReference(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (get(this.props, 'record.id') !== get(nextProps, 'record.id')) {
      this.fetchReference(nextProps);
    }
  }

  fetchReference(props) {
    if (props.customData) {
      props.customData(props.dataProvider, props.record).then(data => {
        // console.log('CustomReferenceFieldController fetchReference', data);
        if (data && data.isMounted) {
          this.setState({
            referenceRecord: data,
          });
        } else {
          this.setState({ referenceRecord: {} });
        }
      });
    } else {
      const source = props.fixSource ? props.fixSource(props.record) : get(props.record, props.source);
      if (source !== null && typeof source !== 'undefined') {
        this.props.crudGetManyAccumulate(props.reference, [source]);
      }
    }
  }

  render() {
    const {
      allowEmpty,
      basePath,
      children,
      linkType,
      record,
      reference,
      referenceRecord,
      resource,
      customData,
      source,
    } = this.props;
    const rootPath = basePath.replace(resource, reference);
    const resourceLinkPath = !linkType ? false : linkToRecord(rootPath, get(record, source), linkType);
    if (customData) {
      return children({
        isLoading: !this.state.referenceRecord && !allowEmpty,
        referenceRecord: this.state.referenceRecord,
        resourceLinkPath,
      });
    }
    return children({
      isLoading: !referenceRecord && !allowEmpty,
      referenceRecord,
      resourceLinkPath,
    });
  }
}

CustomReferenceFieldController.propTypes = {
  addLabel: PropTypes.bool,
  allowEmpty: PropTypes.bool.isRequired,
  basePath: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  classes: PropTypes.object,
  className: PropTypes.string,
  cellClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  crudGetManyAccumulate: PropTypes.func.isRequired,
  label: PropTypes.string,
  record: PropTypes.object,
  reference: PropTypes.string.isRequired,
  referenceRecord: PropTypes.object,
  resource: PropTypes.string,
  sortBy: PropTypes.string,
  source: PropTypes.string,
  translateChoice: PropTypes.any,
  fixSource: PropTypes.func,
  linkType: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  customData: PropTypes.func,
};

CustomReferenceFieldController.defaultProps = {
  allowEmpty: false,
  classes: {},
  linkType: 'edit',
  referenceRecord: null,
  record: {},
};

const mapStateToProps = (state, props) => ({
  referenceRecord:
    state.admin.resources[props.reference].data[
      props.fixSource ? props.fixSource(props.record) : get(props.record, props.source)
    ],
});

export default connect(mapStateToProps, {
  crudGetManyAccumulate: crudGetManyAccumulateAction,
})(CustomReferenceFieldController);
