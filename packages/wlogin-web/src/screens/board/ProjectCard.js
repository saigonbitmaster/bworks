import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, Card, CardHeader, Avatar, CardMedia } from '@material-ui/core';
import { compose } from 'recompose';

class ProjectCard extends Component {
  static propTypes = {
    project: PropTypes.string,
    classes: PropTypes.object,
    icon: PropTypes.elementType,
    title: PropTypes.string,
    color: PropTypes.string,
    imageUrl: PropTypes.string,
  };

  render() {
    const { title, classes, icon: Icon, imageUrl, color, project } = this.props;
    return (
      <Card variant="outlined" style={{ width: 'calc(100% - 64px)', margin: 32 }}>
        <CardHeader
          className={classes.header}
          avatar={
            <Avatar className={classes.avatar} style={{ backgroundColor: color }}>
              <Icon />
            </Avatar>
          }
          title={title}
          action={
            <Button component="a" href={`/${project}`} className={classes.goButton} variant="outlined" color="primary">
              Go
            </Button>
          }
        />
        <CardMedia className={classes.media} image={imageUrl} title={title} />
      </Card>
    );
  }
}

const styles = () => ({
  goButton: {
    marginTop: 12,
    marginRight: 12,
  },
  header: {
    // padding: 8,
  },
  media: {
    height: 0,
    borderRadius: 4,
    paddingTop: 'calc(32%)', // 16:9
    marginRight: 'calc(14%)',
    marginLeft: 'calc(14%)',
    marginBottom: 4,
  },
  avatar: {
    // backgroundColor: theme.palette.primary.main,
  },
  root: {
    textAlign: 'center',
    // backgroundColor: 'grey',
  },
});

export default compose(withStyles(styles))(ProjectCard);
