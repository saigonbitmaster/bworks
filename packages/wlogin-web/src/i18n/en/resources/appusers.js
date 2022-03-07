import commonFields from '../commomFields';
export default {
  name: 'Employee |||| Employee',
  isWaterCounter: 'Is water meter recording employee',
  fields: {
    username: 'Nick name',
    password: 'password',
    confirmPassword: 'confirmPassword',
    address: 'address',
    mobile: 'mobile',
    email: 'Email',
    fullName: 'fullName',
    isBanned: 'isBanned',
    role: 'role',
    currentPassword: 'currentPassword',
    oldPassword: 'oldPassword',
    newPassword: 'newPassword',
    wardsInCharged: 'wardsInCharged',
    wardInChargeIds: 'wardInChargeIds',
    quarterInChargeIds: 'Quarters in charge',
    ...commonFields,
  },
  messages: {
    passwordUpdated: 'Password is updated',
    errorConfirmPassword: 'Password confirm error',
    errorNewPassword: 'Must contain a-z/A-Z và 0-9',
  },
  // <Permission>
  view: 'View employee list',
  ban: 'Temporary lock employee access',
  edit: 'Edit employee information',
  create: 'Create new employee',
  delete: 'Delete employee',
};
