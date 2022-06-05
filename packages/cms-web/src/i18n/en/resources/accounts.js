import commonFields from '../commomFields';
export default {
  name: 'Accounts |||| Accounts',
  fields: {
    userName: 'User name',
    fullName: 'Full Name',
    password: 'Password',
    changePassword: "Change password",
    confirmPassword: 'Confirm password',
    address: 'Address',
    mobile: 'Mobile',
    role: "Access roles",
    ban: "Ban",
    email: 'Email',
    emailVerified: "Email verified",
    messages: { 
      enterUsedEmail: "Enter a valid email address",
      enterUsedUsername: "Enter a valid username"
    },
    ...commonFields,
  },
};
