const collectCsvHour = require('./collect-csv-hour');
const csv = async ({ app }) => {
  collectCsvHour({ app });
};

module.exports = csv;
