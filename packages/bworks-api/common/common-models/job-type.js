'use strict';
// eslint-disable-next-line no-unused-vars
const {checkWallet} = require('../utils/check-wallet.js')
const {getGitHubLanguages} = require('../utils/get-github-languages')
const {rankLanguage, rankPrice, rankBid} = require('../utils/rank-bid')
module.exports = function(JobType){
  JobType.abc = async function(msg) {
    let address = "addr_test1qrsyt5qv7pvdcqf9thpmjyv6kukpqv4nmr3tqjy6k6tm6705dl4czkn5ap78f35r0q8yudwazghgqdcad4sx2srew9vqe7c7lv"; 
    let wallet = await checkWallet(address, 100)
    let languages = await getGitHubLanguages('https://github.com/saigonbitmaster/bWorksPublic')
    let rankLanguageValue = rankLanguage(languages.languages, ['JavaScript'])
    let rankPriceValue = rankPrice(1,20, 4)
    console.log(rankLanguageValue, rankPriceValue, rankBid(rankLanguageValue, rankPriceValue, true))
    let result = {id: "123", ...wallet, ...languages.languages}
    return result
  }

  JobType.remoteMethod('abc', {
        accepts: {arg: 'msg', type: 'string'},
        http: { verb: 'post'},
        returns: {arg: 'data', type: 'object', root: true}
  });
};