import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper, Typography, ListItem, ListItemAvatar, Avatar, ListItemText, List } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Pie, PieChart, ResponsiveContainer, Sector, Cell } from 'recharts';
import { CUSTOM } from 'ra-loopback3';

import set from 'lodash/set';
import has from 'lodash/has';
import merge from 'lodash/merge';
import isNumber from 'lodash/isNumber';
import compose from 'recompose/compose';

import Format from '../../../util/format';
import config from '../../../Config';

const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
      height: '100%',
    },
    header: {
      paddingTop: theme.spacing(0.5),
      paddingLeft: theme.spacing(2),
    },
    clientTypeList: {
      display: 'flex',
      flexDirection: 'row',
    },
    pieButton: {
      borderRadius: theme.spacing(0.5),
      marginLeft: theme.spacing(1) - 3,
      background: 'linear-gradient(to left, white 50%, #e0e0e0 50%)',
      backgroundSize: '200% 100%',
      transition: 'all 1.5s ease',
      backgroundPosition: 'right bottom',
      // '&:hover': {
      //   backgroundPosition: 'left bottom',
      // },
    },
    hoveredPieButton: {
      borderRadius: theme.spacing(0.5),
      marginLeft: theme.spacing(1) - 3,
      background: 'linear-gradient(to left, white 50%, #e0e0e0 50%)',
      backgroundSize: '200% 100%',
      transition: 'all 1.5s ease',
      backgroundPosition: 'left bottom',
    },
  };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// const RADIAN = Math.PI / 180.0;
// //  eslint-disable-next-line react/prop-types
// const pieRenderCustomizedLabel = arg => {
//   const { cx, cy, midAngle, innerRadius, outerRadius, percent } = arg;
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);
//   return (
//     <text x={x} y={y} fill="white" fontSize="0.8em" dominantBaseline="central">
//       {Format.percent(percent)}
//     </text>
//   );
// };

const pieRenderActiveShape = props => {
  const RADIAN = Math.PI / 180;
  // eslint-disable-next-line react/prop-types
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, /*payload */ percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + outerRadius * cos;
  const sy = cy + outerRadius * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      {/* <text x={cx} y={cy} dy={8} textAnchor="middle" fontSize="0.8em" fill={fill}>
        {payload.name}
      </text> */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {/* <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      / */}
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        fontSize="0.8em"
      >{`${value} đơn vị`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={14} textAnchor={textAnchor} fill="#999" fontSize="0.8em">
        {Format.percentP(percent)}
      </text>
    </g>
  );
};

class ClientGroupedByType extends Component {
  static propTypes = {
    theme: PropTypes.object,
    classes: PropTypes.object,
    dataProvider: PropTypes.func,
    translate: PropTypes.func,
  };

  state = {
    data: [],
    clientTypeColors: [],
    pieActiveIndex: 0,
    hovered: config.client.clientTypeChoices.map(() => false),
  };

  componentDidMount = () => {
    const { dataProvider } = this.props;

    // Assign color to configured client type
    const clientTypes = config.client.clientTypeChoices;
    const clientTypeColors = clientTypes.map((datum, index) => set(datum, 'color', COLORS[index % COLORS.length]));
    const clientTypeColorDict = clientTypeColors.reduce(
      (acc, { id, color, name }) => ({ ...acc, [id]: { color, name } }),
      {},
    );

    // Fetch data from server
    dataProvider(CUSTOM, 'Clients', { subUrl: 'getClientGroupedByType', method: 'get', fullUrl: true }).then(
      ({ data }) => {
        if (data) {
          const dataDict = data.reduce(
            (acc, { name, value }, index) => ({
              ...acc,
              [name]: { name, value, shapeIndex: index },
            }),
            {},
          );
          const clientTypeData = Object.values(merge(dataDict, clientTypeColorDict));
          const dataWithColor = clientTypeData.filter(datum => has(datum, 'shapeIndex'));

          this.setState({ data: dataWithColor, clientTypeColors: clientTypeData });
        }
      },
    );
  };

  moveMouseToPie = (index, keyword) => {
    const { hovered } = this.state;
    const clonedHovered = [...new Array(hovered.length)].map(() => false);
    if (keyword === 'enter') {
      set(clonedHovered, index, true);
    }
    if (isNumber(index)) {
      this.setState({ pieActiveIndex: index, hovered: clonedHovered });
    }
  };

  createClientTypeList = () => {
    const { translate, classes } = this.props;
    const { clientTypeColors, hovered } = this.state;

    const clientTypeList = clientTypeColors.map(({ id, name, color, shapeIndex }) => (
      <ListItem
        key={id}
        onMouseEnter={() => this.moveMouseToPie(shapeIndex, 'enter')}
        onMouseLeave={() => this.moveMouseToPie(shapeIndex, 'leave')}
      >
        <ListItemAvatar>
          <Avatar style={{ backgroundColor: color, width: '10px', height: '10px' }} />
        </ListItemAvatar>
        <ListItemText
          primary={translate(name)}
          className={hovered[shapeIndex] ? classes.hoveredPieButton : classes.pieButton}
        />
      </ListItem>
    ));
    return clientTypeList;
  };

  render() {
    const { classes, translate } = this.props;
    const { data, pieActiveIndex } = this.state;
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom className={classes.header}>
          {translate('resources.clients.statistic.clientGroupedByType')}
        </Typography>
        <Grid container>
          <Grid item xs={12} sm={12}>
            <ResponsiveContainer width="100%" aspect={2.0}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  activeIndex={pieActiveIndex}
                  onMouseEnter={(_, index) => this.moveMouseToPie(index, 'enter')}
                  onMouseLeave={(_, index) => this.moveMouseToPie(index, 'leave')}
                  // label={pieRenderCustomizedLabel}
                  activeShape={pieRenderActiveShape}
                  fill="#8884d8"
                  outerRadius={'60%'}
                  innerRadius={'0%'}
                >
                  {data.map(({ color }, index) => (
                    // <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} sm={12}>
            <List className={classes.clientTypeList}>
              <Fragment>{this.createClientTypeList()}</Fragment>
            </List>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default compose(withStyles(styles))(ClientGroupedByType);
