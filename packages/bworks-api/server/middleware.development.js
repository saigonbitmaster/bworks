module.exports = {
  initial: {
    './middleware/tracker': {
      enabled: true,
    },
  },
  'final:after': {
    'strong-error-handler': {
      params: {
        debug: true,
        log: true,
      },
    },
  },
};