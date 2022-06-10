import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, withStyles, Container } from '@material-ui/core';
// import { DashboardRounded } from '@material-ui/icons';
import ProjectCard from './ProjectCard';
import { compose } from 'recompose';
import { WaterSourceIcon, NmsIcon, CustomerIcon, OrgIcon, FactoryIcon } from '../../styles/Icons';
import { green, blue, indigo, teal, purple, cyan } from '@material-ui/core/colors';
import Footer from './Footer';
// import SlideDemo from './SlideDemo';

const projects = [
  {
    project: 'org',
    title: 'Management',
    icon: OrgIcon,
    color: green[500],
    imageUrl: '/static/images/water-org.png',
  },
  {
    project: 'src',
    title: 'Water Source',
    icon: WaterSourceIcon,
    color: blue[500],
    imageUrl: '/static/images/water-src.png',
  },
  {
    project: 'nms',
    title: 'Water network',
    icon: NmsIcon,
    color: indigo[500],
    imageUrl: '/static/images/water-supply.png',
  },
  {
    project: 'ctm',
    title: 'Water business',
    icon: CustomerIcon,
    color: teal[500],
    imageUrl: '/static/images/water-bussiness.png',
  },
];

class Board extends Component {
  static propTypes = {
    classes: PropTypes.object,
    backgroundImage: PropTypes.string,
  };

  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.root} maxWidth="lg" disableGutters>
        <Grid container spacing={64} className={classes.grid}>
          {projects.map(item => (
            <Grid key={item.project} item sx={6} sm={6} className={classes.projectList}>
              <ProjectCard {...item} />
            </Grid>
          ))}
          {/* <Grid item xs={12} md={12} lg={6} className={classes.slide}>
            <SlideDemo />
          </Grid> */}
        </Grid>
        <Footer />
      </Container>
    );
  }
}

const styles = theme => ({
  root: {
    display: 'flex',
    width: '100%',
    minHeight: 'calc(100vh - 128px)',
    alignItems: 'center',
    justifyContent: 'center',
    // minHeight: '90vh',
    // prosition: 'relative',
    // backgroundColor: theme.palette.grey[300],
  },
  slide: {
    // backgroundColor: 'grey',
    // display: 'flex',
    alignItems: 'center',
    justifyContent: 'top',
  },
  projectList: {
    // flex: 1,
    // display: 'flex',
    // flexFlow: 'row wrap',
    // margin: 32,
    // backgroundColor: 'grey',
  },
  grid: {
    // maxWidth: 900,
    marginTop: 32,
    textAlign: 'center',
  },
  gridItem: {
    backgroundColor: 'yellow',
    flexGrow: 1,
  },
});

export default compose(withStyles(styles))(Board);
