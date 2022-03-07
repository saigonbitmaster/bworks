import { vi } from 'ra-loopback3';
import generic from './generic';
import resources from './resources';
import error from './error';
import notification from './notification';
export default {
  'Internal Server Error': 'Lỗi server!',
  'Invalid current password': 'Mật khẩu hiện tại không đúng',
  Unauthorized: 'Tài khoản không hợp lệ',
  ra: vi,
  generic,
  resources,
  error,
  notification,
};
