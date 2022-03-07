import { UPDATE } from 'ra-loopback3';

const appusers = () => {
  let result = {};
  // update app user data
  result[UPDATE] = ({ apiUrl, resource, params }) => ({
    url: `${apiUrl}/${resource}/update?where=${JSON.stringify({ id: params.id })}`,
    options: {
      method: 'POST',
    },
  });
  return result;
};

const alias = {};

export default {
  alias,
  resources: {
    appusers: appusers(),
  },
};
