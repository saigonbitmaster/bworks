import { en } from 'ra-loopback3';
import generic from './generic';
import resources from './resources';
import error from './error';
import notification from './notification';
export default {
  'Internal Server Error': 'Internal Server Error!',
  'Gateway Timeout': 'Gateway Timeout',
  'Invalid current password': 'Invalid current password',
  ra: en,
  generic,
  error,
  resources,
  notification,
};
