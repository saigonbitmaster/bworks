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
    width: 130,
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
class DmaInput extends Component {
  state = { record: { dmaId: ' ' } };
  onChange = dmaId => {
    this.setState({ record: { dmaId } });
    this.props.dataProvider(GET_ONE, 'dmas', { id: dmaId }).then(res => {
      if (res && res.data) {
        let points = [];
        let data = res.data;
        let boundary = get(data, 'boundary');
        if (boundary.length) {
          points = boundary;
        }
        this.props.onResetSearchBoxDefault();
        this.props.getAreaPoint(points, get(data, 'rect'));
      }
    });
  };
  onReset = () => {
    // console.log('reset');
    this.setState({ record: { dmaId: '' } }); // reset
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
            resource="dmas"
            label={''}
            filterToQuery={name => {
              return name ? { $text: { search: `"${name}"` } } : {};
            }} // query filter
            input={{ value: record.dmaId, meta: {}, onChange: this.onChange }}
            source="dmaId"
            reference="dmas"
            className={classes.input}
            allowEmpty
          >
            <MapGadmSearch
              label={''}
              optionText="name"
              className={classes.auto}
              placeholder={translate('ra.map.selectDma')}
            />
          </ReferenceInput>
        </div>
      </Fragment>
    );
  }
}
DmaInput.propTypes = {
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
)(DmaInput);
