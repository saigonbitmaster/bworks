export const addSpaceByLevel = (item, levelKey = 'level', addSpace = true) => {
  let prefix = '';
  let i = item[levelKey];
  if (i > 1) {
    prefix = '└';
    i -= 1;
  }
  while (i > 1) {
    prefix = '　' + prefix;
    i -= 1;
  }
  if (prefix && addSpace) {
    prefix += ' ';
  }
  return prefix;
};
