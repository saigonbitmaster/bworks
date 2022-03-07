import { Edit, Add, Delete } from '@material-ui/icons';
import { ManageMatIcon, ExportStockIcon, ReturnMatForStockIcon } from '../../styles/Icons';
import EditMatStock from './EditMatStock';
import ImportMatStock from './ImportMatStock';
import ReturnMatForStock from './ReturnMatForStock';
import Main from './Main';
export default {
  name: 'ManageMat',
  label: 'generic.pages.manageMat',
  icon: ManageMatIcon,
  url: 'manageMaterial',
  screens: {
    main: Main,
    create: ImportMatStock,
    edit: EditMatStock,
    editReturnStock: { subPath: ':id', component: ReturnMatForStock },
  },
  resources: 'materialstocks',
  active: true,
  access: {
    importStock: {
      apis: [
        { url: '/MaterialDetailTypes', method: 'get' },
        { url: '/MaterialStocks', method: 'post' },
        { url: '/MaterialStocks', method: 'get' },
        { url: '/MaterialExports/getSumExportStock', method: 'get' },
        { url: '/MaterialExports/getValueRemainStock', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/MaterialExports', method: 'get' },
        { url: '/MaterialUses/getUsedMat', method: 'get' },
        { url: '/MaterialDetailTypes/customCreate', method: 'post' },
      ],
      icon: Add,
      label: 'generic.manageMat.importStock',
    },
    exportStock: {
      apis: [
        { url: '/MaterialStocks', method: 'get' },
        { url: '/MaterialDetailTypes', method: 'get' },
        { url: '/MaterialExports/getValueRemainStock', method: 'get' },
        { url: '/MaterialStocks/{id}', method: 'get' },
        { url: '/MaterialExports/createExportingStock', method: 'post' },
        { url: '/MaterialExports/getSumExportStock', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/MaterialExports', method: 'get' },
        { url: '/MaterialUses/getUsedMat', method: 'get' },
      ],
      icon: ExportStockIcon,
      label: 'generic.manageMat.exportStock',
    },
    editStock: {
      apis: [
        { url: '/MaterialExports/getSumExportStock', method: 'get' },
        { url: '/MaterialStocks/{id}', method: 'get' },
        { url: '/MaterialDetailTypes', method: 'get' },
        { url: '/MaterialStocks/editMatStock/{id}', method: 'put' },
        { url: '/MaterialExports/getValueRemainStock', method: 'get' },
        { url: '/MaterialStocks', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/MaterialExports', method: 'get' },
        { url: '/MaterialUses/getUsedMat', method: 'get' },
      ],
      icon: Edit,
      label: 'generic.manageMat.editStock',
    },
    deleteStock: {
      apis: [
        { url: '/MaterialStocks/customDelete', method: 'get' },
        { url: '/MaterialStocks', method: 'get' },
        { url: '/MaterialExports', method: 'get' },
        { url: '/MaterialExports/getSumExportStock', method: 'get' },
        { url: '/MaterialExports/getValueRemainStock', method: 'get' },
        { url: '/AppUsers', method: 'get' },
      ],
      icon: Delete,
      label: 'generic.manageMat.deleteStock',
    },
    returnMat: {
      apis: [
        { url: '/MaterialExports/{id}', method: 'get' },
        { url: '/MaterialExports/returnMatForStock/{id}', method: 'put' },
        { url: '/MaterialExports', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/MaterialUses/getUsedMat', method: 'get' },
      ],
      icon: ReturnMatForStockIcon,
      label: 'resources.materialexports.returnMatForStock',
    },
    deleteMatExport: {
      apis: [
        { url: '/MaterialExports/customDelete', method: 'get' },
        { url: '/MaterialExports', method: 'get' },
        { url: '/AppUsers', method: 'get' },
      ],
      icon: Delete,
      label: 'generic.manageMat.deleteMatExport',
    },
  },
};
