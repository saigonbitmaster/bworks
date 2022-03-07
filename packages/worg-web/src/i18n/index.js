import { merge } from 'lodash';
import vi from './vi';
import en from './en';
import common from 'web-common/src/i18n/index';
const messages = merge(
  {
    en,
    vi,
  },
  common,
);

export default locale => {
  let result = messages[locale];
  return result;
};
