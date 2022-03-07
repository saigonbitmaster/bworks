export const SET_MY_ACCESS = 'SF_AUTO_SET_MY_ACCESS';

const setMyAccess = payload => ({
  type: SET_MY_ACCESS,
  payload,
  meta: {
    autoReducer: true,
    key: 'myaccess',
  },
});

export default setMyAccess;
