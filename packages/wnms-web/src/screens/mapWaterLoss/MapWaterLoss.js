import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import {
  CustomPage,
  FlexFormFilter,
  MonthInput,
  withDataProvider,
  CUSTOM,
  translate,
  CustomPageController,
} from 'ra-loopback3';
import { Grid, Card, CardContent, withStyles, CircularProgress } from '@material-ui/core';
import MapDmaWaterLoss from './MapDmaWaterLoss';
import MapWaterLossDetail from './MapWaterLossDetail';

const styles = () => ({
  condition: {
    margin: 0,
    padding: '0 !important',
  },
});
class MapWaterLoss extends Component {
  refDetail = React.createRef();
  state = {
    filter: {
      month: moment()
        .subtract(1, 'month')
        .startOf('month')
        .toDate(),
    },
    data: null,
    loading: false,
    screen: 'mapwaterloss',
  };

  componentDidMount() {
    const { filter } = this.state;
    this.getData(filter);
  }

  getData = filter => {
    const { month } = filter;
    this.setState({ loading: true });
    this.props
      .dataProvider(CUSTOM, 'dmas', {
        subUrl: 'mapWaterLoss',
        query: {
          month: moment(month)
            .startOf('month')
            .toDate(),
        },
      })
      .then(res => {
        // console.log('res: ', res);
        this.setState({ loading: false, data: res.data });
        this.refDetail.current.updateFilter({
          month: moment(month)
            .startOf('month')
            .toDate(),
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  onFilterChange = filter => this.getData(filter);

  render() {
    // eslint-disable-next-line no-unused-vars
    const { title, classes, translate, dataProvider, dispatch, ...rest } = this.props;
    const { data, loading, screen, filter } = this.state;
    return (
      <CustomPage rawTitle={title} header card screen={screen}>
        <Grid container>
          <Grid item xs={12}>
            <Card className={classes.condition}>
              <CardContent className={classes.condition}>
                <CustomPageController screen={screen} filter={filter} hasFilter>
                  <FlexFormFilter formName="MapDmaWaterLossForm" onChange={this.onFilterChange}>
                    <div middle style={{ display: 'flex' }}>
                      <MonthInput
                        source="month"
                        label={translate('generic.typeTime.month')}
                        date
                        style={{ width: '100 !important' }}
                      />
                      <div decorate="true">{loading && <CircularProgress size={20} style={{ margin: 24 }} />}</div>
                    </div>
                  </FlexFormFilter>
                </CustomPageController>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <MapDmaWaterLoss data={data} />
          </Grid>
          <Grid item xs={12}>
            <MapWaterLossDetail refHandle={this.refDetail} defaultFilter={{ month: filter.month }} {...rest} />
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}

MapWaterLoss.propTypes = {
  title: PropTypes.string,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
  translate: PropTypes.func,
  dispatch: PropTypes.any,
};
const enhance = compose(translate, withStyles(styles), withDataProvider);
export default enhance(MapWaterLoss);
