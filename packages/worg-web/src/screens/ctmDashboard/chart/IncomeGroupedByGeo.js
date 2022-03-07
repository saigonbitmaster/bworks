import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { SimpleForm, SelectInput, CUSTOM, ReferenceInput, MonthInput } from 'ra-loopback3';
import isUndefined from 'lodash/isUndefined';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';

import compose from 'recompose/compose';
import { formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import format from '../../../util/format';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(1),
    height: '100%',
  },
  header: {
    paddingTop: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
  },
  geoButtons: {
    marginBottom: theme.spacing(1),
    display: 'flex',
  },
  geoDelimiter: {
    margin: theme.spacing(0.5),
  },
  geoInputContainer: {
    display: 'inline-block',
    marginRight: '1.5rem',
    maxWidth: '28%',
  },
  geoInput: {
    maxWidth: '10%',
    minWidth: '100%',
  },
  treemapContainer: {
    margin: 'auto',
  },
});

const COLORS = ['#8889DD', '#9597E4', '#8DC77B', '#A5D297', '#E2CF45', '#F8C12D'];

class CustomizedContent extends PureComponent {
  render() {
    const { root, depth, x, y, width, height, index, colors, rank, name } = this.props;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: depth < 2 ? colors[Math.floor((index / root.children.length) * 6)] : 'rgba(255,255,255,0)',
            stroke: '#fff',
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />
        {depth === 1 ? (
          <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14}>
            {name}
          </text>
        ) : null}
        {depth === 1 ? (
          <text x={x + 4} y={y + 18} fill="#fff" fontSize={16} fillOpacity={0.9}>
            {index + 1}
          </text>
        ) : null}
      </g>
    );
  }
}

class IncomeGroupedByGeo extends Component {
  static propTypes = {
    dataProvider: PropTypes.func,
    change: PropTypes.func,
    translate: PropTypes.func,
    formValues: PropTypes.object,
    classes: PropTypes.object,
  };

  state = {
    data: [],
  };

  componentDidMount = () => {
    const initialProvinceId = '';
    const initialDistrictId = '';
    const initialWardId = '';
    this.getData(initialProvinceId, initialDistrictId, initialWardId);

    const { change } = this.props;
    change(
      'income-grouped-by-geo-form',
      'month',
      moment()
        .startOf('month')
        .toDate(),
    );
  };

  handleChangeMonth = (_, value) => this.getData(null, null, null, value);

  getData = (inputProvinceId, inputDistrictId, inputWardId, inputMonth) => {
    const {
      dataProvider,
      formValues: {
        provinceId: storedProvinceId,
        districtId: storedDistrictId,
        wardId: storedWardId,
        month: storedMonth,
      },
    } = this.props;

    const provinceId = inputProvinceId || storedProvinceId;
    const districtId = inputDistrictId || storedDistrictId;
    const wardId = inputWardId || storedWardId;
    const month = inputMonth || storedMonth;

    dataProvider(CUSTOM, 'ClientMeterNumbers', {
      subUrl: 'getIncomeGroupedByGeo',
      method: 'get',
      fullUrl: true,
      query: { provinceId, districtId, wardId, month },
    }).then(({ data }) => {
      this.setState({ data });
    });
  };

  handleGeoChange = (changedProvinceId, changedDistrictId, changedWardId) => {
    const {
      change,
      formValues: { provinceId, districtId, wardId },
    } = this.props;
    let newProvinceId = changedProvinceId !== null ? changedProvinceId : provinceId;
    let newDistrictId = changedDistrictId !== null ? changedDistrictId : districtId;
    let newWardId = changedWardId !== null ? changedWardId : wardId;

    if (changedProvinceId !== null) {
      if (changedProvinceId !== provinceId && (!isUndefined(districtId) || !isUndefined(wardId))) {
        change('income-grouped-by-geo-form', 'districtId', '');
        change('income-grouped-by-geo-form', 'wardId', '');
        newDistrictId = '';
        newWardId = '';
      }
    } else if (changedDistrictId !== null) {
      if (changedDistrictId !== districtId && !isUndefined(wardId)) {
        change('income-grouped-by-geo-form', 'wardId', '');
        newWardId = '';
      }
    }

    this.getData(newProvinceId, newDistrictId, newWardId);
  };

  render() {
    const { classes, translate, formValues } = this.props;
    const { data } = this.state;

    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom className={classes.header}>
          {translate('resources.clients.statistic.incomeGroupedByGeo')}
        </Typography>
        <div className={classes.geoButtons}>
          <SimpleForm form={'income-grouped-by-geo-form'} toolbar={null}>
            <MonthInput
              label="resources.clients.fields.termMeterNumber"
              allowEmpty={false}
              source="month"
              date
              alwaysOn
              onChange={this.handleChangeMonth}
            />
            <ReferenceInput
              className={classes.geoInput}
              formClassName={classes.geoInputContainer}
              label="generic.pages.geoprovince"
              source="provinceId"
              allowEmpty
              reference="geoprovinces"
              onChange={(_, value) => {
                this.handleGeoChange(value);
              }}
            >
              <SelectInput optionText="fullName" />
            </ReferenceInput>
            <ReferenceInput
              className={classes.geoInput}
              formClassName={classes.geoInputContainer}
              key={formValues.provinceId}
              label="generic.pages.geodistrict"
              source="districtId"
              filter={{ provinceId: formValues.provinceId }}
              reference="geodistricts"
              allowEmpty
              disabled={!formValues.provinceId}
              onChange={(_, value) => this.handleGeoChange(null, value)}
            >
              <SelectInput optionText="fullName" />
            </ReferenceInput>
            <ReferenceInput
              className={classes.geoInput}
              formClassName={classes.geoInputContainer}
              key={formValues.districtId}
              label="generic.pages.geoward"
              source="wardId"
              filter={{ districtId: formValues.districtId }}
              reference="geowards"
              allowEmpty
              disabled={!formValues.provinceId || !formValues.districtId}
              onChange={(_, value) => this.handleGeoChange(null, null, value)}
            >
              <SelectInput optionText="fullName" />
            </ReferenceInput>
          </SimpleForm>
        </div>
        {data.length > 0 ? (
          <ResponsiveContainer width="95%" height="60%" className={classes.treemapContainer}>
            <Treemap
              data={data}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill="#8884d8"
              content={<CustomizedContent colors={COLORS} />}
              isAnimationActive={false}
            >
              <Tooltip formatter={(value, _, { payload: { name } }) => [`${format.number(value)} đồng`, name]} />
            </Treemap>
          </ResponsiveContainer>
        ) : (
          <div style={{ padding: '16px' }}>{'Không có dữ liệu'}</div>
        )}
      </Paper>
    );
  }
}

export default compose(
  withStyles(styles),
  connect(
    state => ({
      formValues: formValueSelector('income-grouped-by-geo-form')(state, 'provinceId', 'districtId', 'wardId', 'month'),
    }),
    { change },
  ),
)(IncomeGroupedByGeo);
