import { vi } from 'ra-loopback3';
import generic from './generic';
import resources from './resources';
import error from './error';
import notification from './notification';
export default {
  'Internal Server Error': 'Lỗi server!',
  'Gateway Timeout': 'Lỗi kết nối',
  'Invalid current password': 'Mật khẩu hiện tại không đúng',
  ra: vi,
  generic,
  error,
  resources,
  notification,
};
