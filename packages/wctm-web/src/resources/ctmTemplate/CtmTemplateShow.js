import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import { Show, FlexShowLayout, translate, TextField, FunctionField } from 'ra-loopback3';

class CtmTemplateShow extends Component {
  renderFiles = record => {
    const style = { textDecoration: 'none' };
    return (
      <Grid middle="true" item sm={12} xs={12}>
        <a style={style} href={record.data.url} download>
          {record.data.name}
        </a>
      </Grid>
    );
  };
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Show {...rest}>
        <FlexShowLayout>
          <TextField source="id" />
          <FunctionField source="data" render={record => this.renderFiles(record)} />
        </FlexShowLayout>
      </Show>
    );
  }
}

CtmTemplateShow.propTypes = {
  translate: PropTypes.func,
};

const enhance = compose(translate);
export default enhance(CtmTemplateShow);
