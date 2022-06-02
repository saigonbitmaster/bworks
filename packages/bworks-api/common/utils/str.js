const types = { string: true, number: true };

const strAccentsAndLowerCase = str => {
  if (types[typeof str]) {
    return str
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\u0300-\u036f]/g, '')
      .replace(new RegExp('[đ]', 'gi'), 'd');
  }
  throw new Error('strAccents Unknown type' + str);
};

const isEqualGi = (str1, str2) => {
  if (types[typeof str1] && types[typeof str2]) {
    return strAccentsAndLowerCase(str1) === strAccentsAndLowerCase(str2);
  }
  return false;
};

module.exports = {
  isEqualGi,
  strAccentsAndLowerCase,
};
