import { reduxFormChange } from '../../../constants/actions';
export const PersistenceType = {
  IMMEDIATE: 'IMMEDIATE',
  DEBOUNCE: 'DEBOUNCE',
};

const Whitelist = {
  [reduxFormChange]: PersistenceType.DEBOUNCE,
};

export function getPersistenceType(type) {
  return Whitelist[type] || null;
}
