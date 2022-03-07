// import React from 'react';
import { GeoChildIcon } from '../../styles/Icons';
import GeoCountryList from '../../resources/geoCountry/GeoCountryList';
import GeoCountryCreate from '../../resources/geoCountry/GeoCountryCreate';
import GeoCountryEdit from '../../resources/geoCountry/GeoCountryEdit';
import GeoCountryShow from '../../resources/geoCountry/GeoCountryShow';
export default {
  name: 'GeoCountry',
  label: 'generic.pages.geocountry',
  icon: GeoChildIcon,
  url: 'geocountry',
  screens: {
    list: GeoCountryList,
    create: GeoCountryCreate,
    edit: GeoCountryEdit,
    show: GeoCountryShow,
  },
  resources: ['geocountries'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
