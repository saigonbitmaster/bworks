import commonFields from '../commomFields';
export default {
  name: 'Employee |||| Employee',
  isWaterCounter: 'Is meter number recordation user',
  fields: {
    username: 'Nick name',
    password: 'Password',
    confirmPassword: 'Verify password',
    address: 'Address',
    mobile: 'Mobile',
    email: 'Email',
    fullName: 'FullName',
    isBanned: 'Is locked',
    role: 'Role',
    currentPassword: 'Current password',
    oldPassword: 'Old password',
    newPassword: 'New password',
    wardsInCharged: 'Wards in charged',
    wardInChargeIds: 'Ward in charge Ids',
    quarterInChargeIds: 'Quarter in charge Ids',
    ...commonFields,
  },
  messages: {
    passwordUpdated: 'Password is updated',
    errorConfirmPassword: 'Password confirm error',
    errorNewPassword: 'Must contain a-z/A-Z và 0-9',
  },
  // <Permission>
  view: 'View user list',
  ban: 'Temporary stop user access',
  edit: 'Edit user information',
  create: 'Create new user',
  delete: 'Delete new user',
  // </Permission>
};
