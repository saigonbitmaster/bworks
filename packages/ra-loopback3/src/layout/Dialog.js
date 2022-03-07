import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
class Dialog extends React.Component {
  state = {
    open: false,
  };

  render() {
    const { dialog, data } = this.props;
    if (dialog) {
      return <div>{React.cloneElement(dialog, { data })}</div>;
    }
    return null;
  }
}

Dialog.propTypes = {
  data: PropTypes.any,
  dialog: PropTypes.any,
};

const mapStateToProps = state => ({
  dialog: state.dialog.element,
  data: state.dialog.data,
});

export default compose(connect(mapStateToProps))(Dialog);
