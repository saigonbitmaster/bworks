module.exports = (markers, classPairs) => {
  // Compute the dominant status within this cluster
  const availableStatuses = markers
    .map(({ status }) => status)
    .reduce((acc, val) => {
      if (acc[val]) {
        acc[val]++;
      } else {
        acc[val] = 1;
      }
      return acc;
    }, {});

  const dominantStatus = Object.entries(availableStatuses).reduce(([key_, value_], [key, value]) =>
    value_ > value ? [key, value] : [key_, value_],
  )[0];

  const calculatedResult = { text: markers.length, index: 0 };

  if (Object.keys(classPairs).includes(dominantStatus)) {
    calculatedResult.index = classPairs[dominantStatus.toString()];
  }

  return calculatedResult;
};
