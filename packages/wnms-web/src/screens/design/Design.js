import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CustomPage, translate, withDataProvider } from 'ra-loopback3';
import { Grid, Paper } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import withMapDefaultConfig from '../../containers/map/MapDefaultConfig';
import { mapChangeSelected } from './actions';
import SelectView from './SelectView';
import MapDesignView from './MapDesignView';
import DesignList from './DesignList';

const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  };
};

const mapItemsRest = props => {
  const {
    list,
    staticcontext,
    defaultCenter,
    viewDmaId,
    updateView,
    viewSelected,
    defaultZoom,
    options,
    icon,
    ...rest
  } = props;
  return rest;
};

class Design extends Component {
  static propTypes = {
    basePath: PropTypes.string,
    options: PropTypes.object,
    match: PropTypes.object,
    classes: PropTypes.any,
    theme: PropTypes.object,
    viewSelected: PropTypes.any,
    defaultCenter: PropTypes.object,
    defaultZoom: PropTypes.number,
    dispatch: PropTypes.any,
    translate: PropTypes.func,
    mapChangeSelected: PropTypes.func,
    list: PropTypes.any,
    viewDmaId: PropTypes.string,
    updateView: PropTypes.number,
    dataProvider: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      basePath: props.basePath,
    };
  }

  // componentDidMount() {
  //   const { viewSelected = [], mapChangeSelected } = this.props;
  //   const { model } = this.props.match.params;
  //   if (viewSelected.indexOf(model) < 0) {
  //     mapChangeSelected({ viewSelected: [...viewSelected, model] });
  //   }
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const { model } = nextProps.match.params;
  //   if (model !== this.props.match.params.model) return true;
  //   return !isEqual(nextState, this.state);
  // }
  onUpdateList = () => {
    this.props.mapChangeSelected({ update: 1 });
  };

  mapChangeSelected = data => {
    this.props.mapChangeSelected(data);
  };

  render() {
    const {
      classes,
      theme,
      viewSelected,
      dispatch,
      translate,
      mapChangeSelected,
      dataProvider,
      defaultCenter,
      defaultZoom,
      options,
      basePath,
      viewDmaId,
      updateView,
      ...rest
    } = this.props;
    const { model = 'Dma' } = this.props.match.params;
    let mapOptions = {
      defaultCenter,
      defaultZoom,
    };
    let fixBasePath = basePath.replace(':model', model);
    // console.log('design render: ', model, fixBasePath, this.props);
    return (
      <CustomPage title={'generic.pages.design'}>
        <Grid container spacing={2 * 2}>
          <Grid item xs={12} sm={12}>
            <Paper>
              <SelectView
                onChange={this.mapChangeSelected}
                translate={translate}
                viewSelected={viewSelected}
                viewDmaId={viewDmaId}
                model={model}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Paper>
              <DesignList
                {...mapItemsRest(rest)}
                basePath={fixBasePath}
                model={model}
                updateView={updateView}
                onUpdateList={this.onUpdateList}
                options={({ ...options }, { ...mapOptions })}
                hasCreate
                hasEdit
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <MapDesignView
              onChange={mapChangeSelected}
              mapOptions={mapOptions}
              updateView={updateView}
              dataProvider={dataProvider}
              viewSelected={viewSelected}
              viewDmaId={viewDmaId}
            />
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}

const mapStateToProps = state => ({
  viewSelected: state.design.viewSelected,
  viewDmaId: state.design.viewDmaId,
  updateView: state.design.update,
  defaultZoom: state.design.defaultZoom,
  defaultCenter: state.design.defaultCenter,
});

const enhance = compose(
  withMapDefaultConfig,
  connect(mapStateToProps, {
    mapChangeSelected,
  }),
  withTheme,
  withStyles(styles),
  translate,
  withDataProvider,
);

export default enhance(Design);
