import { vi } from 'ra-loopback3';
import generic from './generic';
import resources from './resources';
import error from './error';

export default {
  'Internal Server Error': 'Lỗi server!',
  ra: vi,
  generic,
  error,
  resources,
};
