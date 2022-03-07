import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, Avatar, withStyles, Button } from '@material-ui/core';
import { compose } from 'recompose';
import { BubbleChartRounded as BubbleChartIcon, LabelImportantRounded as DetailsIcon } from '@material-ui/icons';

class RealtimeWidget extends Component {
  static propTypes = {
    project: PropTypes.string,
    icon: PropTypes.elementType,
    children: PropTypes.node,
    classes: PropTypes.object,
    headers: PropTypes.object,
  };

  onClickHandle = () => {};

  render() {
    const { classes, children, icon: Icon, headers = {}, project } = this.props;
    return (
      <Card>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              <Icon />
            </Avatar>
          }
          action={
            <Button
              component="a"
              href={`/${project}`}
              className={classes.button}
              aria-label="settings"
              variant="outlined"
              color="primary"
            >
              <DetailsIcon />
              &nbsp;&nbsp;Project
            </Button>
          }
          {...headers}
        />
        <CardContent>{children}</CardContent>
      </Card>
    );
  }
}

RealtimeWidget.defaultProps = {
  icon: BubbleChartIcon,
};

const styles = theme => ({
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  button: {
    margin: theme.spacing(1),
  },
});

export default compose(withStyles(styles))(RealtimeWidget);
