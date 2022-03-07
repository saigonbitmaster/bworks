import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { compose } from 'recompose';
import classNames from 'classnames';
import { MaterialSelectInput } from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { change } from 'redux-form';

const styles = () => ({
  dma: {
    float: 'left',
  },
  model: {
    float: 'right',
  },
});

class SelectDesign extends Component {
  static propTypes = {
    model: PropTypes.string,
    classes: PropTypes.any,
    translate: PropTypes.func.isRequired,
    push: PropTypes.func,
    onChange: PropTypes.func,
  };

  componentWillMount() {
    let { change, formName, model } = this.props;
    if (change && formName && model) {
      change(formName, 'model', model);
    }
  }

  onChange = (e, model) => {
    if (model && model !== this.props.model) {
      if (this.props.onChange) {
        // console.log('>> on change 2', model, this.props);
        this.props.onChange({ viewSelected: [model] });
      }
      this.props.push(`/design/${model}`);
    }
  };

  render() {
    const { classes, translate, model } = this.props;
    // console.log('select design: ', this.props);
    return (
      <Grid container>
        <MaterialSelectInput
          multi={false}
          source="model"
          factory
          defaultValue={model}
          label={translate('generic.pages.design')}
          dma={true}
          node={true}
          onChange={this.onChange}
          className={classNames(classes.model)}
        />
      </Grid>
    );
  }
}
SelectDesign.propTypes = {
  change: PropTypes.func,
  formName: PropTypes.string,
};
// eslint-disable-next-line
function mapStateToProps(state) {
  return {
    formName: 'view-form',
  };
}
const enhance = compose(
  withStyles(styles),
  connect(mapStateToProps, {
    push,
    change,
  }),
);

export default enhance(SelectDesign);
