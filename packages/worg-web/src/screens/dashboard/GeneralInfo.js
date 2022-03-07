import React, { Component } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  withTheme,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  withStyles,
  CardActions,
  Button,
} from '@material-ui/core';
import { StatusIcon, FactoryIcon, ScadaIcon } from '../../styles/Icons';
import { NumberField, translate, withDataProvider, GET_ONE, CUSTOM } from 'ra-loopback3';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
class GeneralInfo extends Component {
  static propTypes = {
    theme: PropTypes.object,
    translate: PropTypes.func,
    dataProvider: PropTypes.func,
    activeFactoryId: PropTypes.string,
    classes: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const { activeFactoryId } = props;
    this.state = { activeFactoryId, summary: {}, activeFactoryInfo: null };
  }

  async componentDidMount() {
    const { dataProvider } = this.props;
    // get factories summary
    const summary = await dataProvider(CUSTOM, 'factories', { subUrl: 'statusSummary' });
    if (summary.data) {
      this.safeSetState({ summary: summary.data });
    }
  }

  async getActiveFactoryInfo(factoryId) {
    const { dataProvider } = this.props;
    // get factories summary
    const res = await dataProvider(GET_ONE, 'factories', { id: factoryId });
    if (res.data) {
      this.safeSetState({ activeFactoryInfo: res.data, activeFactoryId: factoryId });
    }
  }

  componentDidUpdate(prevProps) {
    const { activeFactoryId: oldId } = prevProps;
    const { activeFactoryId } = this.props;
    if (oldId !== activeFactoryId) {
      if (activeFactoryId) {
        this.getActiveFactoryInfo(activeFactoryId);
      } else {
        this.safeSetState({ activeFactoryId: '', activeFactoryInfo: null });
      }
    }
  }

  safeSetState = (state, cb) => {
    if (!this.unmount) {
      this.setState(state, cb);
    }
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  render() {
    const { theme, translate, classes } = this.props;
    const { summary, activeFactoryInfo } = this.state;
    const info = activeFactoryInfo ? activeFactoryInfo : summary;

    // hard code
    info.factoryCapacity = info.factoryCapacity || 852396;
    info.currentCapacityDay = info.currentCapacityDay || 713842;
    info.powerConsumption = info.powerConsumption || 1.2;
    info.currentLossRate = info.currentLossRate || 1078216;
    info.avgTurbidity = info.avgTurbidity || 1.5;
    info.avgPH = info.avgPH || 7.3;

    return (
      <Card style={{ width: '100%' }}>
        <CardHeader
          avatar={
            <Avatar className={classes.statusIcon}>{activeFactoryInfo ? <FactoryIcon /> : <StatusIcon />}</Avatar>
          }
          title={<b>{activeFactoryInfo ? info.name : translate('generic.info')}</b>}
        />
        <CardContent className={classes.dmaItem}>
          <List component="nav" disablePadding>
            <ListItem button>
              <ListItemText
                primary={`${translate('generic.capacityTotal')} (${translate('generic.units.factoryCapacity')})`}
                style={{ paddingRight: 40 }}
              />
              <ListItemSecondaryAction>
                <NumberField record={info} style={{ color: theme.status.normal }} source="currentCapacityDay" />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText
                primary={`${translate('generic.powerConsumption')} (${translate('generic.units.powerPerm3')})`}
                style={{ paddingRight: 40 }}
              />
              <ListItemSecondaryAction>
                <NumberField record={info} style={{ color: theme.status.normal }} source="powerConsumption" />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText
                primary={`${translate('generic.waterLossLastMonth')} (${translate('generic.units.percent')})`}
                style={{ paddingRight: 40 }}
              />
              <ListItemSecondaryAction>
                <NumberField record={info} style={{ color: theme.status.normal }} source="currentLossRate" />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText
                primary={`${translate('generic.turbidityAvg')} (${translate('generic.units.turbidity')})`}
                style={{ paddingRight: 5 }}
              />
              <ListItemSecondaryAction>
                <NumberField record={info} style={{ color: theme.status.normal }} source="avgTurbidity" />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText primary={`${translate('generic.phAvg')}`} style={{ paddingRight: 40 }} />
              <ListItemSecondaryAction>
                <NumberField record={info} style={{ color: theme.status.normal }} source="avgPH" />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
        {activeFactoryInfo && (
          <CardActions>
            <Button
              component={Link}
              to={`/scada/scadadetails/plant01`}
              fullWidth
              variant="outlined"
              color="primary"
              size="large"
            >
              <ScadaIcon className={classes.scadaIcon} />
              Scada System
            </Button>
          </CardActions>
        )}
      </Card>
    );
  }
}

const styles = theme => {
  return {
    header: {
      backgroundColor: theme.palette.primary.main,
      color: `${theme.palette.primary.contrastText} !important`,
    },
    subheader: {
      color: theme.palette.grey[400],
    },
    chip: {
      height: '18px',
    },
    chipIcon: {
      backgroundColor: theme.palette.grey[300],
      color: theme.palette.primary.main,
      height: '18px',
      width: '18px',
    },
    left: {
      float: 'left',
    },
    statusIcon: {
      backgroundColor: theme.palette.primary.main,
    },
    iconMeno: {
      width: 24,
      height: 24,
    },
    dmaItem: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    scadaIcon: {
      margin: theme.spacing(2),
    },
  };
};

export default compose(translate, withDataProvider, withStyles(styles), withTheme)(GeneralInfo);
