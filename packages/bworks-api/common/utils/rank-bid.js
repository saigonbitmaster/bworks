
function rankLanguage(gitLanguages, requiredLanguages) {
  //return % of matched required languages with user github repos languages. max = 4, min = 0
  const matchedLangues = requiredLanguages.filter((language) =>
    gitLanguages.includes(language)
  );
  return (matchedLangues.length / requiredLanguages.length) * 4;
}



function rankPrice(minPrice, maxPrice, placedPrice) {
  //return price rank max = 4, min = 0. by compare place price with min and max post job price
  return (maxPrice - placedPrice)/(maxPrice - minPrice) * 4
}


function rankBid(languageRank, priceRank, hasPrototype) {
  //return final bid rank combine language rank, price rank and has prototype
  //language rank has factor 3, most importance, price rank has factor 1, has prototype to plus 1 to the rank.
  // mean that if bid has prototype it may hit 5, the absolute score
  return (languageRank*3 + priceRank)/4 + (hasPrototype? 1 : 0)

}

module.exports = {rankBid, rankLanguage, rankPrice}
/*

filter out the bid from UI of post job or place bid:
enough ada = boolean
price = boolean 
time = boolean,


match language = rank * 3 ,max = 4
price = rank * 1, max = 4
price rank =( max - placed) / (max - min) * 4 

hasPrototype = plus 1 to 5 is max total, if no prototype max is 4 

*/
