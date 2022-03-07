// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import {
//   translate,
//   FlexFormFilter,
//   List,
//   Datagrid,
//   TextField,
//   DateField,
//   Button,
//   SelectInput,
//   CUSTOM,
//   withDataProvider,
//   CustomPage,
// } from 'ra-loopback3';
// import { Grid } from '@material-ui/core';
// import { compose } from 'recompose';
// import moment from 'moment-timezone';
// import _ from 'lodash';
// import PropTypes from 'prop-types';
// import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import SelectMonthYearFromTo from '../../util/SelectMonthYearFromTo';
// import { StatisticButtonIcon } from '../../styles/Icons';
// import format from '../../util/format';
// import { COLORS as COLORS_TEMPLATE } from '../../util/chart';

// let choices = [
//   { id: 1, name: 'generic.pipe.level.1' },
//   { id: 2, name: 'generic.pipe.level.2' },
//   // { id: 3, name: 'generic.pipe.level.3' },
// ];

// class WaterLossByLevelPipe extends Component {
//   refController = React.createRef();
//   formRefFilter = React.createRef();
//   state = {
//     filter: {
//       typeTime: 'month',
//       valueTimeFrom: moment(new Date())
//         .subtract(6, 'month')
//         .format('YYYY-MM'),
//       valueTimeTo: moment(new Date()).format('YYYY-MM'),
//       levelPipe: 1,
//     },
//     dataCollect: [],
//   };
//   UNSAFE_componentWillMount() {
//     this.getData(this.state.filter);
//   }
//   onClickStatistic = () => {
//     let filter = Object.assign({}, this.state.filter);
//     if (
//       !filter.typeTime ||
//       !filter.valueTimeFrom ||
//       !filter.valueTimeTo ||
//       !this.formRefFilter.current.props.values.levelPipe
//     ) {
//       return;
//     }
//     filter.levelPipe = this.formRefFilter.current.props.values.levelPipe;
//     this.setState({ filter });
//     let refController = this.refController;
//     refController.current.updateFilter();
//     this.getData(filter);
//   };

//   getData = filter => {
//     let tmp = {};
//     tmp.where = filter;
//     this.props
//       .dataProvider(CUSTOM, 'logwaterlossdmamonths/reportWaterLossByLevelPipe', {
//         query: { filter: JSON.stringify(tmp) },
//       })
//       .then(res => {
//         let dataCollect = [];
//         let key = this.state.filter.typeTime === 'month' ? 'MM/YYYY' : 'YYYY';
//         // format time
//         for (let i = 0; i < res.data.length; i++) {
//           let tmp = Object.assign({}, res.data[i]);
//           tmp.time = moment(tmp.time).format(key);
//           dataCollect.push(tmp);
//         }

//         // su dung cho circle char
//         let totalWaterRevenue = format.formatWithDec(_.sumBy(res.data, 'totalWaterRevenue'), 2);
//         let totalKnownLeak = format.formatWithDec(_.sumBy(res.data, 'totalKnownLeak'), 2);
//         let totalUnKnownLeak = format.formatWithDec(_.sumBy(res.data, 'totalUnKnownLeak'), 2);
//         let dataSum = [
//           {
//             name: this.props
//               .translate('resources.customwaterlossbylevelpipes.fields.totalWaterRevenue')
//               .replace(' (m³)', ''),
//             value: totalWaterRevenue,
//           },
//           {
//             name: this.props
//               .translate('resources.customwaterlossbylevelpipes.fields.totalKnownLeak')
//               .replace(' (m³)', ''),
//             value: totalKnownLeak,
//           },
//           {
//             name: this.props
//               .translate('resources.customwaterlossbylevelpipes.fields.totalUnKnownLeak')
//               .replace(' (m³)', ''),
//             value: totalUnKnownLeak,
//           },
//         ];

//         this.setState({ dataCollect, dataSum });
//       });
//   };
//   onChangeTime = dataTime => {
//     let tmp = Object.assign({}, dataTime);
//     tmp.levelPipe = this.state.filter.levelPipe;
//     this.setState({ filter: tmp });
//   };
//   render() {
//     const { translate } = this.props;
//     let optionFormat =
//       this.state.filter.typeTime === 'month' ? { year: 'numeric', month: 'numeric' } : { year: 'numeric' };

//     return (
//       <CustomPage title={'resources.customwaterlossbylevelpipes.titleCommonByLevelPipe'} header card>
//         <Grid item xs={12} sm={12}>
//           <FlexFormFilter formRef={this.formRefFilter} formName="filter-form-2">
//             <Grid middle container>
//               <SelectInput
//                 source="levelPipe"
//                 label={translate('resources.customwaterlossbylevelpipes.titleLevel')}
//                 choices={choices}
//                 style={{ marginLeft: '5px' }}
//                 defaultValue={1}
//               />
//               <SelectMonthYearFromTo
//                 onChangeTime={this.onChangeTime}
//                 sourceTypeTime={'_typeTime'}
//                 sourceMonthFrom={'_monthFrom'}
//                 sourceMonthTo={'_monthTo'}
//                 sourceYearFrom={'_yearFrom'}
//                 sourceYearTo={'_yearTo'}
//               />
//               <Button
//                 label={translate('generic.statistic.labelButtonStatistic')}
//                 style={{ marginTop: '30px', marginLeft: '0px', width: '120px', align: 'right' }}
//                 onClick={this.onClickStatistic}
//               >
//                 <StatisticButtonIcon />
//               </Button>
//             </Grid>
//           </FlexFormFilter>
//         </Grid>
//         <Grid item xs={12} sm={12}>
//           <ResponsiveContainer width="100%" aspect={2}>
//             <ComposedChart data={this.state.dataCollect} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
//               <CartesianGrid stroke="#f5f5f5" />
//               <XAxis
//                 dataKey="time"
//                 label={{
//                   value: translate('resources.customwaterlossbylevelpipes.fields.time'),
//                   position: 'insideBottomRight',
//                   fontSize: '0.8em',
//                   offset: 0,
//                 }}
//                 tick={{ fontSize: '0.8em' }}
//               />
//               <YAxis
//                 padding={{ top: 10 }}
//                 label={{ value: translate('generic.units.meter3'), position: 'top', fontSize: '0.8em' }}
//                 tick={{ fontSize: '0.8em' }}
//               />
//               <CartesianGrid strokeDasharray="3 3" />
//               <Tooltip labelStyle={{ fontSize: '0.8em' }} itemStyle={{ fontSize: '0.8em' }} />
//               <Legend wrapperStyle={{ fontSize: '0.8em' }} />
//               <Bar
//                 dataKey="totalWaterInput"
//                 stackId="a"
//                 fill={COLORS_TEMPLATE.WATERINPUT}
//                 name={this.props
//                   .translate('resources.customwaterlossbylevelpipes.fields.totalWaterInput')
//                   .replace(' (m³)', '')}
//               />
//               <Bar
//                 dataKey="totalWaterRevenue"
//                 stackId="b"
//                 fill={COLORS_TEMPLATE.WATERREVENUE}
//                 name={this.props
//                   .translate('resources.customwaterlossbydmas.fields.totalWaterRevenue')
//                   .replace(' (m³)', '')}
//               />
//               <Bar
//                 dataKey="totalKnownLeak"
//                 stackId="c"
//                 fill={COLORS_TEMPLATE.KNOWLEAK}
//                 name={translate('resources.customwaterlossbylevelpipes.fields.totalKnownLeak').replace(' (m³)', '')}
//               />
//               <Bar
//                 dataKey="totalUnKnownLeak"
//                 stackId="d"
//                 fill={COLORS_TEMPLATE.UNKNOWLEAK}
//                 name={translate('resources.customwaterlossbylevelpipes.fields.totalUnKnownLeak').replace(' (m³)', '')}
//               />
//             </ComposedChart>
//           </ResponsiveContainer>
//         </Grid>
//         <Grid item xs={12} sm={12}>
//           <List
//             refController={this.refController}
//             {...this.props}
//             resource="customwaterlossbylevelpipes"
//             fixUrl="logwaterlossdmamonths/reportWaterLossByLevelPipe"
//             title={translate('resources.customwaterlossbylevelpipes.titleList')}
//             filter={this.state.filter || {}}
//             bulkActions={false}
//           >
//             <Datagrid>
//               <DateField source="time" options={optionFormat} />
//               <TextField source="totalWaterInput" />
//               <TextField source="totalWaterRevenue" />
//               <TextField source="totalKnownLeak" />
//               <TextField source="totalUnKnownLeak" />
//             </Datagrid>
//           </List>
//         </Grid>
//       </CustomPage>
//     );
//   }
// }

// WaterLossByLevelPipe.propTypes = {
//   translate: PropTypes.func,
//   classes: PropTypes.object,
//   dataProvider: PropTypes.func,
// };
// WaterLossByLevelPipe.detaultProps = {
//   hasList: true,
//   hasShow: true,
//   hasCreate: false,
//   hasEdit: false,
// };

// const enhance = compose(
//   withDataProvider,
//   connect(
//     null,
//     {},
//   ),
//   translate,
// );

// export default enhance(WaterLossByLevelPipe);
