import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withDataProvider, translate } from 'ra-loopback3';
import {
  withStyles,
  List,
  ListItem,
  ListItemText,
  Divider,
  Collapse,
  Checkbox,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  Avatar,
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import numeral from 'numeral';
import camelCase from 'camelcase';
import { MaterialOnMapIcon } from '../../styles/Icons';

const styles = theme => ({
  cardHead: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.common.white,
  },
  content: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  materialType: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});
class MaterialTree extends Component {
  state = { showDetail: {} };
  handleShowDetails = (e, type) => {
    e.preventDefault();
    const { showDetail } = this.state;
    showDetail[type] = !showDetail[type];
    this.setState({ showDetail });
  };
  handleShowMap = (e, type) => {
    e.preventDefault();
    this.props.handleShowMap(type);
  };
  render() {
    const { treeMaterials, showOnMap, classes, translate } = this.props;
    const { showDetail } = this.state;
    return (
      <Card>
        <CardHeader
          avatar={
            <Avatar className={classes.cardHead}>
              <MaterialOnMapIcon />
            </Avatar>
          }
          title={translate('generic.pages.materialOnMap')}
        />
        <CardContent className={classes.content}>
          {treeMaterials && treeMaterials.length > 0 && (
            <List component="nav" disablePadding>
              {treeMaterials.map(materialType => {
                return (
                  <Fragment key={materialType.type}>
                    <Divider />
                    <ListItem
                      button
                      className={classes.materialType}
                      onClick={e => this.handleShowMap(e, materialType.type)}
                    >
                      <Checkbox
                        key={showOnMap[materialType.type]}
                        checked={showOnMap[materialType.type]}
                        onChange={e => this.handleShowMap(e, materialType.type)}
                      />
                      <ListItemText
                        primary={translate(`resources.materialstocks.types.${camelCase(materialType.type)}`)}
                        secondary={
                          numeral(materialType.value).format() +
                          ' ' +
                          translate(`generic.units.${materialType.type === 'Pipe' ? 'meter' : 'quantity'}`)
                        }
                      />
                      <IconButton onClick={e => this.handleShowDetails(e, materialType.type)}>
                        {showDetail[materialType.type] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </ListItem>
                    {materialType.details && materialType.details.length && (
                      <Collapse in={showDetail[materialType.type]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {materialType.details.map(detailType => (
                            <ListItem button dense key={detailType.detailTypeId}>
                              <ListItemText
                                primary={detailType.detailTypeName}
                                secondary={
                                  numeral(detailType.value).format() +
                                  ' ' +
                                  translate(`generic.units.${materialType.type === 'Pipe' ? 'meter' : 'quantity'}`)
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </Fragment>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>
    );
  }
}

MaterialTree.propTypes = {
  theme: PropTypes.object,
  translate: PropTypes.func,
  treeMaterials: PropTypes.array,
  classes: PropTypes.object,
  showOnMap: PropTypes.object.isRequired,
  handleShowMap: PropTypes.func.isRequired,
};
const enhance = compose(withStyles(styles), withDataProvider, translate);
export default enhance(MaterialTree);
