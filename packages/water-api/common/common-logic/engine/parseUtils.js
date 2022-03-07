'use strict';
const excel = require('xlsx');

// Vietnamese characters
exports.vietnameseCharacters = new Map([
  ['a', 'a'],
  ['A', 'a'],
  ['à', 'a'],
  ['À', 'a'],
  ['ả', 'a'],
  ['Ả', 'a'],
  ['ã', 'a'],
  ['Ã', 'a'],
  ['á', 'a'],
  ['Á', 'a'],
  ['ạ', 'a'],
  ['Ạ', 'a'],
  ['ă', 'a'],
  ['Ă', 'a'],
  ['ằ', 'a'],
  ['Ằ', 'a'],
  ['ẳ', 'a'],
  ['Ẳ', 'a'],
  ['ẵ', 'a'],
  ['Ẵ', 'a'],
  ['ắ', 'a'],
  ['Ắ', 'a'],
  ['ặ', 'a'],
  ['Ặ', 'a'],
  ['â', 'a'],
  ['Â', 'a'],
  ['ầ', 'a'],
  ['Ầ', 'a'],
  ['ẩ', 'a'],
  ['Ẩ', 'a'],
  ['ẫ', 'a'],
  ['Ẫ', 'a'],
  ['ấ', 'a'],
  ['Ấ', 'a'],
  ['ậ', 'a'],
  ['Ậ', 'a'],
  ['b', 'b'],
  ['B', 'b'],
  ['c', 'c'],
  ['C', 'c'],
  ['d', 'd'],
  ['D', 'd'],
  ['đ', 'd'],
  ['Đ', 'd'],
  ['e', 'e'],
  ['E', 'e'],
  ['è', 'e'],
  ['È', 'e'],
  ['ẻ', 'e'],
  ['Ẻ', 'e'],
  ['ẽ', 'e'],
  ['Ẽ', 'e'],
  ['é', 'e'],
  ['É', 'e'],
  ['ẹ', 'e'],
  ['Ẹ', 'e'],
  ['ê', 'e'],
  ['Ê', 'e'],
  ['ề', 'e'],
  ['Ề', 'e'],
  ['ể', 'e'],
  ['Ể', 'e'],
  ['ễ', 'e'],
  ['Ễ', 'e'],
  ['ế', 'e'],
  ['Ế', 'e'],
  ['ệ', 'e'],
  ['Ệ', 'e'],
  ['f', 'f'],
  ['F', 'f'],
  ['g', 'g'],
  ['G', 'g'],
  ['h', 'h'],
  ['H', 'h'],
  ['i', 'i'],
  ['I', 'i'],
  ['ì', 'i'],
  ['Ì', 'i'],
  ['ỉ', 'i'],
  ['Ỉ', 'i'],
  ['ĩ', 'i'],
  ['Ĩ', 'i'],
  ['í', 'i'],
  ['Í', 'i'],
  ['ị', 'i'],
  ['Ị', 'i'],
  ['j', 'j'],
  ['J', 'j'],
  ['k', 'k'],
  ['K', 'k'],
  ['l', 'l'],
  ['L', 'l'],
  ['m', 'm'],
  ['M', 'm'],
  ['n', 'n'],
  ['N', 'n'],
  ['o', 'o'],
  ['O', 'o'],
  ['ò', 'o'],
  ['Ò', 'o'],
  ['õ', 'o'],
  ['Õ', 'o'],
  ['ó', 'o'],
  ['Ó', 'o'],
  ['ọ', 'o'],
  ['Ọ', 'o'],
  ['ô', 'o'],
  ['Ô', 'o'],
  ['ồ', 'o'],
  ['Ồ', 'o'],
  ['ổ', 'o'],
  ['Ổ', 'o'],
  ['ỗ', 'o'],
  ['Ỗ', 'o'],
  ['ố', 'o'],
  ['Ố', 'o'],
  ['ộ', 'o'],
  ['Ộ', 'o'],
  ['ơ', 'o'],
  ['Ơ', 'o'],
  ['ờ', 'o'],
  ['Ờ', 'o'],
  ['ở', 'o'],
  ['Ở', 'o'],
  ['ỡ', 'o'],
  ['Ỡ', 'o'],
  ['ớ', 'o'],
  ['Ớ', 'o'],
  ['ợ', 'o'],
  ['Ợ', 'o'],
  ['p', 'p'],
  ['P', 'p'],
  ['q', 'q'],
  ['Q', 'q'],
  ['r', 'r'],
  ['R', 'r'],
  ['s', 's'],
  ['S', 's'],
  ['t', 't'],
  ['T', 't'],
  ['u', 'u'],
  ['U', 'u'],
  ['ù', 'u'],
  ['Ù', 'u'],
  ['ủ', 'u'],
  ['Ủ', 'u'],
  ['ũ', 'u'],
  ['Ũ', 'u'],
  ['ú', 'u'],
  ['Ú', 'u'],
  ['ụ', 'u'],
  ['Ụ', 'u'],
  ['ư', 'u'],
  ['Ư', 'u'],
  ['ừ', 'u'],
  ['Ừ', 'u'],
  ['ử', 'u'],
  ['Ử', 'u'],
  ['ữ', 'u'],
  ['Ữ', 'u'],
  ['ứ', 'u'],
  ['Ứ', 'u'],
  ['ự', 'u'],
  ['Ự', 'u'],
  ['v', 'v'],
  ['V', 'v'],
  ['w', 'w'],
  ['W', 'w'],
  ['x', 'x'],
  ['X', 'x'],
  ['y', 'y'],
  ['Y', 'y'],
  ['ỳ', 'y'],
  ['Ỳ', 'y'],
  ['ỷ', 'y'],
  ['Ỷ', 'y'],
  ['ỹ', 'y'],
  ['Ỹ', 'y'],
  ['ý', 'y'],
  ['Ý', 'y'],
  ['ỵ', 'y'],
  ['Ỵ', 'y'],
  ['z', 'z'],
  ['Z', 'z'],
]);

// Detect Vietnamese characters and camelize
exports.camelize = string => {
  const splitString = string.split(' ');
  const finalString = splitString
    .slice(1)
    .map(char => char[0].toString().toUpperCase() + char.slice(1))
    .reduce((acc, val) => acc + val, splitString[0]);
  return finalString;
};

exports.capitalize = strings => {
  const subCapitalize = word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  const words = strings.split(' ');
  if (words.length === 1) {
    return subCapitalize(words[0]);
  } else {
    return subCapitalize(words.map(word => subCapitalize(word)).join(' '));
  }
};

exports.decapitalize = strings => {
  const subCapitalize = word => `${word.charAt(0).toLowerCase()}${word.slice(1)}`;
  const words = strings.split(' ');
  if (words.length === 1) {
    return subCapitalize(words[0]);
  } else {
    return subCapitalize(words.map(word => subCapitalize(word)).join(' '));
  }
};

exports.removeDiacritic = (string, charset) => {
  let finalString = '';

  // Iterate over the input's characters
  for (let char of string) {
    if (char === ' ') {
      finalString += ' ';
      continue;
    }

    if (charset.has(char)) {
      finalString += charset.get(char);
    } else {
      finalString += ' ';
    }
  }

  // Return the de-Vietnamized string
  return finalString;
};

exports.translate = (sheetPath, sheetName, mapping) => {
  const workbook = excel.readFile(sheetPath);
  const sheet = workbook.Sheets[sheetName];
  const headerRegex = /^[A-Z]{1,3}1$/;
  const headerCellIndices = Object.keys(sheet).filter(cellIndices => cellIndices.match(headerRegex));
  const headerCellValues = headerCellIndices.map(hci => sheet[hci].v);
  for (let index = 0; index < headerCellIndices.length; index++) {
    const translatedHeader = mapping[headerCellValues[index]];
    sheet[headerCellIndices[index]] = {
      h: translatedHeader,
      r: `<t>${translatedHeader}</t>`,
      t: 's',
      v: translatedHeader,
      w: translatedHeader,
    };
  }
  excel.writeFile(workbook, sheetPath);
};
