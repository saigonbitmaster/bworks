//given address and an amount, check if address has enough amount of ADA to perform the bid, return: {value: 1000, isEnough: true}

const project_id = process.env.BLOCKFROST_PROJECT_ID;
const blockfrost_url = process.env.BLOCKFROST_URL;
const axios = require('axios');

/* 
let project_id = "testnetIfDtKzgYc9g9JoYya8rIcc6JclEhn82F";
let address = "addr_test1qrsyt5qv7pvdcqf9thpmjyv6kukpqv4nmr3tqjy6k6tm6705dl4czkn5ap78f35r0q8yudwazghgqdcad4sx2srew9vqe7c7lv"; */

 async function checkWallet(address, value) {
  let result = { amount: 0, isEnough: false };
  await axios({
    url: `${blockfrost_url}/${address}`,
    method: 'GET',
    headers: {
      project_id: project_id,
    },
  })
    .then(response => {
      result.amount = response.data.amount.map(item => (item.unit == 'lovelace' ? item : null))[0].quantity / 1000000;
      result.isEnough = result.amount >= value;
    })
    .catch(error => error);

  return result;
};

module.exports = {checkWallet}