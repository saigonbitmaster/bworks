import React, { Component, Fragment } from 'react';
import { ReferenceInput, GET_ONE } from 'ra-loopback3';
import { translate } from 'react-admin';
import { compose } from 'recompose';
import { reset } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import withDataProvider from '../data/withDataProvider';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import FormHelperText from '@material-ui/core/FormHelperText';
import MapGadmSearch from './MapGadmSearch';

// eslint-disable-next-line
const styles = theme => ({
  input: {
    // padding: '2px 4px',
    display: 'flex',
    // alignItems: 'left',
    background: grey[50],
    width: 284,
    boxShadow: `rgba(0, 0, 0, 0.3) 0px 1px 4px -1px`,
    // flexDirection: 'column-reverse',
    borderRadius: 2,
    height: 26,
    marginTop: 25,
    paddingLeft: 12,
    paddingTop: 4,
    // paddingBottom: theme.spacing(1),
    border: 0,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    fontSize: 16,
    padding: '10px 12px',
  },
});
class GadmInput extends Component {
  state = { record: { gadmId: ' ' } };
  onChange = gadmId => {
    // console.log('onChange gadmid', document, this.props);
    this.setState({ record: { gadmId } });
    this.props.dataProvider(GET_ONE, 'gadms', { id: gadmId }).then(res => {
      if (res && res.data) {
        // console.log('res: ', res);
        let points = [];
        let data = res.data;
        if (get(data, 'geometry.type') === 'Polygon') {
          let coordinates = get(data, 'geometry.coordinates');
          if (coordinates && coordinates.length) {
            let first = coordinates[0];
            for (let i = 0; i < first.length; ++i) {
              if (first[i].length === 2) {
                let item = { lat: first[i][1], lng: first[i][0] };
                points.push(item);
              }
            }
          }
        }

        this.props.onResetSearchBoxDefault();

        // console.log('getAreaPoint: ', points);
        this.props.getAreaPoint(points, get(data, 'rect'));
      }
    });
  };
  onReset = () => {
    // console.log('reset');
    this.setState({ record: { gadmId: '' } }); // reset
  };
  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }
  render() {
    const { record } = this.state;
    const { translate, classes } = this.props;
    // console.log('render: ', this.props);
    return (
      <Fragment>
        <div
          style={{
            position: 'absolute',
            marginTop: -15,
            top: 0,
            marginLeft: 410,
          }}
        >
          <ReferenceInput
            resource="gadms"
            // label={translate('ra.map.gadmName')}
            label={''}
            filterToQuery={name => (name ? { $text: { search: `"${name}"` } } : {})} // query filter
            input={{ value: record.gadmId, meta: {}, onChange: this.onChange }}
            source="gadmId"
            reference="gadms"
            className={classes.input}
            allowEmpty
          >
            <MapGadmSearch
              label={''}
              optionText="fullName"
              className={classes.auto}
              placeholder={translate('ra.map.geoBorder')}
            />
          </ReferenceInput>
        </div>
      </Fragment>
    );
  }
}
GadmInput.propTypes = {
  dataProvider: PropTypes.func,
  getAreaPoint: PropTypes.func,
  translate: PropTypes.func,
  classes: PropTypes.object,
  onRef: PropTypes.func,
  onResetSearchBoxDefault: PropTypes.func,
};
// eslint-disable-next-line
function mapStateToProps(state, props) {
  return {};
}
export default compose(
  withStyles(styles),
  withDataProvider,
  translate,
  connect(mapStateToProps, {
    resetForm: reset,
  }),
)(GadmInput);
