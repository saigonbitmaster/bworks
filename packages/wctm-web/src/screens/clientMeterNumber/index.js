import ClientMeterNumberList from '../../resources/clientMeterNumber/ClientMeterNumberList';
import ClientMeterNumberEdit from '../../resources/clientMeterNumber/ClientMeterNumberEdit';
import ClientMeterNumberCreate from '../../resources/clientMeterNumber/ClientMeterNumberCreate';
import ClientMeterNumberHistoryList from '../../resources/clientMeterNumber/ClientMeterNumberHistoryList';
import { ClientMeterNumberIcon, DeleteIcon, ListIcon, EditIcon, HistoryIcon, ExportIcon } from '../../styles/Icons';

export default {
  name: 'clientMeterNumber',
  icon: ClientMeterNumberIcon,
  url: 'clientmeternumber',
  label: 'generic.pages.clientMeterNumber',
  resources: ['clientmeternumbers', 'clients', 'appusers'],
  screens: {
    list: ClientMeterNumberList,
    editClientMeterNumber: { component: ClientMeterNumberEdit, subPath: 'edit/:id' },
    createWithMonth: { component: ClientMeterNumberCreate, subPath: ':clientId/:month' },
    history: { component: ClientMeterNumberHistoryList, subPath: ':id' },
  },
  active: true,
  access: {
    list: {
      apis: [
        { url: '/Clients', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/ClientMeterNumbers', method: 'get' },
        { url: '/EInvoiceRanges', method: 'get' },
      ],
      icon: ListIcon,
      label: 'resources.clientmeternumbers.permission.listClient',
    },
    fillZeroTerm: {
      apis: [{ url: '/ClientMeterNumbers/fillZeroVolume', method: 'post' }],
      icon: HistoryIcon,
      label: 'resources.clientmeternumbers.permission.fillZeroTerm',
    },
    editWriteWater: {
      apis: [
        { url: '/ClientMeterNumbers/{id}', method: 'get' },
        { url: '/Clients/{id}', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/Clients', method: 'get' },
        { url: '/ClientMeterNumbers/updateMonth', method: 'post' },
        { url: '/ClientMeterNumbers/getDefaultNewMonth/{id}/{yearMonth}', method: 'get' },
        { url: '/ClientMeterNumbers/shouldReplaceEinvoice', method: 'get' },
        { url: '/ClientMeterNumbers/writeNewMonth', method: 'post' },
        { url: '/CtmFiles/download/{file}', method: 'get' },
        { url: '/ExcelFiles/{container}/upload', method: 'post' },
        { url: '/ClientMeterNumbers/importClientMeterNumbersFromExcel', method: 'get' },
      ],
      icon: EditIcon,
      label: 'resources.clientmeternumbers.permission.editWriteWater',
    },
    forceEditWriteWater: {
      apis: [
        { url: '/ClientMeterNumbers/{id}', method: 'get' },
        { url: '/Clients/{id}', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/Clients', method: 'get' },
        { url: '/ClientMeterNumbers/forceUpdateMonth', method: 'post' },
        { url: '/ClientMeterNumbers/getDefaultNewMonth/{id}/{yearMonth}', method: 'get' },
        { url: '/ClientMeterNumbers/shouldReplaceEinvoice', method: 'get' },
        { url: '/ClientMeterNumbers/writeNewMonth', method: 'post' },
        { url: '/ExcelFiles/{container}/upload', method: 'post' },
        { url: '/ClientMeterNumbers/importClientMeterNumbersFromExcel', method: 'get' },
        { url: '/CtmFiles/download/{file}', method: 'get' },
      ],
      icon: EditIcon,
      label: 'resources.clientmeternumbers.permission.forceEditWriteWater',
    },
    historyWater: {
      apis: [
        { url: '/ClientMeterNumbers', method: 'get' },
        { url: '/Clients/{id}', method: 'get' },
        { url: '/ClientMeterNumbers/delete', method: 'delete' },
      ],
      icon: HistoryIcon,
      label: 'resources.clientmeternumbers.permission.historyWater',
    },
    delete: {
      apis: [{ url: '/ClientMeterNumbers/{id}', method: 'delete' }],
      icon: DeleteIcon,
      label: 'resources.clientmeternumbers.permission.delete',
    },
    exportTemplate: {
      apis: [{ url: '/ClientMeterNumbers/fillTemplateForBulkWriting', method: 'get' }],
      icon: ExportIcon,
      label: 'resources.clientmeternumbers.permission.exportTemplate',
    },
  },
};
