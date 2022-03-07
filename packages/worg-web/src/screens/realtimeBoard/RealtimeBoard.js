import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Stepper, Step, StepLabel, Paper, StepConnector, withStyles, Avatar } from '@material-ui/core';
import WaterSourceWidget from './widgets/WaterSourceWidget';
import FactoryWidget from './widgets/FactoryWidget';
import { FactoryIcon, NmsIcon, CustomerIcon, WaterSourceIcon } from '../../styles/Icons';
import NmsWidget from './widgets/NmsWidget';
import CtmWidget from './widgets/CtmWidget';
import { compose } from 'recompose';

const steps = [
  { title: 'Water Source', icon: WaterSourceIcon },
  { title: 'Plant', icon: FactoryIcon },
  { title: 'Network', icon: NmsIcon },
  { title: 'Customer', icon: CustomerIcon },
];

const ColorlibConnector = withStyles(theme => ({
  alternativeLabel: {
    top: 24,
    marginLeft: 10,
    marginRight: 10,
  },
  line: {
    height: 12,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderTopColor: theme.palette.primary.main,
    borderBottomColor: theme.palette.secondary.main,
    // backgroundColor: theme.palette.primary.main,
    borderRadius: 1,
  },
}))(StepConnector);

class RealtimeBoard extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container spacing={2}>
        <Grid item sx={12} md={12}>
          <Paper>
            <Stepper alternativeLabel activeStep={steps.length} connector={<ColorlibConnector />}>
              {steps.map(({ title, icon: Icon }) => (
                <Step key={title}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Avatar className={classes.avatarIcon}>
                        <Icon style={{ fontSize: 32 }} />
                      </Avatar>
                    )}
                  >
                    {title}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>
        <Grid item md={6}>
          <WaterSourceWidget />
        </Grid>
        <Grid item md={6}>
          <FactoryWidget />
        </Grid>
        <Grid item md={6}>
          <NmsWidget />
        </Grid>
        <Grid item md={6}>
          <CtmWidget />
        </Grid>
      </Grid>
    );
  }
}

const styles = theme => ({
  avatarIcon: {
    width: 48,
    height: 48,
    backgroundColor: theme.palette.primary.main,
  },
});

export default compose(withStyles(styles))(RealtimeBoard);
