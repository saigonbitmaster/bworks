import React, { Component } from 'react';
import {
  TextField,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  Datagrid,
  List,
  Filter,
  CardActions,
  Button,
  translate,
  CUSTOM,
  showNotification,
  withDataProvider,
} from 'ra-loopback3';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { ExportIcon } from '../../styles/Icons';

const ImportGeoAction = ({ filterValues, importGeo, permission }) => {
  return (
    <CardActions>
      <Button
        primary="true"
        label="Nhập dữ liệu địa lý"
        onClick={() => importGeo(filterValues)}
        permission={permission}
      >
        <ExportIcon />
      </Button>
      ;
    </CardActions>
  );
};

ImportGeoAction.propTypes = {
  filterValues: PropTypes.object,
  importGeo: PropTypes.func,
  permission: PropTypes.object,
};

const ImportGeoFilter = ({ filterValues, handleProvinceChange, handleDistrictChange, ...props }) => {
  return (
    <Filter {...props} filterValues={filterValues}>
      <ReferenceInput
        key={filterValues.districtId}
        label="generic.pages.geoward"
        source="_id"
        filter={{ districtId: filterValues.districtId }}
        reference="refwards"
        perPage={100}
        alwaysOn
        disabled={!filterValues.districtId || !filterValues.provinceId}
      >
        <SelectInput optionText="fullName" />
      </ReferenceInput>
      <ReferenceInput
        key={filterValues.provinceId}
        label="generic.pages.geodistrict"
        source="districtId"
        filter={{ provinceId: filterValues.provinceId }}
        reference="refdistricts"
        perPage={100}
        alwaysOn
        disabled={!filterValues.provinceId}
        onChange={() => handleDistrictChange(filterValues)}
      >
        <SelectInput optionText="fullName" />
      </ReferenceInput>
      <ReferenceInput
        label="generic.pages.geoprovince"
        source="provinceId"
        reference="refprovinces"
        perPage={100}
        alwaysOn
        onChange={() => handleProvinceChange(filterValues)}
      >
        <SelectInput optionText="fullName" />
      </ReferenceInput>
    </Filter>
  );
};

@withDataProvider
@connect(null, { showNotification })
class ImportGeo extends Component {
  refFilter = React.createRef();

  importGeo = async filterValues => {
    const { translate } = this.props;
    let result = await this.props.dataProvider(CUSTOM, 'geoWards', {
      subUrl: 'importGeo',
      method: 'POST',
      body: { filterValues },
    });

    const { err } = result;

    if (!err) {
      this.props.showNotification(translate('notification.data.geoDataSaveSuccess'));
    } else {
      this.props.showNotification(translate('error.data.geoDataSaveFailure', 'warning'));
    }
  };

  handleDistrictChange = filterValues => {
    if (filterValues._id) {
      this.refFilter.current.props.change('_id', '');
    }
  };

  handleProvinceChange = filterValues => {
    if (filterValues.provinceId || filterValues._id) {
      this.refFilter.current.props.change('districtId', '');
      this.refFilter.current.props.change('_id', '');
    }
  };

  render() {
    const { dataProvider, showNotification, ...rest } = this.props;
    return (
      <List
        {...rest}
        resource="refwards"
        refFilter={this.refFilter}
        filters={
          <ImportGeoFilter
            handleProvinceChange={this.handleProvinceChange}
            handleDistrictChange={this.handleDistrictChange}
          />
        }
        extActions={<ImportGeoAction importGeo={this.importGeo} permission={{ name: 'ImportGeo', action: 'import' }} />}
      >
        <Datagrid>
          <TextField source="fullName" label="Phường/Xã" />
          <ReferenceField label="Quận/Huyện" source="districtId" reference="refdistricts" linkType={false}>
            <TextField source="fullName" />
          </ReferenceField>
          <ReferenceField label="Tỉnh/Thành phố" source="provinceId" reference="refprovinces" linkType={false}>
            <TextField source="fullName" />
          </ReferenceField>
        </Datagrid>
      </List>
    );
  }
}

ImportGeo.propTypes = {
  translate: PropTypes.func,
};

export default compose(translate)(ImportGeo);
