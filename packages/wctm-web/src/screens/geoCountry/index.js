// import React from 'react';
import { Add, Create, Search } from '@material-ui/icons';
import { GeoChildIcon, ViewIcon } from '../../styles/Icons';
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
    view: {
      apis: [{ url: '/GeoCountries', method: 'get' }],
      icon: ViewIcon,
      label: 'resources.geocountries.view',
    },
    edit: {
      apis: [
        { url: '/GeoCountries/{id}', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/GeoCountries', method: 'post' },
      ],
      icon: Create,
      label: 'resources.geocountries.edit',
    },
    delete: {
      apis: [{ url: '/GeoCountries/{id}', method: 'delete' }],
      icon: 'Delete',
      label: 'resources.geocountries.delete',
    },
    create: {
      apis: [
        { url: '/CtmConfigs', method: 'get' },
        { url: '/GeoCountries', method: 'post' },
      ],
      icon: Add,
      label: 'resources.geocountries.create',
    },
    examine: {
      apis: [
        { url: '/GeoCountries/{id}', method: 'get' },
        { url: '/AppUsers', method: 'get' },
      ],
      icon: Search,
      label: 'resources.geocountries.examine',
    },
    read: [],
    write: [],
  },
};
