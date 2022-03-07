import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Paper, Grid, Button, withStyles, CardContent, Card } from '@material-ui/core';
import { Laptop as PlantIcon, BubbleChart as WaterSourceIcon } from '@material-ui/icons';

import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { withDataProvider, CUSTOM, CustomPage } from 'ra-loopback3';

const styles = theme => ({
  root: {
    // padding: theme.spacing(8),
  },
  item: {
    padding: theme.spacing(4),
    textAlign: 'center',
  },
  button: {
    // custom css
    // margin: theme.spacing(4),
  },
  icon: {
    marginRight: theme.spacing(4),
    fontSize: 120,
  },
});

class ScadaList extends Component {
  static propTypes = {
    project: PropTypes.string,
    classes: PropTypes.object,
    dataProvider: PropTypes.func,
  };

  state = { loading: true, scadas: [] };

  async componentDidMount() {
    const { dataProvider } = this.props;
    const res = await dataProvider(CUSTOM, 'iotdevices', {
      rawFilter: {
        where: {
          type: 'SCADA',
        },
        fields: { name: true, id: true },
      },
    });
    this.setState({ loading: false, scadas: res.data });
    // console.log(res.data);
  }

  render() {
    const { classes, dataProvider, ...rest } = this.props;
    const { scadas, loading } = this.state;
    // if (loading) return <LinearProgress />;
    return (
      <CustomPage {...rest}>
        <Grid container spacing={2}>
          {scadas.map(({ id, name }) => (
            <Grid key={id} item sm={6}>
              <Paper className={classes.item}>
                <Button
                  component={Link}
                  className={classes.button}
                  fullWidth
                  size="medium"
                  variant="outlined"
                  color="primary"
                  to={`/scada/scadadetails/${id}`}
                >
                  <PlantIcon className={classes.icon} />
                  {name}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CustomPage>
    );
  }
}

const ScadaListEnhance = compose(withStyles(styles), withDataProvider)(ScadaList);

export default ScadaListEnhance;
