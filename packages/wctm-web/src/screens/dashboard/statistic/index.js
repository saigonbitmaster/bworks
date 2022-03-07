import React, { Component } from 'react';
import { Grid, Card, CardHeader, /* CardContent, Typography, */ Avatar } from '@material-ui/core';
import { People as PeopleIcon, PersonAdd as PersonAddIcon, Timelapse as TimelapseIcon } from '@material-ui/icons';
class Statistic extends Component {
  render() {
    return (
      <Grid middle="true" container spacing={2}>
        <Grid middle="true" item xs={12} sm={3}>
          <Card>
            <CardHeader
              avatar={
                <Avatar style={{ backgroundColor: '#3f51b5' }} aria-label="Recipe">
                  <PeopleIcon />
                </Avatar>
              }
              title="10"
              subheader="TỔNG SỐ KHÁCH HÀNG"
            />
          </Card>
        </Grid>
        <Grid middle="true" item xs={12} sm={3}>
          <Card>
            <CardHeader
              avatar={
                <Avatar style={{ backgroundColor: '#3f51b5' }} aria-label="Recipe">
                  <PersonAddIcon />
                </Avatar>
              }
              title="1"
              subheader="KHÁCH HÀNG ĐĂNG KÝ MỚI"
            />
          </Card>
        </Grid>
        <Grid middle="true" item xs={12} sm={3}>
          <Card>
            <CardHeader
              avatar={
                <Avatar style={{ backgroundColor: '#fabb3d' }} aria-label="Recipe">
                  <TimelapseIcon />
                </Avatar>
              }
              title="12"
              subheader="KHÁCH HÀNG CHỜ CÀI ĐẶT"
            />
          </Card>
        </Grid>
        {/* <Grid middle="true" item xs={12} sm={3}>
          <Card>
            <CardHeader
              avatar={
                <Avatar aria-label="Recipe">
                  <PeopleIcon />
                </Avatar>
              }
              title="1"
              subheader="TỔNG SỐ KHÁCH HÀNG"
            />
          </Card>
        </Grid> */}
      </Grid>
    );
  }
}

export default Statistic;
