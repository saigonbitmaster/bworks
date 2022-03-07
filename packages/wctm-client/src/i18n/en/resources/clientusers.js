import commonFields from '../commomFields';
export default {
  name: 'Employee |||| Employee',
  fields: {
    username: 'Nick name',
    password: 'Password',
    confirmPassword: 'Password verify',
    address: 'Address',
    mobile: 'Mobile',
    email: 'Email',
    fullName: 'Fullname',
    currentPassword: 'Current password',
    newPassword: 'New password',
    ...commonFields,
  },
  messages: {
    passwordUpdated: 'Password is updated',
    errorConfirmPassword: 'Password must be the same',
    errorNewPassword: 'Password must contain a-z/A-Z và 0-9',
  },
};
