import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles/';
import { CUSTOM, withDataProvider, translate } from 'ra-loopback3';

const styles = theme => ({
  chip: {
    margin: theme.spacing(0.5),
  },
});

@withDataProvider
class RoleForAppUserField extends Component {
  static propTypes = {
    record: PropTypes.object,
    dataProvider: PropTypes.func,
  };

  state = { roleNames: [] };

  handleRole = async id => {
    const { dataProvider } = this.props;
    const {
      data: { roles },
    } = await dataProvider(CUSTOM, 'AppUsers', {
      subUrl: 'getRolesByAppUserId',
      fullUrl: true,
      query: { id },
    });
    if (roles) {
      const roleNames = roles.map(({ name }) => name);
      this.setState({ roleNames });
    }
  };

  componentDidMount() {
    const { record } = this.props;
    this.handleRole(record.id);
  }

  render() {
    const { classes } = this.props;
    const { roleNames } = this.state;
    return (
      <div>
        {roleNames.map((name, index) => (
          <Chip label={name} className={classes.chip} key={index} />
        ))}
      </div>
    );
  }
}

RoleForAppUserField.propTypes = {
  classes: PropTypes.object,
};

RoleForAppUserField.defaultProps = {
  addLabel: true,
};

export default compose(translate, withStyles(styles))(RoleForAppUserField);
